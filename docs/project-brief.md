# WorkFlow Automation SaaS Platform

## 0. Executive Summary
- Build a production-ready workflow automation SaaS, similar to ActivePieces.
- Target users: SMBs, SMEs, freelancers.
- Revenue model: subscription with freemium, Pro ($29/mo), and Enterprise tiers.
- MVP deadline: 4 weeks; polish and scaling during weeks 5–6.

### North-Star KPIs
- Flow success rate ≥ 99.9%
- Time-to-first-automation < 10 minutes
- D7 retention ≥ 35% of new users

## 1. Business Requirements & Strategy
### 1.1 Market & Competitive Intel
- Benchmarks: ActivePieces, Zapier, Make/Integromat.
- Differentiators: affordable Pro tier, transparent usage visibility, AI-assisted recipe builder, on-prem connectors, regional data locality.

### 1.2 Business Model
- Free: 100 runs/month, 2 workflows, community support.
- Pro: $29/month, 10k runs/month, unlimited workflows, priority support.
- Enterprise: custom pricing, SSO/SAML, private workers, white-labeling, DPA/SLA.
- Year 1 projections: 500 users (100 paid) → MRR ~$2,900 (conservative) to $29,000 (aggressive).

### 1.3 Personas
- Business Owner (30–45): simple automations to save time.
- Marketing Manager (25–40): focuses on social, email, and Sheets workflows.
- Freelancer (20–35): cost-effective automations for multiple clients.

### 1.4 Success Metrics
- MAU growth, run success rate, churn < 3%/month, support first response time < 4 hours, time-to-value < 10 minutes.

## 2. Technical Architecture
### 2.1 Technology Stack
- **Backend:** Node 18+, Express.js (TypeScript), PostgreSQL, Redis, BullMQ, OAuth2/JWT, Swagger.
- **Frontend:** React 18 (TypeScript), React Flow, shadcn/ui + Tailwind, React Hook Form + Zod, Axios, Socket.io for realtime updates.
- **DevOps:** Docker, Railway, GitHub Actions, dotenv + Railway Secrets, Sentry, Winston (future ELK integration).
- **Third-party Services:** Stripe, SendGrid or Mailgun, Cloudflare, S3-compatible storage.

### 2.2 Architecture Overview
```
Client (React SPA) → API Gateway (Express + JWT + rate limit)
  ├─ Auth Service (OAuth/JWT)
  ├─ Workflow Service (CRUD, versioning)
  ├─ Integration Service (OAuth tokens, connectors)
  ├─ Execution Engine (workers) → BullMQ/Redis → External APIs
  └─ DB (PostgreSQL) + Object Storage (S3)
```

### 2.3 Database Schema (MVP)
- Users, Workflows, Integrations, Executions, Subscriptions, API Usage, WorkflowVersions, Secrets (encrypted at rest).

## 3. Feature Specifications
### 3.1 MVP (Weeks 1–4)
1. Authentication and onboarding (email + Google, password reset, profile management).
2. Dashboard with quick create, recent runs, usage visualization.
3. Workflow builder featuring webhook and schedule triggers, HTTP/Email/Slack/Sheets actions, IF/ELSE branching, and data mapping.
4. Integrations management with OAuth token storage and connection testing.
5. Execution monitoring with realtime logs, run history, retry, and notifications.
6. Billing via Stripe with usage limits and plan gating.
7. Monitoring via Sentry, health checks, and rate limiting per API key.

### 3.2 Phase 2 (Weeks 5–6)
- Cron UI, loops, error branching, template marketplace, team roles, audit logs, white-labeling, custom connector SDK, AI-assisted builder.

## 4. UI/UX Design
- **Design System:** Primary #2563EB, Success #10B981, Danger #EF4444, Background #F9FAFB, Text #111827.
- **Fonts:** Inter for UI, JetBrains Mono for code.
- **Components:** Buttons, cards, modals, toasts, skeletons, inputs, tabs, data tables, empty states.
- **Key Screens:** Landing page, dashboard, workflow editor (library/canvas/config panes), integrations, history, billing.
- **Core Flows:** Onboarding, workflow creation and execution, subscription upgrade via Stripe.

