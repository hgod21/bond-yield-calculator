import React, { useState } from 'react';

/**
 * BondEducation
 *
 * A collapsible educational article explaining how to calculate
 * Current Yield and Yield to Maturity (YTM), with a worked example.
 * Styled to match the app's dark navy design system.
 */
export function BondEducation(): React.ReactElement {
    const [open, setOpen] = useState(false);

    return (
        <section className="max-w-7xl mx-auto w-full px-4 pb-10">
            <div className="card overflow-hidden">

                {/* ── Toggle header ─────────────────────────────────────── */}
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors group"
                    aria-expanded={open}
                >
                    <div className="flex items-center gap-3">
                        {/* Book icon */}
                        <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/25 flex items-center justify-center shrink-0">
                            <svg className="h-4 w-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">How to Calculate Bond Yield</p>
                            <p className="text-xs text-slate-500">Article by Keltner Colerick · Current Yield &amp; YTM explained</p>
                        </div>
                    </div>
                    {/* Chevron */}
                    <svg
                        className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* ── Collapsible body ───────────────────────────────────── */}
                {open && (
                    <div className="border-t border-white/8 px-6 py-8 space-y-10 text-slate-300 text-sm leading-relaxed">

                        {/* ── Current Yield ───────────────────────────────── */}
                        <div className="space-y-4">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <span className="inline-block w-1 h-5 rounded-full bg-gold-400" />
                                How to Calculate Current Yield
                            </h2>
                            <p>
                                We can calculate the yield on a bond investment using the <strong className="text-white">current yield</strong> as
                                long as we know the annual cash inflows of the investment and the market price of the security.
                                Current yield is simply the current return an investor would expect if he/she held that investment
                                for one year. It is calculated by dividing the annual income of the investment by its current market price.
                            </p>

                            {/* Formula box */}
                            <div className="rounded-xl border border-gold-500/20 bg-gold-500/5 p-4 space-y-2">
                                <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Current Yield Formula</p>
                                <div className="flex flex-col items-center py-2">
                                    <div className="text-center">
                                        <p className="text-white font-mono text-sm">Annual Income</p>
                                        <div className="border-t border-white/30 my-1 w-44 mx-auto" />
                                        <p className="text-white font-mono text-sm">Current Market Price</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-xs text-slate-400 pt-1">
                                    <p><span className="text-slate-200 font-medium">Annual Income</span> — amount the investment returns in a year</p>
                                    <p><span className="text-slate-200 font-medium">Current Market Price</span> — amount the asset is worth today</p>
                                </div>
                            </div>

                            <p>
                                Current yield is usually calculated for bonds, where the annual income is the coupon paid out, but
                                the yield could also be calculated for stocks (dividends) or any asset that pays out annually.
                                The current market price is what someone would be willing to pay — whether at a premium or discount.
                            </p>
                        </div>

                        {/* ── YTM ─────────────────────────────────────────── */}
                        <div className="space-y-4">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <span className="inline-block w-1 h-5 rounded-full bg-emerald-400" />
                                How to Calculate Yield to Maturity (YTM)
                            </h2>
                            <p>
                                <strong className="text-white">Yield to maturity (YTM)</strong> is similar to current yield, but YTM accounts for
                                the present value of a bond's future coupon payments. To calculate YTM we need the bond's current price,
                                the face / par value, the coupon value, and the number of years to maturity.
                            </p>

                            {/* Formula box */}
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Yield to Maturity Formula</p>
                                <div className="font-mono text-xs text-white text-center py-2 space-y-1">
                                    <p>Bond Price = Σ [ Coupon / (1 + YTM/2)ᵗ ] + Face Value / (1 + YTM/2)ⁿ</p>
                                </div>
                                <div className="space-y-1 text-xs text-slate-400 pt-1">
                                    <p><span className="text-slate-200 font-medium">Bond Price</span> — current price of the bond</p>
                                    <p><span className="text-slate-200 font-medium">Face Value</span> — amount paid to the bondholder at maturity</p>
                                    <p><span className="text-slate-200 font-medium">Coupon</span> — periodic coupon payment</p>
                                    <p><span className="text-slate-200 font-medium">n</span> — number of time periods until maturity</p>
                                </div>
                            </div>

                            <p>
                                YTM is the discount rate that equates the present value of all future cash flows (coupon payments +
                                face value repayment) with the bond's current price. We assume all payments are made on time and that
                                the bond is held to maturity.
                            </p>

                            {/* Premium / Discount / Par insight */}
                            <p className="text-xs text-slate-400">
                                <strong className="text-slate-200">Par Bond</strong>: Market Price = Face Value. YTM = Coupon Rate.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { label: 'Discount Bond', cond: 'Market Price < Face Value', result: 'YTM > Coupon Rate', color: 'rose' },
                                    { label: 'Par Bond', cond: 'Market Price = Face Value', result: 'YTM = Coupon Rate', color: 'gold' },
                                    { label: 'Premium Bond', cond: 'Market Price > Face Value', result: 'YTM < Coupon Rate', color: 'emerald' },
                                ].map(({ label, cond, result, color }) => (
                                    <div key={label} className={`rounded-lg border p-3 space-y-1 ${color === 'rose' ? 'border-rose-500/20 bg-rose-500/5' :
                                            color === 'emerald' ? 'border-emerald-500/20 bg-emerald-500/5' :
                                                'border-gold-500/20 bg-gold-500/5'
                                        }`}>
                                        <p className={`text-xs font-semibold ${color === 'rose' ? 'text-rose-400' :
                                                color === 'emerald' ? 'text-emerald-400' :
                                                    'text-gold-400'
                                            }`}>{label}</p>
                                        <p className="text-xs text-slate-400">{cond}</p>
                                        <p className="text-xs text-white font-medium">{result}</p>
                                    </div>
                                ))}
                            </div>

                            <p>
                                There is no closed-form algebraic solution for YTM — our calculator uses the
                                <strong className="text-white"> Newton-Raphson iterative method</strong> (converging to within 1×10⁻⁶ tolerance)
                                which is far more precise than plug-and-chug guessing.
                            </p>
                        </div>

                        {/* ── Worked example ──────────────────────────────── */}
                        <div className="space-y-4">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <span className="inline-block w-1 h-5 rounded-full bg-blue-400" />
                                Worked Example
                            </h2>
                            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
                                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Scenario</p>
                                <p>
                                    You buy a bond for <strong className="text-white">$965</strong> that matures in
                                    <strong className="text-white"> 3 years</strong>, pays semiannual coupon payments at
                                    <strong className="text-white"> 4.2%</strong>, and has a face value of
                                    <strong className="text-white"> $1,000</strong>.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <div className="rounded-lg bg-white/5 p-3 space-y-1">
                                        <p className="text-xs font-semibold text-gold-400">Current Yield</p>
                                        <p className="text-xs text-slate-400">Annual coupon = $21 × 2 = <span className="text-white">$42</span></p>
                                        <p className="text-xs text-slate-400">Current Yield = $42 / $965 = <span className="text-white font-semibold">4.35%</span></p>
                                    </div>
                                    <div className="rounded-lg bg-white/5 p-3 space-y-1">
                                        <p className="text-xs font-semibold text-emerald-400">YTM (iterative)</p>
                                        <p className="text-xs text-slate-400">6 periods · $21 coupon · FV $1,000</p>
                                        <p className="text-xs text-slate-400">YTM ≈ <span className="text-white font-semibold">5.481%</span> (annualised)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Summary ─────────────────────────────────────── */}
                        <div className="rounded-xl border border-white/10 bg-white/3 p-4 space-y-2">
                            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Key Takeaways</p>
                            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                                <li><span className="text-slate-200">Current yield</span> — quick snapshot of annual return vs. today's price.</li>
                                <li><span className="text-slate-200">YTM</span> — total return assuming held to maturity and coupons reinvested.</li>
                                <li><span className="text-gold-400">Par bond</span>: Market Price = Face Value, YTM = Coupon Rate.</li>
                                <li>Bond at <span className="text-rose-400">discount</span>: YTM &gt; coupon rate. At <span className="text-emerald-400">premium</span>: YTM &lt; coupon rate.</li>
                            </ul>
                        </div>

                    </div>
                )}

            </div>
        </section>
    );
}
