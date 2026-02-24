/**
 * @file bond.route.ts
 * @description NestJS HTTP route controller for the Bond Yield Calculator API.
 *
 * This file owns ALL HTTP-specific concerns for the `/bond` routes:
 *  - The `@Controller` prefix that maps to `/bond`
 *  - HTTP method decorators (`@Post`, `@Get`, …)
 *  - Response-code decorators (`@HttpCode`)
 *  - Body / Param / Query extraction decorators (`@Body`, …)
 *
 * It intentionally contains **no business logic**. Once the request has been
 * parsed and validated (by NestJS's global ValidationPipe), it delegates
 * straight to {@link BondHandler} and returns whatever the handler resolves.
 *
 * Layer diagram:
 *   HTTP Request  →  BondRoute  →  BondHandler  →  BondService
 */

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { BondHandler } from './bond.handler';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import { BondResult } from '@bond/shared';

/**
 * BondRoute
 *
 * NestJS controller that exposes the `/bond` endpoint group.
 * All routes in this controller share the `/bond` prefix defined in
 * the `@Controller` decorator.
 */
@Controller('bond')
export class BondRoute {
    constructor(
        /** The handler layer that sits between this route and the service. */
        private readonly bondHandler: BondHandler,
    ) { }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /bond/calculate
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Calculates bond yield metrics for the given input.
     *
     * **Endpoint:** `POST /bond/calculate`
     *
     * **Request body:** {@link CalculateBondDto} – validated automatically by
     * NestJS's global ValidationPipe before this method is called.
     *
     * **Response (200 OK):** {@link BondResult} containing:
     *  - `currentYield`      – ratio of annual coupon to market price
     *  - `ytm`               – yield to maturity (Newton-Raphson)
     *  - `totalInterest`     – sum of all coupon payments over the bond's life
     *  - `premiumOrDiscount` – 'Premium' | 'Discount' | 'Par'
     *      (Par Bond: Market Price = Face Value, YTM = Coupon Rate)
     *  - `cashFlowSchedule`  – per-period breakdown of payments
     *
     * @param dto  Validated request body, automatically bound by `@Body()`.
     * @returns    {@link BondResult} serialised as JSON.
     */
    @Post('calculate')
    @HttpCode(HttpStatus.OK) // Explicit 200 (NestJS defaults POST to 201)
    calculate(@Body() dto: CalculateBondDto): BondResult {
        return this.bondHandler.handleCalculate(dto);
    }
}
