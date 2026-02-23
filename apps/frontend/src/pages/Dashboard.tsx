import React from 'react';
import { ThemeToggle } from '../context/ThemeContext';

// ── Service tile definitions ───────────────────────────────────────────────
// Add new microservices here as the platform grows.
// Set `available: true` to make a tile clickable.
interface Service {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    icon: React.ReactElement;
    accentColor: string;        // Tailwind border/text color token
    bgColor: string;            // Tailwind bg color token
    available: boolean;
    badge?: string;             // optional status label
}

const SERVICES: Service[] = [
    {
        id: 'bond-calculator',
        name: 'Bond Yield Calculator',
        subtitle: 'Fixed Income Analytics',
        description:
            'Calculate yield to maturity, current yield, premium/discount status and a full periodic cash-flow schedule for any bond.',
        icon: (
            <img src="/logo.png" alt="Bond Yield Calculator" className="w-10 h-10 rounded-xl object-cover" />
        ),
        accentColor: 'border-gold-500/40 text-gold-400',
        bgColor: 'bg-gold-500/10',
        available: true,
        badge: 'Live',
    },
    {
        id: 'stock-screener',
        name: 'Stock Screener',
        subtitle: 'Equity Analytics',
        description:
            'Filter and rank equities by P/E, dividend yield, market cap, momentum and custom factor scores.',
        icon: (
            <svg className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
        ),
        accentColor: 'border-blue-500/30 text-blue-400',
        bgColor: 'bg-blue-500/10',
        available: false,
        badge: 'Coming Soon',
    },
    {
        id: 'loan-calculator',
        name: 'Loan Calculator',
        subtitle: 'Debt Amortisation',
        description:
            'Generate full EMI schedules, compare loan offers side-by-side and visualise principal vs interest splits.',
        icon: (
            <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        accentColor: 'border-emerald-500/30 text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        available: false,
        badge: 'Coming Soon',
    },
    {
        id: 'portfolio-tracker',
        name: 'Portfolio Tracker',
        subtitle: 'Asset Allocation',
        description:
            'Track multi-asset portfolios in real time, monitor allocation drift and calculate risk-adjusted returns.',
        icon: (
            <svg className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
        ),
        accentColor: 'border-purple-500/30 text-purple-400',
        bgColor: 'bg-purple-500/10',
        available: false,
        badge: 'Coming Soon',
    },
];

// ── Props ──────────────────────────────────────────────────────────────────
interface DashboardProps {
    /** Called when the user clicks an available service tile. */
    onNavigate: (serviceId: string) => void;
}

/**
 * Dashboard
 *
 * Landing page of the Fixed Income Platform.
 * Displays all registered microservice tiles in a responsive grid.
 * Available services are clickable; upcoming ones are dimmed.
 */
export function Dashboard({ onNavigate }: DashboardProps): React.ReactElement {
    return (
        <div className="min-h-screen flex flex-col">

            {/* ── Platform header ─────────────────────────────────────── */}
            <header className="border-b border-white/10 bg-navy-800/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
                    <img src="/logo.png" alt="Platform Logo" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">Fixed Income Platform</h1>
                        <p className="text-xs text-slate-400">Microservice Dashboard</p>
                    </div>
                    {/* Live services count badge */}
                    <div className="ml-auto flex items-center gap-2">
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {SERVICES.filter(s => s.available).length} Service{SERVICES.filter(s => s.available).length !== 1 ? 's' : ''} Live
                        </span>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* ── Hero ────────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto w-full px-4 pt-10 pb-6">
                <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">Services</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Select a microservice to get started
                </h2>
                <p className="text-slate-400 mt-2 text-sm max-w-xl">
                    Each tile is an independently deployable analytics service.
                    Click an active tile to launch it, or check back for upcoming services.
                </p>
            </div>

            {/* ── Service tiles grid ──────────────────────────────────── */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
                    {SERVICES.map((svc) => (
                        <ServiceTile
                            key={svc.id}
                            service={svc}
                            onClick={() => svc.available && onNavigate(svc.id)}
                        />
                    ))}
                </div>
            </main>

            {/* ── Footer ──────────────────────────────────────────────── */}
            <footer className="border-t border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-600">
                    Fixed Income Platform · Microservice Architecture · {new Date().getFullYear()}
                </div>
            </footer>
        </div>
    );
}

// ── ServiceTile sub-component ──────────────────────────────────────────────

interface ServiceTileProps {
    service: Service;
    onClick: () => void;
}

function ServiceTile({ service, onClick }: ServiceTileProps): React.ReactElement {
    const isAvailable = service.available;

    return (
        <div
            onClick={onClick}
            role={isAvailable ? 'button' : undefined}
            tabIndex={isAvailable ? 0 : undefined}
            onKeyDown={(e) => { if (isAvailable && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
            className={[
                'card p-6 flex flex-col gap-4 transition-all duration-300 relative overflow-hidden group',
                isAvailable
                    ? 'cursor-pointer hover:border-white/25 hover:shadow-2xl hover:-translate-y-1 hover:bg-navy-700/60'
                    : 'opacity-50 cursor-not-allowed select-none',
            ].join(' ')}
        >
            {/* Subtle glow on hover (available tiles only) */}
            {isAvailable && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)' }}
                />
            )}

            {/* Icon + badge row */}
            <div className="flex items-start justify-between">
                <div className={`w-14 h-14 rounded-2xl border ${service.accentColor} ${service.bgColor} flex items-center justify-center shrink-0`}>
                    {service.icon}
                </div>

                {/* Status badge */}
                {service.badge && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${isAvailable
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-white/5 text-slate-500 border-white/10'
                        }`}>
                        {service.badge}
                    </span>
                )}
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1 flex-1">
                <h3 className="text-sm font-bold text-white leading-snug">{service.name}</h3>
                <p className={`text-xs font-medium ${service.accentColor.split(' ')[1]}`}>{service.subtitle}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{service.description}</p>
            </div>

            {/* Launch arrow (available only) */}
            {isAvailable && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-400 mt-auto group-hover:gap-2.5 transition-all duration-200">
                    Launch service
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </div>
            )}
        </div>
    );
}
