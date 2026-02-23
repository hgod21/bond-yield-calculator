import axios from 'axios';
import type { CalculateBondRequest, BondResult } from '@bond/shared';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10_000,
});

export async function calculateBond(
    request: CalculateBondRequest,
): Promise<BondResult> {
    const response = await apiClient.post<BondResult>('/bond/calculate', request);
    return response.data;
}
