# Frontend API Layer

This directory owns frontend HTTP calls. Pages and feature hooks should import domain APIs from this directory instead of calling `fetch` directly.

## Rules

- New business code should use `apiClient` through modules such as `sessions.ts`, `scripts.ts`, `agents.ts`, `evidences.ts`, and `conversations.ts`.
- `invoke.ts` is a legacy compatibility module for old `/game/*`, `/evidence/*`, and `/conversations/*` helpers. Do not add new business imports from it.
- AI calls remain in `invokeApi.ts` and `assistantApi.ts` because `/invoke` is still the active AI endpoint.
- `apiClient` unwraps `{ success, data }` responses, so callers receive the `data` payload directly.

## Primary Endpoints

| Domain | Frontend module | Backend endpoints |
|---|---|---|
| Health | `health.ts` | `GET /health` |
| Scripts | `scripts.ts` | `GET /scripts`, `GET /scripts/{script_id}`, `GET /scripts/{script_id}/evidence-pool` |
| Sessions | `sessions.ts` | `POST /sessions`, `GET /sessions/{session_id}`, `GET /sessions/{session_id}/snapshot`, `POST /sessions/{session_id}/state`, `POST /sessions/{session_id}/vote`, `POST /sessions/{session_id}/reveal`, `POST /sessions/{session_id}/end` |
| Casting | `casting.ts` | `GET /casting/{session_id}`, `POST /casting/{session_id}`, `DELETE /casting/{session_id}` |
| Evidences | `evidences.ts` | `GET /evidences/{session_id}`, `GET /evidences/{session_id}/public`, `POST /evidences/{session_id}/discover`, `POST /evidences/{session_id}/present`, `POST /evidences/{session_id}/combine` |
| Messages | `messages.ts` | `GET /sessions/{session_id}/messages`, `POST /sessions/{session_id}/messages` |
| Conversations | `conversations.ts` | Legacy conversation endpoints retained until the session-message flow fully replaces them |
| Agents | `agents.ts` | `GET /agents/list`, `GET /agents/personas`, `GET /agents/personas/{persona_key}`, `POST /agents/personas/init`, `POST /agents/personas/load`, `POST /agents/personas/auto-match` |
| Skills | `skills.ts` | `GET /skills`, `POST /skills`, `POST /skills/search`, `POST /sessions/{session_id}/skills/inject`, `POST /sessions/{session_id}/skills/feedback` |
| AI | `invokeApi.ts`, `assistantApi.ts` | `POST /invoke/`, `POST /invoke/stream` |

## Migration Notes

- `/game/*` is deprecated for gameplay state. Use `/sessions/*`, `/phases/*`, `/casting/*`, and `/evidences/*`.
- `/evidence/*` is deprecated in frontend business code. Use `/evidences/*`.
- Old capsule concepts should surface as Skill data only. New UI should say "Skill", not "capsule".
- `localStorage` may keep route/session convenience state, but authoritative game facts should come from the backend snapshot.

## Review Checklist

- `rg "/game/|/evidence/" web/src --glob '!api/invoke.ts'` should only find route paths such as `/game/:sessionId`, docs, or explicitly documented legacy references.
- `rg "from .*invoke" web/src --glob '!api/invoke.ts'` should not find new business modules except AI-specific imports from `invokeApi.ts`.
- `npm run build` should pass after API changes.
