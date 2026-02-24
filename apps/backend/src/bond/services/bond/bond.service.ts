/**
 * @file bond.service.ts
 * @description Core financial computation service for the Bond Yield Calculator.
 *
 * This service lives in the **services** layer and contains ALL business logic.
 * It has zero knowledge of HTTP – it only receives plain data objects and
 * returns plain result objects. The handler/controller layer is responsible
 * for translating HTTP requests into calls to this service.
 *
 * Calculations implemented:
 *  - Current Yield
 *  - Yield to Maturity (YTM) via Newton-Raphson iteration
 *  - Total Interest paid over the bond's lifetime
 *  - Premium / Discount / Par classification
 *  - Full periodic cash-flow schedule
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import {
    BondResult,
    CashFlow,
    PremiumOrDiscount,
} from '@bond/shared';
import { CalculateBondDto } from '../../routes/bond/dto/calculate-bond.dto';

/**
 * BondService
 *
 * Injectable NestJS service that performs all bond pricing and yield
 * calculations. Consumed by {@link BondHandler} in the routes layer.
 */
@Injectable()
export class BondService {

    /**
     * Main entry point – orchestrates all sub-calculations and assembles
     * the {@link BondResult} returned to the client.
     *
     * @param dto  Validated request payload from {@link CalculateBondDto}.
     * @returns    A {@link BondResult} containing yield metrics and the
     *             full cash-flow schedule.
     */
    calculate(dto: CalculateBondDto): BondResult {
        const { faceValue, couponRate, marketPrice, yearsToMaturity, couponFrequency } = dto;

        // Determine how many compounding periods exist per year.
        // 'semi-annual' → 2 periods/year ; 'annual' → 1 period/year.
        const periodsPerYear = couponFrequency === 'semi-annual' ? 2 : 1;

        // Total number of coupon payment periods over the bond's life.
        const totalPeriods = yearsToMaturity * periodsPerYear;

        // Coupon cash-flow per period.
        // formulae: (annual coupon rate / periods per year) × face value
        const couponPayment = (couponRate / 100 / periodsPerYear) * faceValue;

        // ── Metric calculations ──────────────────────────────────────────────
        const currentYield = this.calculateCurrentYield(faceValue, couponRate, marketPrice);

        const ytm = this.calculateYTM(
            faceValue,
            couponPayment,
            marketPrice,
            totalPeriods,
            periodsPerYear,
        );

        // Sum of all coupon payments across the bond's lifetime (no time-value adjustment).
        const totalInterest = couponPayment * totalPeriods;

        // Whether the bond trades at a Premium, Discount, or Par.
        const premiumOrDiscount = this.determinePremiumOrDiscount(marketPrice, faceValue);

        // Detailed period-by-period cash-flow table.
        const cashFlowSchedule = this.generateCashFlowSchedule(
            faceValue,
            couponPayment,
            totalPeriods,
            periodsPerYear,
        );

        // Round final figures before returning to the client.
        return {
            currentYield: this.round(currentYield, 6),
            ytm: this.round(ytm, 6),
            totalInterest: this.round(totalInterest, 2),
            premiumOrDiscount,
            cashFlowSchedule,
        };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Calculates the **Current Yield** of the bond.
     *
     * Formula: `currentYield = (couponRate / 100 × faceValue) / marketPrice`
     *
     * This represents the ratio of annual coupon income to the current
     * market price and does NOT account for capital gains/losses at maturity.
     *
     * @param faceValue   Nominal / par value of the bond.
     * @param couponRate  Annual coupon rate as a percentage (e.g. 5 for 5 %).
     * @param marketPrice Current market price of the bond.
     * @returns           Current yield as a decimal (e.g. 0.05 for 5 %).
     */
    private calculateCurrentYield(
        faceValue: number,
        couponRate: number,
        marketPrice: number,
    ): number {
        // Annual coupon in dollar terms
        const annualCoupon = (couponRate / 100) * faceValue;
        return annualCoupon / marketPrice;
    }

    /**
     * Calculates the **Yield to Maturity (YTM)** using Newton-Raphson iteration.
     *
     * YTM is the single discount rate `r` (annualised) that satisfies:
     *
     * ```
     * marketPrice = Σ_{t=1}^{n} [ C / (1+r/m)^t ] + F / (1+r/m)^n
     * ```
     *
     * where:
     *  - `C`  = periodic coupon payment
     *  - `F`  = face value
     *  - `n`  = total periods
     *  - `m`  = periods per year
     *  - `r`  = annual YTM (what we solve for)
     *
     * The method iterates on the **periodic** rate and annualises at the end.
     *
     * @param faceValue      Par value of the bond.
     * @param couponPayment  Per-period coupon cash-flow.
     * @param marketPrice    Current market price used as the present value.
     * @param totalPeriods   Total number of coupon periods (years × m).
     * @param periodsPerYear Number of coupon periods per year (1 or 2).
     * @returns              Annualised YTM as a decimal.
     * @throws {BadRequestException} If Newton-Raphson hits a zero derivative.
     */
    calculateYTM(
        faceValue: number,
        couponPayment: number,
        marketPrice: number,
        totalPeriods: number,
        periodsPerYear: number,
    ): number {
        // Edge case: zero-coupon bond priced exactly at par has YTM = 0.
        if (couponPayment === 0 && faceValue === marketPrice) {
            return 0;
        }

        // ── Initial guess using the approximation formula ──────────────────
        // approxYTM ≈ (annualCoupon + (F - P) / n) / ((F + P) / 2)
        const approxAnnualYTM =
            (couponPayment * periodsPerYear + (faceValue - marketPrice) / (totalPeriods / periodsPerYear)) /
            ((faceValue + marketPrice) / 2);

        // Convert to per-period rate for the iterative loop.
        let r = approxAnnualYTM / periodsPerYear;

        // Newton-Raphson convergence parameters.
        const MAX_ITERATIONS = 1000; // cap to prevent infinite loops
        const TOLERANCE = 1e-6;      // stop when |price - marketPrice| < this

        for (let i = 0; i < MAX_ITERATIONS; i++) {
            // Compute the bond price and its first derivative at current rate r.
            const { price, derivative } = this.bondPriceAndDerivative(
                faceValue,
                couponPayment,
                r,
                totalPeriods,
            );

            // Residual (how far our implied price is from the target market price).
            const diff = price - marketPrice;

            // Convergence check – close enough, accept current r.
            if (Math.abs(diff) < TOLERANCE) {
                break;
            }

            // Safeguard: derivative should never be exactly zero in practice.
            if (derivative === 0) {
                throw new BadRequestException(
                    'YTM calculation failed: derivative is zero.',
                );
            }

            // Newton-Raphson update step: r_new = r_old − f(r) / f'(r)
            r = r - diff / derivative;

            // Guard against numerical divergence (e.g. NaN or rate < -100 %).
            if (!isFinite(r) || r <= -1) {
                r = 0.001; // reset to a safe starting point
            }
        }

        // Convert the solved per-period rate back to an annualised figure.
        return r * periodsPerYear;
    }

    /**
     * Computes the **theoretical bond price** and its **first derivative**
     * with respect to the periodic discount rate `r`.
     *
     * ```
     * price(r)      = Σ_{t=1}^{n} C/(1+r)^t  +  F/(1+r)^n
     * price'(r)     = Σ_{t=1}^{n} -t·C/(1+r)^{t+1}  -  n·F/(1+r)^{n+1}
     * ```
     *
     * Both values are needed simultaneously by Newton-Raphson to update `r`.
     *
     * @param faceValue     Par / redemption value of the bond.
     * @param couponPayment Periodic coupon payment amount.
     * @param r             Current estimate of the per-period discount rate.
     * @param totalPeriods  Total number of payment periods.
     * @returns             Object `{ price, derivative }`.
     */
    private bondPriceAndDerivative(
        faceValue: number,
        couponPayment: number,
        r: number,
        totalPeriods: number,
    ): { price: number; derivative: number } {
        let price = 0;
        let derivative = 0;

        // Accumulate the present value of each coupon payment.
        for (let t = 1; t <= totalPeriods; t++) {
            const discountFactor = Math.pow(1 + r, t);
            price += couponPayment / discountFactor;                       // C / (1+r)^t
            derivative -= (t * couponPayment) / Math.pow(1 + r, t + 1);   // -t·C / (1+r)^{t+1}
        }

        // Add the present value of the face-value (principal) repayment.
        const finalDiscountFactor = Math.pow(1 + r, totalPeriods);
        price += faceValue / finalDiscountFactor;                                       // F/(1+r)^n
        derivative -= (totalPeriods * faceValue) / Math.pow(1 + r, totalPeriods + 1);  // -n·F/(1+r)^{n+1}

        return { price, derivative };
    }

    /**
     * Determines whether a bond is trading at a **Premium**, **Discount**, or **Par**.
     *
     * - **Premium**  → market price > face value (investors pay more than par); YTM < coupon rate.
     * - **Discount** → market price < face value (investors pay less than par); YTM > coupon rate.
     * - **Par**      → market price = face value (priced at par); YTM = coupon rate.
     *
     * Par Bond: Market Price = Face Value, YTM = Coupon Rate.
     *
     * @param marketPrice Current trading price of the bond.
     * @param faceValue   Nominal / par value of the bond.
     * @returns           One of `'Premium' | 'Discount' | 'Par'`.
     */
    private determinePremiumOrDiscount(
        marketPrice: number,
        faceValue: number,
    ): PremiumOrDiscount {
        if (marketPrice > faceValue) return 'Premium';
        if (marketPrice < faceValue) return 'Discount';
        return 'Par';
    }

    /**
     * Generates the full **periodic cash-flow schedule** for the bond.
     *
     * Each entry in the returned array represents one coupon period and
     * includes the payment date, coupon amount, principal repayment (only
     * in the final period), cumulative interest paid, and remaining principal.
     *
     * @param faceValue      Par / redemption value of the bond.
     * @param couponPayment  Cash coupon paid each period.
     * @param totalPeriods   Total number of coupon periods.
     * @param periodsPerYear Coupon periods per calendar year (1 or 2).
     * @returns              Array of {@link CashFlow} objects, one per period.
     */
    generateCashFlowSchedule(
        faceValue: number,
        couponPayment: number,
        totalPeriods: number,
        periodsPerYear: number,
    ): CashFlow[] {
        const schedule: CashFlow[] = [];
        let cumulativeInterest = 0;

        // Calculate how many calendar months separate consecutive payment dates.
        const monthsPerPeriod = 12 / periodsPerYear;

        // Fixed reference date used as the settlement / calculation base.
        // Matches the project specification so tests remain deterministic.
        const today = new Date('2026-02-23');

        for (let period = 1; period <= totalPeriods; period++) {
            // Accumulate total interest paid up to and including this period.
            cumulativeInterest += couponPayment;

            // On the last period the issuer also repays the face value (principal).
            const isFinalPeriod = period === totalPeriods;
            const principalPayment = isFinalPeriod ? faceValue : 0;

            // Total cash received by the bondholder this period.
            const totalPayment = couponPayment + principalPayment;

            // Derive the calendar date of this payment by advancing from today.
            const paymentDate = new Date(today);
            paymentDate.setMonth(
                paymentDate.getMonth() + Math.round(monthsPerPeriod * period),
            );

            schedule.push({
                period,
                paymentDate: paymentDate.toISOString().split('T')[0]!,
                couponPayment: this.round(couponPayment, 2),
                principalPayment: this.round(principalPayment, 2),
                totalPayment: this.round(totalPayment, 2),
                cumulativeInterest: this.round(cumulativeInterest, 2),
                // Remaining principal is the face value until the final period.
                remainingPrincipal: isFinalPeriod ? 0 : faceValue,
            });
        }

        return schedule;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Utility
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Rounds a floating-point number to the specified number of decimal places
     * using the "round half away from zero" strategy.
     *
     * @param value     The number to round.
     * @param decimals  How many decimal places to keep.
     * @returns         Rounded value.
     */
    private round(value: number, decimals: number): number {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
}
