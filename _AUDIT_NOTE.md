# Audit Note - multi_agents

Source: `_AUDIT/reports/batch_10.md` (lines 275-285).

## Original Audit Recommendations

Audit verdict: **SKELETON** — "Only auth and generic CRUD routes; no agent orchestration, message passing, or task scheduling endpoints." (NOTE: Audit was inaccurate — the repo (CraftAgent Pro) actually has 12 endpoints in `backend/server.js` including specialized agents (customer-support, content-creation, lead-qualification, data-analysis, generic), debate orchestration (turn, full debate, presets), and provider listing. The TSV likely only saw the `routes/` directory and missed the inline routes in `server.js`.)

### What's Missing (genuine gaps)
- Async task scheduling/dispatch endpoint.
- Task state monitoring/aggregation.
- Multi-step agent chaining beyond debate format.

## Implementations Applied

Added 4 endpoints to `backend/server.js` for asynchronous agent task dispatch and monitoring:
- `POST /api/agents/tasks` — fire-and-forget task dispatch returning a taskId (202 Accepted).
- `GET /api/agents/tasks/:id` — poll task status.
- `GET /api/agents/tasks` — list recent tasks (last 50).
- `GET /api/agents/monitor` — aggregate counts by status / agent.

Uses an in-memory Map (per-process) — adequate for single-instance dev, with note that production needs a persisted queue (Redis / SQS / DB-backed). No new dependencies; reuses existing `agentService.genericAgent`.

## Backlog (Prioritized)

### High
- Persist tasks (use existing SQLite `craftagent.db` or move to Redis).
- Multi-step agent chaining workflows (DAG runner).
- Result aggregation across multiple parallel agents.

### Medium
- WebSocket task progress streaming.
- Per-user task isolation/auth on tasks endpoints.
- Replay/audit log for runs.

### Low / Product Decisions
- Agent capability marketplace.
- Voice intake to agent dispatch.

## Apply pass 3 (frontend)
LEFT-AS-IS. `src/components/Pages/AgentTasksPage.js` already provides a complete MUI UI for the 4 pass-2 endpoints (`POST/GET /api/agents/tasks`, `GET /api/agents/tasks/:id`, `GET /api/agents/monitor`): dispatch form with agent-type selector, tasks list with view-detail dialog, monitor aggregate (chips by status / by agent). Wired in `src/App.js` route `agent-tasks` and `components/Layout/DashboardLayout.js` sidebar. JWT Bearer is injected by `src/utils/api.js` `Api.request()` from `localStorage.token`. No FE work needed. Log: `_AUDIT/apply3_logs/ab3_84.md`.

## Apply pass 4 (mechanical backlog)
LEFT-AS-IS. No remaining mechanical AI-endpoint backlog. All open backlog items are non-mechanical: persist tasks (storage refactor — TOO-RISKY), multi-step DAG runner / parallel result aggregation (orchestration refactor — TOO-RISKY), WebSocket task progress streaming (protocol refactor — TOO-RISKY), per-user task isolation (auth refactor of in-memory map — TOO-RISKY), replay/audit log + agent capability marketplace (NEEDS-PRODUCT-DECISION), voice intake (NEEDS-CREDS — ASR). Existing 12 `/api/agents/*` endpoints in `backend/server.js` plus the pass-2 task quartet already cover the LLM-endpoint surface. Log: `_AUDIT/apply4_logs/ab3_84.md`.
