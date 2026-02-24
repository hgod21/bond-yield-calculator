import React from 'react';
import type { BondResult } from '@bond/shared';
import { formatCurrency, formatPercent } from '../utils/formatting';
import { useCurrency } from '../context/CurrencyContext';

interface ResultsCardProps {
    result: BondResult;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ result }) => {
    const { currentYield, ytm, totalInterest, premiumOrDiscount } = result;
    const { currency } = useCurrency();

    const badgeConfig = {
        Premium: {
            className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
            icon: '▲',
            glow: 'shadow-emerald-500/10',
        },
        Discount: {
            className: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
            icon: '▼',
            glow: 'shadow-rose-500/10',
        },
        Par: {
            className: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
            icon: '=',
            glow: 'shadow-slate-500/10',
        },
    }[premiumOrDiscount];

    const metrics = [
        {
            label: 'Yield to Maturity',
            value: formatPercent(ytm, 4),
            description: 'Annualised YTM via Newton-Raphson',
            accent: 'text-gold-400',
            borderColor: 'border-l-gold-400/60',
            bgGlow: 'from-gold-500/8',
            icon: (
                <svg className="h-4 w-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
        {
            label: 'Current Yield',
            value: formatPercent(currentYield, 4),
            description: 'Annual coupon ÷ market price',
            accent: 'text-emerald-400',
            borderColor: 'border-l-emerald-400/60',
            bgGlow: 'from-emerald-500/8',
            icon: (
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            label: 'Total Interest Earned',
            value: formatCurrency(totalInterest, currency),
            description: 'Sum of all coupon payments',
            accent: 'text-blue-400',
            borderColor: 'border-l-blue-400/60',
            bgGlow: 'from-blue-500/8',
            icon: (
                <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-5">
            {/* Header row */}
            <div className="flex items-center justify-between pb-4 border-b border-white/8">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white">Analysis Results</h2>
                        <p className="text-[11px] text-slate-500">Computed yield metrics</p>
                    </div>
                </div>

                {/* Premium/Discount/Par badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-md ${badgeConfig.className} ${badgeConfig.glow}`}>
                    {badgeConfig.icon} {premiumOrDiscount}
                </span>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 gap-3">
                {metrics.map((m) => (
                    <div
                        key={m.label}
                        className={`relative overflow-hidden rounded-xl border border-l-2 border-white/8 ${m.borderColor} bg-gradient-to-r ${m.bgGlow} to-transparent p-4 flex items-center gap-4 hover:border-white/15 transition-all duration-200 group`}
                    >
                        {/* Icon */}
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0 group-hover:bg-white/8 transition-colors">
                            {m.icon}
                        </div>

                        {/* Text */}
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                {m.label}
                            </span>
                            <span className={`text-2xl font-bold font-mono leading-none ${m.accent}`}>
                                {m.value}
                            </span>
                            <span className="text-[11px] text-slate-500 mt-0.5">{m.description}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contextual insight bar */}
            <div className="flex items-start gap-3 rounded-xl bg-white/3 border border-white/8 px-4 py-3">
                <svg className="h-4 w-4 text-gold-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-slate-400 leading-relaxed">
                    {premiumOrDiscount === 'Par' ? (
                        <>
                            <strong className="text-slate-200">Par Bond</strong>: Market Price = Face Value. YTM = Coupon Rate.
                        </>
                    ) : (
                        <>
                            A <strong className="text-slate-200">{premiumOrDiscount}</strong> bond trades{' '}
                            {premiumOrDiscount === 'Premium'
                                ? 'above face value — meaning YTM < coupon rate.'
                                : 'below face value — meaning YTM > coupon rate.'}
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};
