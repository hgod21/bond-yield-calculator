import React, { createContext, useContext, useState } from 'react';

export interface Currency {
    code: string;
    symbol: string;
    label: string;
    locale: string;
}

export const CURRENCIES: Currency[] = [
    { code: 'USD', symbol: '$', label: 'USD ($)', locale: 'en-US' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)', locale: 'de-DE' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)', locale: 'en-GB' },
    { code: 'JPY', symbol: '¥', label: 'JPY (¥)', locale: 'ja-JP' },
    { code: 'AED', symbol: 'د.إ', label: 'AED (د.إ)', locale: 'ar-AE' },
    { code: 'INR', symbol: '₹', label: 'INR (₹)', locale: 'en-IN' },
];

interface CurrencyContextValue {
    currency: Currency;
    setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
    currency: CURRENCIES[0]!,
    setCurrency: () => { },
});

export function CurrencyProvider({ children }: { children: React.ReactNode }): React.ReactElement {
    const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]!);
    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => useContext(CurrencyContext);

/** Currency picker dropdown — drop into any header */
export function CurrencyPicker(): React.ReactElement {
    const { currency, setCurrency } = useCurrency();
    return (
        <select
            value={currency.code}
            onChange={e => setCurrency(CURRENCIES.find(c => c.code === e.target.value) ?? CURRENCIES[0]!)}
            className="text-xs bg-white/5 border border-white/15 text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-gold-400/50 cursor-pointer hover:border-white/30 transition-colors"
            aria-label="Select currency"
        >
            {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
            ))}
        </select>
    );
}
