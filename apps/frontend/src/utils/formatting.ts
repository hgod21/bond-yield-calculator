import type { Currency } from '../context/CurrencyContext';

/**
 * Format a number as currency using the selected currency.
 * e.g. 1234.56 → "$1,234.56" (USD) or "₹1,234.56" (INR)
 */
export function formatCurrency(value: number, currency?: Currency): string {
    const code = currency?.code ?? 'USD';
    const locale = currency?.locale ?? 'en-US';

    // JPY has no decimal places by convention
    const decimals = code === 'JPY' ? 0 : 2;

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format a decimal as a percentage with N decimal places.
 * e.g. 0.0543 → "5.43%"
 */
export function formatPercent(value: number, decimals = 2): string {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format a date string from ISO (e.g. "2026-08-23") to display format (e.g. "Aug 23, 2026")
 */
export function formatDate(isoDate: string): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(isoDate));
}
