/**
 * @file calculate-bond.dto.ts
 * @description Data Transfer Object (DTO) for the bond calculation endpoint.
 *
 * This DTO defines the shape and validation rules for the incoming
 * POST /bond/calculate request body. NestJS ValidationPipe enforces
 * each decorator automatically before the handler is invoked.
 */

import { IsNumber, IsPositive, IsEnum, Min } from 'class-validator';
import { CouponFrequency } from '@bond/shared';

/**
 * CalculateBondDto
 *
 * Carries the five user-provided inputs needed to price a bond and derive
 * its yield metrics. All fields are required (no optional properties).
 */
export class CalculateBondDto {
    /**
     * The nominal / par value of the bond that the issuer will repay at maturity.
     * Must be a positive number (e.g. 1000).
     */
    @IsNumber()
    @IsPositive()
    faceValue!: number;

    /**
     * The annual coupon rate expressed as a percentage (e.g. 5 for 5%).
     * Zero is allowed (zero-coupon bond), but negative values are rejected.
     */
    @IsNumber()
    @Min(0)
    couponRate!: number;

    /**
     * The current market price of the bond.
     * Must be a positive number; drives the current-yield and YTM calculations.
     */
    @IsNumber()
    @IsPositive()
    marketPrice!: number;

    /**
     * Remaining time until the bond matures, in whole or fractional years.
     * Must be a positive number (e.g. 10 for a 10-year bond).
     */
    @IsNumber()
    @IsPositive()
    yearsToMaturity!: number;

    /**
     * How often coupon payments are made per year.
     * Accepted values: 'annual' | 'semi-annual'.
     */
    @IsEnum(['annual', 'semi-annual'])
    couponFrequency!: CouponFrequency;
}
