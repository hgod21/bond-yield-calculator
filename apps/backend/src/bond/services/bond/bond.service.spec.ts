/**
 * @file bond.service.spec.ts
 * @description Unit tests for {@link BondService}.
 *
 * Tests are organised by scenario to cover:
 *  - Normal (at-par) bond
 *  - Zero-coupon bond
 *  - Premium bond (market price > face value)
 *  - Discount bond (market price < face value)
 *  - Edge case: 1-year annual bond
 *  - YTM internal accuracy
 *  - Cash-flow schedule shape and values
 *
 * All tests use NestJS's lightweight TestingModule so DI is wired correctly.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BondService } from './bond.service';
import { CalculateBondDto } from '../../routes/bond/dto/calculate-bond.dto';


describe('BondService', () => {
    let service: BondService;

    // Create a fresh NestJS testing module before each test so service
    // state cannot leak between test cases.
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BondService],
        }).compile();

        service = module.get<BondService>(BondService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ── Scenario 1: Normal (at-par) bond ──────────────────────────────────
    describe('calculate – Normal Bond (at par)', () => {
        it('should return currentYield ~0.05 and YTM ~0.05 for at-par bond', () => {
            const dto: CalculateBondDto = {
                faceValue: 1000,
                couponRate: 5,
                marketPrice: 1000,
                yearsToMaturity: 10,
                couponFrequency: 'annual',
            };

            const result = service.calculate(dto);

            // When priced at par the current yield equals the coupon rate.
            expect(result.currentYield).toBeCloseTo(0.05, 4);
            // YTM also equals the coupon rate for an at-par bond.
            expect(result.ytm).toBeCloseTo(0.05, 4);
            // 10 × $50 coupon = $500 total interest.
            expect(result.totalInterest).toBe(500);
            expect(result.premiumOrDiscount).toBe('Par');
            expect(result.cashFlowSchedule).toHaveLength(10);
        });
    });

    // ── Scenario 2: Zero-coupon bond ──────────────────────────────────────
    describe('calculate – Zero Coupon Bond', () => {
        it('should handle zero coupon bond correctly', () => {
            const dto: CalculateBondDto = {
                faceValue: 1000,
                couponRate: 0,
                marketPrice: 614.0,
                yearsToMaturity: 10,
                couponFrequency: 'annual',
            };

            const result = service.calculate(dto);

            // No coupon income → current yield is zero.
            expect(result.currentYield).toBe(0);
            // YTM approximates the implicit return from buying at 614 and
            // receiving 1000 at maturity (~5 %).
            expect(result.ytm).toBeCloseTo(0.0499, 3);
            expect(result.totalInterest).toBe(0);
            // Priced below par → classified as Discount.
            expect(result.premiumOrDiscount).toBe('Discount');
        });
    });

    // ── Scenario 3: Premium bond ──────────────────────────────────────────
    describe('calculate – Premium Bond', () => {
        it('should indicate Premium when market price > face value', () => {
            const dto: CalculateBondDto = {
                faceValue: 1000,
                couponRate: 8,
                marketPrice: 1100,
                yearsToMaturity: 5,
                couponFrequency: 'annual',
            };

            const result = service.calculate(dto);

            expect(result.premiumOrDiscount).toBe('Premium');
            expect(result.currentYield).toBeCloseTo(0.0727, 3);
            // YTM should be below the coupon rate for premium bonds
            // (investor pays more than par, so effective return is diluted).
            expect(result.ytm).toBeLessThan(0.08);
        });
    });

    // ── Scenario 4: Discount bond ─────────────────────────────────────────
    describe('calculate – Discount Bond', () => {
        it('should indicate Discount when market price < face value', () => {
            const dto: CalculateBondDto = {
                faceValue: 1000,
                couponRate: 5,
                marketPrice: 950,
                yearsToMaturity: 10,
                couponFrequency: 'semi-annual',
            };

            const result = service.calculate(dto);

            expect(result.premiumOrDiscount).toBe('Discount');
            // YTM should exceed the coupon rate for discount bonds
            // (investor pays less than par, boosting effective return).
            expect(result.ytm).toBeGreaterThan(0.05);
            // 10 years × 2 semi-annual periods = 20 cash-flow entries.
            expect(result.cashFlowSchedule).toHaveLength(20);
        });
    });

    // ── Scenario 5: Edge case – 1-year annual bond ────────────────────────
    describe('calculate – Edge Case (1-year annual bond)', () => {
        it('should correctly handle 1-year annual bond', () => {
            const dto: CalculateBondDto = {
                faceValue: 1000,
                couponRate: 6,
                marketPrice: 980,
                yearsToMaturity: 1,
                couponFrequency: 'annual',
            };

            const result = service.calculate(dto);

            // YTM = (60 + 20) / 980 ≈ 8.16%
            expect(result.ytm).toBeCloseTo(0.0816, 3);
            // Only one period exists for a 1-year bond.
            expect(result.cashFlowSchedule).toHaveLength(1);
            // Final (and only) period includes coupon ($60) + principal ($1000).
            expect(result.cashFlowSchedule[0]?.totalPayment).toBe(1060);
            // No remaining principal after the only period.
            expect(result.cashFlowSchedule[0]?.remainingPrincipal).toBe(0);
        });
    });

    // ── YTM internal accuracy ─────────────────────────────────────────────
    describe('calculateYTM – internal accuracy', () => {
        it('should return 0 for a zero coupon at-par bond', () => {
            // Zero coupon + price at par → no return, YTM = 0.
            const ytm = service.calculateYTM(1000, 0, 1000, 5, 1);
            expect(ytm).toBe(0);
        });

        it('should converge for a semi-annual bond', () => {
            // 5% coupon, 1000 face, 950 price, 20 periods, 2 per year.
            // Expected YTM: somewhere between 5% and 8%.
            const ytm = service.calculateYTM(1000, 25, 950, 20, 2);
            expect(ytm).toBeGreaterThan(0.05);
            expect(ytm).toBeLessThan(0.08);
        });
    });

    // ── Cash-flow schedule shape ──────────────────────────────────────────
    describe('generateCashFlowSchedule', () => {
        it('should have principal only in the final period', () => {
            // 4-period annual bond: principal repaid only in period 4.
            const schedule = service.generateCashFlowSchedule(1000, 50, 4, 1);
            // Periods 1-3 should have zero principal and full remaining balance.
            schedule.slice(0, 3).forEach((cf) => {
                expect(cf.principalPayment).toBe(0);
                expect(cf.remainingPrincipal).toBe(1000);
            });
            // Period 4 repays face value; remaining principal drops to 0.
            expect(schedule[3]?.principalPayment).toBe(1000);
            expect(schedule[3]?.remainingPrincipal).toBe(0);
        });

        it('should accumulate cumulative interest correctly', () => {
            // 3 periods × $50 coupon → cumulative should grow by 50 each period.
            const schedule = service.generateCashFlowSchedule(1000, 50, 3, 1);
            expect(schedule[0]?.cumulativeInterest).toBe(50);
            expect(schedule[1]?.cumulativeInterest).toBe(100);
            expect(schedule[2]?.cumulativeInterest).toBe(150);
        });
    });
});
