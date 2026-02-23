import React, { useState } from 'react';
import type { CalculateBondRequest, CouponFrequency } from '@bond/shared';
import { useCurrency } from '../context/CurrencyContext';

interface BondFormProps {
    onSubmit: (request: CalculateBondRequest) => void;
    isLoading: boolean;
}

interface FormState {
    faceValue: string;
    couponRate: string;
    marketPrice: string;
    yearsToMaturity: string;
    couponFrequency: CouponFrequency;
}

const initialState: FormState = {
    faceValue: '',
    couponRate: '',
    marketPrice: '',
    yearsToMaturity: '',
    couponFrequency: 'semi-annual',
};

function isPositiveNumber(val: string): boolean {
    const n = parseFloat(val);
    return !isNaN(n) && n > 0;
}

function isNonNegativeNumber(val: string): boolean {
    const n = parseFloat(val);
    return !isNaN(n) && n >= 0;
}

export const BondForm: React.FC<BondFormProps> = ({ onSubmit, isLoading }) => {
    const [form, setForm] = useState<FormState>(initialState);
    const [focused, setFocused] = useState<string | null>(null);
    const { currency } = useCurrency();

    const isValid =
        isPositiveNumber(form.faceValue) &&
        isNonNegativeNumber(form.couponRate) &&
        isPositiveNumber(form.marketPrice) &&
        isPositiveNumber(form.yearsToMaturity);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!isValid) return;
        onSubmit({
            faceValue: parseFloat(form.faceValue),
            couponRate: parseFloat(form.couponRate),
            marketPrice: parseFloat(form.marketPrice),
            yearsToMaturity: parseFloat(form.yearsToMaturity),
            couponFrequency: form.couponFrequency,
        });
    };

    const fields = [
        {
            name: 'faceValue',
            label: 'Face Value',
            placeholder: '1,000',
            icon: currency.symbol,
            hint: 'Par value of the bond',
        },
        {
            name: 'couponRate',
            label: 'Coupon Rate',
            placeholder: '5.00',
            icon: '%',
            hint: 'Annual rate as a percentage',
        },
        {
            name: 'marketPrice',
            label: 'Market Price',
            placeholder: '980',
            icon: currency.symbol,
            hint: 'Current trading price',
        },
        {
            name: 'yearsToMaturity',
            label: 'Years to Maturity',
            placeholder: '10 or 10.5',
            icon: 'yr',
            hint: 'Decimals supported (e.g. 8.2)',
        },
    ] as const;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>

            {/* Header — single compact line */}
            <div className="flex items-center gap-2 pb-2 border-b border-white/8">
                <svg className="h-3.5 w-3.5 text-gold-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className="text-xs font-bold text-white">Bond Parameters</h2>
            </div>

            {/* Numeric Fields — 2-column grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {fields.map(({ name, label, placeholder, icon }) => {
                    const val = form[name as keyof typeof form] as string;
                    const isNum = name === 'couponRate' ? isNonNegativeNumber(val) : isPositiveNumber(val);
                    const hasError = val !== '' && !isNum;
                    const isFocused = focused === name;
                    const hasValue = val !== '';

                    return (
                        <div key={name} className="flex flex-col gap-0.5">
                            <label htmlFor={name} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                {label}
                            </label>
                            <div className={`relative rounded-lg border transition-all duration-200 ${hasError
                                ? 'border-rose-500/60 bg-rose-500/5'
                                : isFocused
                                    ? 'border-gold-400/60 bg-navy-900/80 shadow-[0_0_0_2px_rgba(212,175,55,0.08)]'
                                    : hasValue
                                        ? 'border-white/20 bg-navy-900/60'
                                        : 'border-white/10 bg-navy-900/40'
                                }`}>
                                <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold font-mono px-0.5 rounded transition-colors ${isFocused ? 'text-gold-400' : 'text-slate-500'
                                    }`}>
                                    {icon}
                                </span>
                                <input
                                    id={name}
                                    name={name}
                                    type="number"
                                    min="0"
                                    step="any"
                                    placeholder={placeholder}
                                    value={val}
                                    onChange={handleChange}
                                    onFocus={() => setFocused(name)}
                                    onBlur={() => setFocused(null)}
                                    className="w-full bg-transparent pl-8 pr-2 py-2 text-slate-100 font-mono text-sm placeholder-slate-600 focus:outline-none rounded-lg"
                                />
                            </div>
                            {hasError && (
                                <p className="text-[10px] text-rose-400">Invalid value</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Coupon Frequency */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Coupon Frequency</label>
                <div className="flex bg-navy-900/60 border border-white/10 rounded-lg p-0.5 gap-0.5">
                    {(['annual', 'semi-annual'] as CouponFrequency[]).map((freq) => (
                        <button
                            key={freq}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, couponFrequency: freq }))}
                            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${form.couponFrequency === freq
                                ? 'bg-gold-500 text-navy-900 shadow-sm shadow-gold-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {freq === 'annual' ? 'Annual' : 'Semi-Annual'}
                        </button>
                    ))}
                </div>
            </div>



            {/* Submit */}
            <button
                type="submit"
                disabled={!isValid || isLoading}
                className="relative w-full py-2.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200
                    bg-gradient-to-r from-gold-500 to-amber-400 text-navy-900
                    hover:from-gold-400 hover:to-amber-300 hover:shadow-lg hover:shadow-gold-500/30
                    active:scale-[0.98]
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                    flex items-center justify-center gap-2 overflow-hidden group"
            >
                {/* Shimmer overlay */}
                {!isLoading && isValid && (
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                )}

                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Calculating…
                    </>
                ) : (
                    <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Calculate Yield
                    </>
                )}
            </button>
        </form>
    );
};
