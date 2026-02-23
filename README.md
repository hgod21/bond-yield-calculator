# 📈 Bond Yield Calculator

A production-ready **Bond Yield Calculator** built as a pnpm monorepo.

**Stack**: React + Vite + TypeScript (frontend) · NestJS + TypeScript (backend) · Shared types package

---

## 🏗 Architecture

```
bond-yield-calculator/
├── apps/
│   ├── frontend/     React + Vite + Tailwind CSS
│   └── backend/      NestJS REST API
├── packages/
│   └── shared/       Shared TypeScript interfaces
├── docker-compose.yml
└── pnpm-workspace.yaml
```

---

## 💰 Financial Formulas

| Metric | Formula |
|--------|---------|
| **Current Yield** | `(couponRate% × faceValue) / marketPrice` |
| **YTM** | Newton-Raphson (max 1000 iters, ε=1e-6), annualised |
| **Total Interest** | `couponPayment × totalPeriods` |
| **Premium/Discount** | `marketPrice` vs `faceValue` comparison |

---

## 🚀 Local Development

### Prerequisites
- [Node.js 20+](https://nodejs.org)
- [pnpm 8+](https://pnpm.io) – `npm install -g pnpm`

### Install & Run

```bash
# Clone
git clone <repo-url>
cd bond-yield-calculator

# Install all workspace dependencies
pnpm install

# Build shared types
pnpm --filter @bond/shared build

# Terminal 1 – Backend (http://localhost:3000)
pnpm dev:backend

# Terminal 2 – Frontend (http://localhost:5173)
pnpm dev:frontend
```

---

## 🧪 Testing

```bash
# Run all backend unit tests
pnpm test

# With coverage report
pnpm test:cov
```

Test cases cover: normal bond, zero coupon, premium, discount, 1-year edge case.

---

## 🐳 Docker

```bash
# Build and start all services
docker compose up --build

# Frontend → http://localhost:5173
# Backend  → http://localhost:3000
```

---

## 📡 API Reference

### `POST /bond/calculate`

**Request:**
```json
{
  "faceValue": 1000,
  "couponRate": 5,
  "marketPrice": 950,
  "yearsToMaturity": 10,
  "couponFrequency": "semi-annual"
}
```

**Response:**
```json
{
  "currentYield": 0.052632,
  "ytm": 0.056198,
  "totalInterest": 500.00,
  "premiumOrDiscount": "Discount",
  "cashFlowSchedule": [
    {
      "period": 1,
      "paymentDate": "2026-08-23",
      "couponPayment": 25.00,
      "principalPayment": 0,
      "totalPayment": 25.00,
      "cumulativeInterest": 25.00,
      "remainingPrincipal": 1000
    }
  ]
}
```

---

## ☁️ Deployment

### Backend → Render
| Setting | Value |
|---------|-------|
| Root directory | `apps/backend` |
| Build command | `pnpm install && pnpm build` |
| Start command | `node dist/main.js` |
| Environment | `NODE_ENV=production`, `FRONTEND_URL=<vercel-url>` |

### Frontend → Vercel
| Setting | Value |
|---------|-------|
| Root directory | `apps/frontend` |
| Framework | Vite |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Environment | `VITE_API_URL=<render-url>` |

---

## 📸 Screenshots

> _Add screenshots here after deployment_

---

## 📄 License

MIT
