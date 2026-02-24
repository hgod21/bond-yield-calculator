/**
 * @file app.controller.ts
 * @description Root route so GET / returns a friendly response instead of 404.
 */

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    root(): { message: string; api: string } {
        return {
            message: 'Bond Yield Calculator API',
            api: 'POST /bond/calculate',
        };
    }
}
