/**
 * @file main.ts
 * @description Application bootstrap entry point for the Bond Yield Calculator API.
 *
 * This file is the first thing executed when the NestJS process starts.
 * It performs three setup steps before the server begins accepting connections:
 *  1. Creates the NestJS application instance from {@link AppModule}.
 *  2. Configures CORS so the React frontend can call the API.
 *  3. Registers the global ValidationPipe to auto-validate all request bodies.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * bootstrap
 *
 * Async factory function that initialises and starts the NestJS HTTP server.
 * Wrapped in `void` at the call site to satisfy the "no floating promise" rule.
 */
async function bootstrap(): Promise<void> {
    // Create the root application instance using the root module.
    const app = await NestFactory.create(AppModule);

    // ── CORS configuration ────────────────────────────────────────────────
    // Allow: localhost (dev), FRONTEND_URL list, and any *.vercel.app (preview + prod).
    const explicitOrigins = process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
        : [];
    const allowedSet = new Set([
        'http://localhost:5173',
        'http://localhost:3000',
        ...explicitOrigins,
    ]);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedSet.has(origin) || origin.endsWith('.vercel.app')) {
                return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        },
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    });

    // ── Global validation pipe ────────────────────────────────────────────
    // Automatically validates every incoming request body using the class-validator
    // decorators defined in each DTO.
    //
    // Options explained:
    //  whitelist              – strips any properties not declared in the DTO
    //  forbidNonWhitelisted   – returns 400 if extra properties are present
    //  transform              – coerces plain JSON values to their DTO types
    //  enableImplicitConversion – handles query/param strings → number/boolean
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    // ── Start listening ───────────────────────────────────────────────────
    // Default to port 3000; can be overridden via PORT environment variable
    // (useful in Docker / cloud deployments).
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`🚀 Bond Yield API running on http://localhost:${port}`);
}

// Kick off bootstrap; `void` suppresses the "unhandled promise" linter warning.
void bootstrap();
