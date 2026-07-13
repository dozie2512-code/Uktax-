# Rev 360 Nigeria Tax Portal

Rev 360 Nigeria Tax Portal is a production-style frontend clone of a Nigerian tax management experience built with the Next.js App Router. It provides separate taxpayer and admin flows, seeded mock data, a simulated API layer, and local persistence for filings, drafts, invoices, and sessions.

## Quick start

```bash
npm install && npm run dev
```

Open `http://localhost:3000` in your browser.

## Available pages

- `/login` — authentication with demo account shortcuts
- `/dashboard` — taxpayer overview, notifications, recent filings, and invoices
- `/returns` — multi-step tax return form with draft saving and submission
- `/invoices` — invoice listing, filtering, searching, and mock uploads
- `/filing-status` — filing tracker with status filters and timeline expansion
- `/admin` — admin dashboard with portfolio-wide filing metrics

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Taxpayer | `john.doe@example.com` | `password123` |
| Taxpayer | `jane.smith@example.com` | `password123` |
| Taxpayer | `chukwu.emeka@example.com` | `password123` |
| Admin | `admin@rev360.gov.ng` | `admin2024` |

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Architecture

### Mock data
Static seed data lives in `lib/mockData.ts` and includes users, filings, invoices, and notifications for both taxpayer and admin experiences.

### Fake API layer
`lib/api.ts` simulates asynchronous backend calls with 300–600ms delays for login, listing records, uploads, submissions, notifications, and admin metrics.

### Local storage
`lib/storage.ts` persists sessions, return drafts, locally submitted filings, and uploaded invoices in the browser so the demo behaves like a stateful product without a real backend.

### Shared UI shell
Reusable components in `components/` power route protection, navigation, app chrome, KPI cards, and status badges across all authenticated pages.

## Feature summary

- Taxpayer and admin login flows
- Redirect-based home routing
- Protected routes with admin-only access control
- Tax dashboard with summary cards and notifications
- Multi-step tax return wizard with validation and draft save
- Filing status tracker with expandable progress timeline
- Invoice management with upload form, category filtering, and search
- Admin reporting dashboard with filing metrics and review table
- Mock backend behavior with persistent browser storage