## 5. API Specification (MVP)
- **Auth:** `POST /api/v1/auth/signup`, `/login`, `/logout`, `/refresh`, `/forgot`, `/reset`
- **Users:** `GET/PUT /api/v1/users/profile`, `/settings`
- **Workflows:** `GET/POST /api/v1/workflows`, `GET/PUT/DELETE /api/v1/workflows/:id`, `POST /api/v1/workflows/:id/test`, `/enable`, `/disable`, `/duplicate`
- **Executions:** `GET /api/v1/workflows/:workflowId/executions`, `GET /api/v1/executions/:id`, `POST /api/v1/executions/:id/retry`, `GET /api/v1/executions/:id/logs`
- **Integrations:** `GET/POST /api/v1/integrations`, `GET/DELETE /api/v1/integrations/:id`, `POST /api/v1/integrations/:id/test`, `GET /api/v1/integrations/available`
- **Billing:** `GET /api/v1/subscription`, `POST /api/v1/subscription/upgrade`, `/subscription/cancel`, `GET /api/v1/billing/invoices`, `POST /api/v1/billing/webhook`
- **Webhooks:** `POST /hooks/:workflowId`

## 6. Project Plan & Timeline
- **Week 1:** Repository initialization, database schema via Prisma, auth scaffolding, Stripe test integration, Railway services and CI/CD setup.
- **Week 2:** Workflow builder foundation, BullMQ workers, webhook/schedule triggers, basic actions, execution logging.
- **Week 3:** OAuth integrations (Google Sheets), monitoring, usage metering, billing pages.
- **Week 4:** Templates, error handling, load testing, landing page, documentation, onboarding polish.
- **Weeks 5–6:** Team RBAC, cron UI, loops, audit logs, connector SDK, white-label support, SOC2 readiness backlog.

## 7. Repository Scaffold
```
workflow-saas/
  apps/
    api/
    web/
  packages/
    shared/
  infra/
    docker/
    k8s/
  .github/workflows/ci.yml
  README.md
```

### Sample Docker Configuration
- **API Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm","run","start:prod"]
```
- **Web Dockerfile**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```
- **docker-compose.dev.yml**
```yaml
version: "3.9"
services:
  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: example
      POSTGRES_DB: workflow
    ports: ["5432:5432"]
  redis:
    image: redis:7
    ports: ["6379:6379"]
  api:
    build: ./apps/api
    env_file: .env
    depends_on: [db, redis]
    ports: ["3001:3001"]
  web:
    build: ./apps/web
    ports: ["3000:80"]
    depends_on: [api]
```
- **.env.sample**
```
DATABASE_URL=postgresql://user:pass@host:5432/workflow
REDIS_URL=redis://:pass@host:6379
JWT_SECRET=change_me
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SERVER_URL=https://api-xxx.up.railway.app
WEB_URL=https://client-xxx.up.railway.app
SENTRY_DSN=
```
- **GitHub Actions CI**
```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: npm ci
      - run: npm run lint && npm run typecheck && npm run test --if-present
```

## 8. Milestone Acceptance Criteria (MVP)
- Workflow with webhook trigger and HTTP action executes successfully with logs.
- Scheduled trigger runs on cron and appends a row to Google Sheets.
- Failures can be retried; run history shows step-by-step logs.
- Stripe Pro plan unlocks higher monthly runs; usage indicator updates in realtime.
- Sentry captures uncaught errors; health endpoints respond correctly on Railway.

## 9. Security & Compliance Checklist
- JWT rotation and refresh tokens; argon2 password hashing.
- Row-level authorization with per-tenant API rate limits.
- Secrets encrypted at rest; exclude PII from logs.
- Daily database backups and documented restoration runbook.
- DPA/SLA templates for Enterprise; audit log retention policy.

## 10. Risk Register & Mitigations
- OAuth fragility → include "Test Connection" and explicit error messaging.
- Run spikes → workflow-level concurrency and queue backpressure tuning.
- Third-party API limits → exponential backoff and circuit breaker patterns.
- Cold starts → pre-warm workers and maintain health/liveness probes.

## 11. Immediate Next Steps
1. Create GitHub repository with the scaffold.
2. Provision Railway services (API, web, Postgres, Redis).
3. Configure environment secrets using `.env.sample`.
4. Implement MVP connectors: webhook, schedule, HTTP, email (SMTP), Slack webhook, Google Sheets append.
5. Deliver Week-1 milestone: end-to-end run through builder and execution engine.

## 12. Appendices
- Schema SQL reference for Prisma models.
- API contract to be generated via OpenAPI.
- Branding palette and white-label considerations for future phases.
