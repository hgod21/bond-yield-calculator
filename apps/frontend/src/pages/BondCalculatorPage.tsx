import React, { useState } from 'react';
import type { BondResult, CalculateBondRequest } from '@bond/shared';
import { BondForm } from '../components/BondForm';
import { ResultsCard } from '../components/ResultsCard';
import { CashFlowTable } from '../components/CashFlowTable';
import { BondEducation } from '../components/BondEducation';
import { calculateBond } from '../api/bondApi';
import { ThemeToggle } from '../context/ThemeContext';
import { CurrencyPicker } from '../context/CurrencyContext';

type AppError = { message: string };

interface BondCalculatorPageProps {
    /** Called when the user clicks ← Back to return to the dashboard. */
    onBack: () => void;
}

/**
 * BondCalculatorPage
 *
 * Full Bond Yield Calculator view extracted from App.tsx so it can be
 * mounted as one microservice page within the platform dashboard.
 * Owns its own state (result, error, loading) independently.
 */
export function BondCalculatorPage({ onBack }: BondCalculatorPageProps): React.ReactElement {
    const [result, setResult] = useState<BondResult | null>(null);
    const [error, setError] = useState<AppError | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (request: CalculateBondRequest): Promise<void> => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await calculateBond(request);
            setResult(data);
            // Scroll to results on mobile after render
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } }; message?: string })
                    ?.response?.data?.message ??
                (err as { message?: string })?.message ??
                'Failed to calculate bond yield. Please check your inputs.';
            setError({ message: Array.isArray(message) ? message.join(', ') : message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">

            {/* ── Service header ──────────────────────────────────────── */}
            <header className="border-b border-white/10 bg-navy-800/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">

                    {/* ← Back to Dashboard */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mr-1 group"
                        aria-label="Back to dashboard"
                    >
                        <svg className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="hidden sm:inline">Dashboard</span>
                    </button>

                    {/* Breadcrumb divider */}
                    <span className="text-white/20 text-sm select-none">/</span>

                    {/* Service identity */}
                    <img src="/logo.png" alt="Bond Yield Calculator" className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Bond Yield Calculator</h1>
                        <p className="text-sm text-slate-400">Fixed Income Analytics</p>
                    </div>

                    {/* Header controls */}
                    <div className="ml-auto flex items-center gap-2">
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Newton-Raphson YTM
                        </span>
                        <CurrencyPicker />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* ── Main calculator layout ──────────────────────────────── */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">

                    {/* Left – Bond parameter form */}
                    <aside className="lg:sticky lg:top-[65px]">
                        <div className="card p-4">
                            <BondForm onSubmit={handleSubmit} isLoading={isLoading} />
                        </div>
                    </aside>

                    {/* Right – Results panel */}
                    <section id="results-section" className="flex flex-col gap-6">

                        {/* Error state */}
                        {error && (
                            <div className="card p-5 border-rose-500/30 bg-rose-500/5 flex items-start gap-3">
                                <svg className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-semibold text-rose-400">Calculation Error</p>
                                    <p className="text-xs text-rose-300/70 mt-0.5">{error.message}</p>
                                </div>
                            </div>
                        )}

                        {/* Loading skeleton */}
                        {isLoading && (
                            <div className="card p-6 space-y-4 animate-pulse">
                                <div className="h-5 bg-white/10 rounded-lg w-2/5" />
                                <div className="grid grid-cols-1 gap-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-20 bg-white/5 rounded-xl" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty / welcome state */}
                        {!isLoading && !result && !error && (
                            <div className="card overflow-hidden flex flex-col">
                                {/* Gradient hero area */}
                                <div className="relative p-10 flex flex-col items-center justify-center gap-4 text-center"
                                    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 70%)' }}>
                                    {/* Animated ring */}
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-gold-500/10 animate-ping" style={{ animationDuration: '3s' }} />
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-500/5 border border-gold-500/25 flex items-center justify-center relative">
                                            <svg className="h-10 w-10 text-gold-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">Ready to Analyze</p>
                                        <p className="text-slate-400 text-sm mt-1.5 max-w-xs mx-auto leading-relaxed">
                                            Fill in the bond parameters on the left to calculate YTM, current yield, and a full periodic cash-flow schedule.
                                        </p>
                                    </div>
                                </div>

                                {/* Quick-tips strip */}
                                <div className="grid grid-cols-3 divide-x divide-white/8 border-t border-white/8">
                                    {[
                                        { label: 'Current Yield', desc: 'Coupon ÷ Market Price', color: 'text-gold-400' },
                                        { label: 'YTM', desc: 'Newton-Raphson solver', color: 'text-emerald-400' },
                                        { label: 'Cash Flows', desc: 'Full period schedule', color: 'text-blue-400' },
                                    ].map(({ label, desc, color }) => (
                                        <div key={label} className="flex flex-col items-center gap-0.5 py-4 px-2">
                                            <span className={`text-xs font-bold ${color}`}>{label}</span>
                                            <span className="text-[10px] text-slate-500 text-center">{desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {result && !isLoading && (
                            <>
                                <div className="card p-6">
                                    <ResultsCard result={result} />
                                </div>
                                <div className="card p-6">
                                    <CashFlowTable schedule={result.cashFlowSchedule} />
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </main>

            {/* ── Educational article ─────────────────────────────────── */}
            <BondEducation />

            {/* ── Footer ──────────────────────────────────────────────── */}
            <footer className="border-t border-white/5 py-4 mt-4">
                <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-600">
                    Bond Yield Calculator · Newton-Raphson YTM · Fixed Income Platform
                </div>
            </footer>
        </div>
    );
}
