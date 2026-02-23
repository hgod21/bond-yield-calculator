/**
 * @file bond.handler.ts
 * @description Handler layer for bond-related HTTP endpoints.
 *
 * The handler sits between the **route** (NestJS controller / HTTP decorators)
 * and the **service** (business logic). Its only responsibility is to call the
 * appropriate service method and return the result. This separation makes it
 * easy to unit-test handler logic without spinning up an HTTP server and
 * without coupling tests to NestJS HTTP decorators.
 *
 * Layer diagram:
 *   HTTP Request
 *       │
 *       ▼
 *   BondRoute  ← HTTP decorators live here (@Controller, @Post, @Body, …)
 *       │
 *       ▼
 *   BondHandler  ← You are here: delegates to the service, can add
 *       │           cross-cutting concerns (logging, auth checks, mapping)
 *       ▼
 *   BondService  ← Pure financial computation, no HTTP knowledge
 */

import { Injectable } from '@nestjs/common';
import { BondService } from '../../services/bond/bond.service';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import { BondResult } from '@bond/shared';

/**
 * BondHandler
 *
 * Injectable handler that delegates bond calculation requests to
 * {@link BondService}. Add logging, rate-limiting guards, or request
 * transformation here without touching either the route or the service.
 */
@Injectable()
export class BondHandler {
    constructor(
        /** Injected service that performs all financial calculations. */
        private readonly bondService: BondService,
    ) { }

    /**
     * Handles the "calculate bond" use-case.
     *
     * Receives a validated {@link CalculateBondDto}, delegates the heavy
     * computation to {@link BondService.calculate}, and returns the assembled
     * {@link BondResult} to the caller (the route controller).
     *
     * @param dto  Validated bond calculation input data.
     * @returns    A {@link BondResult} with yield metrics and cash-flow schedule.
     */
    handleCalculate(dto: CalculateBondDto): BondResult {
        // Delegate directly to the service – the handler intentionally
        // contains no financial logic of its own.
        return this.bondService.calculate(dto);
    }
}
