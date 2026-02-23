/**
 * @file app.module.ts
 * @description Root NestJS module for the Bond Yield Calculator API.
 *
 * AppModule is the top-level module that NestJS uses to build the
 * application dependency graph. It imports all feature modules so their
 * controllers and providers become part of the application context.
 *
 * Current feature modules:
 *  - {@link BondModule} – exposes the `/bond` route group and all bond
 *    calculation logic.
 */

import { Module } from '@nestjs/common';
import { BondModule } from './bond/bond.module';

/**
 * AppModule
 *
 * The root module bootstrapped in {@link bootstrap} (`main.ts`).
 * Add new feature modules to the `imports` array as the API grows.
 */
@Module({
    imports: [
        BondModule, // Registers POST /bond/calculate and all bond providers
    ],
})
export class AppModule { }
