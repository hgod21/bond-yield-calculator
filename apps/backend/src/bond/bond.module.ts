/**
 * @file bond.module.ts
 * @description NestJS feature module that wires together all bond-related
 *              providers and controllers using the new routes/services structure.
 *
 * Module responsibility map:
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  BondModule                                                  │
 *  │                                                              │
 *  │  controllers: [BondRoute]   ← HTTP entry-point              │
 *  │  providers:   [BondHandler] ← handler (bridges route ↔ svc) │
 *  │               [BondService] ← business / financial logic     │
 *  └──────────────────────────────────────────────────────────────┘
 *
 * Imported by {@link AppModule} to register the `/bond` route group.
 */

import { Module } from '@nestjs/common';

// HTTP layer – controller that maps incoming requests to the handler
import { BondRoute } from './routes/bond/bond.route';

// Handler layer – delegates HTTP calls to the service
import { BondHandler } from './routes/bond/bond.handler';

// Service layer – all financial computation logic
import { BondService } from './services/bond/bond.service';

@Module({
    /**
     * controllers: NestJS registers these classes as HTTP route handlers.
     * Only classes decorated with @Controller belong here.
     */
    controllers: [BondRoute],

    /**
     * providers: All @Injectable classes needed within this module.
     * BondHandler and BondService are both injected via NestJS DI.
     */
    providers: [BondHandler, BondService],
})
export class BondModule { }
