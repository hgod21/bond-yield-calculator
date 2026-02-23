export type CouponFrequency = 'annual' | 'semi-annual';
export interface CalculateBondRequest {
    faceValue: number;
    couponRate: number;
    marketPrice: number;
    yearsToMaturity: number;
    couponFrequency: CouponFrequency;
}
export interface CashFlow {
    period: number;
    paymentDate: string;
    couponPayment: number;
    principalPayment: number;
    totalPayment: number;
    cumulativeInterest: number;
    remainingPrincipal: number;
}
export type PremiumOrDiscount = 'Premium' | 'Discount' | 'Par';
export interface BondResult {
    currentYield: number;
    ytm: number;
    totalInterest: number;
    premiumOrDiscount: PremiumOrDiscount;
    cashFlowSchedule: CashFlow[];
}
//# sourceMappingURL=bond.types.d.ts.map