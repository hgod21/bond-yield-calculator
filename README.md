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

## ☁️ Deployment (Vercel – monorepo)

Both frontend and backend use the **same repo** with **Root Directory = repo root** so the workspace package `@bond/shared` is available. Create **two separate Vercel projects**, both linked to this repo.

| Setting | Backend project | Frontend project |
|--------|------------------|------------------|
| **Root Directory** | *(leave empty – repo root)* | *(leave empty – repo root)* |
| **Framework Preset** | Other / NestJS | Vite |
| **Build Command** | `pnpm run build:backend` | `pnpm run build:frontend` |
| **Output Directory** | `apps/backend/dist` | `apps/frontend/dist` |
| **Install Command** | `pnpm install` *(or use root `vercel.json`)* | `pnpm install` |

### Backend project
1. Import the repo → create project (e.g. `bond-yield-calculator-api`).
2. **Root Directory**: leave empty (use repo root).
3. **Build and Output Settings**: Build = `pnpm run build:backend`, Output = `apps/backend/dist`.
4. **Environment variables**: `FRONTEND_URL` = your frontend URL (e.g. `https://bond-yield.vercel.app`), `NODE_ENV` = `production`.

### Frontend project
1. Import the same repo again → create a second project (e.g. `bond-yield-calculator`).
2. **Root Directory**: leave empty (use repo root).
3. **Build and Output Settings**: Build = `pnpm run build:frontend`, Output = `apps/frontend/dist`.
4. **Environment variables**: `VITE_API_URL` = your backend URL (e.g. `https://bond-yield-calculator-api.vercel.app`).

The root `vercel.json` sets `installCommand: "pnpm install"` for both projects.


---

## 📸 Screenshots

> _Add screenshots here after deployment_
 <img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/cbf22126-7461-4a52-b841-493c0984db7a" />
 <img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/284987e5-48c6-404f-b081-3de89e39770c" />
 <img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/a32930a5-448e-42a1-a2d3-9a2ba926ae60" />
 <img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/e825714c-a324-4dbd-b6e2-48f4b8baa782" />
 <img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/d769a477-ae43-4733-9472-51035d9d1e0e" />







---

## 📄 License

MIT
