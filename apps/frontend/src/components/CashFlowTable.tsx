import React, { useState } from 'react';
import type { CashFlow } from '@bond/shared';
import { formatCurrency, formatDate } from '../utils/formatting';
import { useCurrency } from '../context/CurrencyContext';

interface CashFlowTableProps {
    schedule: CashFlow[];
}

const PAGE_SIZE = 10;

export const CashFlowTable: React.FC<CashFlowTableProps> = ({ schedule }) => {
    const [page, setPage] = useState(0);
    const { currency } = useCurrency();
    const totalPages = Math.ceil(schedule.length / PAGE_SIZE);
    const paginated = schedule.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const headers = [
        { label: '#', align: 'text-center' },
        { label: 'Payment Date', align: 'text-left' },
        { label: 'Coupon', align: 'text-right' },
        { label: 'Principal', align: 'text-right' },
        { label: 'Total Payment', align: 'text-right' },
        { label: 'Cumul. Interest', align: 'text-right' },
        { label: 'Remaining Par', align: 'text-right' },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white">Cash Flow Schedule</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {schedule.length} periods • Full amortization table
                    </p>
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="p-1.5 rounded-lg border border-white/10 hover:border-white/25 disabled:opacity-30 
                         hover:bg-white/5 transition-all duration-150 disabled:cursor-not-allowed"
                            aria-label="Previous page"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-xs text-slate-400 font-mono">
                            {page + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="p-1.5 rounded-lg border border-white/10 hover:border-white/25 disabled:opacity-30 
                         hover:bg-white/5 transition-all duration-150 disabled:cursor-not-allowed"
                            aria-label="Next page"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[680px]">
                    <thead className="bg-navy-900/60">
                        <tr>
                            {headers.map(({ label, align }) => (
                                <th key={label} className={`table-header ${align} first:pl-4 last:pr-4`}>
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((cf) => {
                            const isFinal = cf.remainingPrincipal === 0;
                            return (
                                <tr
                                    key={cf.period}
                                    className={`table-row ${isFinal ? 'bg-gold-500/5' : ''}`}
                                >
                                    <td className="table-cell text-center font-mono text-slate-400 text-xs pl-4">
                                        {cf.period}
                                    </td>
                                    <td className="table-cell text-left text-slate-300 pl-4">
                                        {formatDate(cf.paymentDate)}
                                    </td>
                                    <td className="table-cell text-emerald-400">
                                        {formatCurrency(cf.couponPayment, currency)}
                                    </td>
                                    <td className="table-cell text-blue-400">
                                        {cf.principalPayment > 0
                                            ? formatCurrency(cf.principalPayment, currency)
                                            : '—'}
                                    </td>
                                    <td className={`table-cell font-semibold ${isFinal ? 'text-gold-400' : 'text-slate-100'}`}>
                                        {formatCurrency(cf.totalPayment, currency)}
                                    </td>
                                    <td className="table-cell text-slate-300">
                                        {formatCurrency(cf.cumulativeInterest, currency)}
                                    </td>
                                    <td className={`table-cell pr-4 ${isFinal ? 'text-rose-400' : 'text-slate-300'}`}>
                                        {isFinal ? 'Redeemed' : formatCurrency(cf.remainingPrincipal, currency)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
