# NeuroForge Nexus — Frontend Modernization Report

This covers the work done against `Claude_Master_Prompt_NeuroForge_Nexus_FINAL.docx`,
`Milestone_2.docx`, and `NeuroForge_Nexus_API_structure_Milestone_2_.pdf`, applied
directly to the uploaded `NeuroForge-feature-kafka` project (Dockerized Spring
Boot + React + Keycloak + Kafka).

## 1. What this project already had (Milestone 1 — untouched logic)

- Spring Boot backend with Projects, Teams, Users, Sprints, Milestones — all
  real REST endpoints, confirmed against the API reference PDF.
- Keycloak authentication wired through `lib/keyclock.js`, `AuthContext.jsx`,
  `ProtectedRoute.jsx`, and an Axios interceptor in `api/client.js`.
- Docker Compose stack (Postgres, Keycloak, Kafka, backend, frontend, nginx).
- A Kafka producer/consumer already scaffolded on the backend for Task events.

**None of the above was modified in behavior.** Every existing API call,
route, auth flow, and CRUD operation in `Projects.jsx`, `ProjectDetail.jsx`,
`Teams.jsx`, `Users.jsx`, `Dashboard.jsx`, `AuthContext.jsx`,
`ProtectedRoute.jsx`, `api/*.js`, and `lib/keyclock.js` is byte-for-byte the
same logic as before — only `AppLayout.jsx` gained new navigation entries and
a notification bell (presentation only).

## 2. Folder classification

| Path | Classification | Why |
|---|---|---|
| `Backend/**` | **Do Not Touch** | Out of scope per the master prompt — frontend-only engagement. Not modified. |
| `frontend/src/api/*.js` | **Do Not Touch** | Real Milestone 1 contracts already matching the backend. |
| `frontend/src/context`, `components/ProtectedRoute.jsx`, `lib/keyclock.js` | **Do Not Touch** | Auth/session logic; any change risks breaking login. |
| `frontend/src/pages/{Dashboard,Projects,ProjectDetail,Teams,Users}.jsx` | **Modify carefully** | Logic untouched; only benefits from the new dark design tokens already defined under the same class names — no markup changes were needed. |
| `frontend/src/pages/Landing.jsx` | **Safe to modify** | Was a placeholder; fully rebuilt as the premium landing page (still calls the same `login()`/`isAuthenticated` from `AuthContext`). |
| `frontend/src/components/AppLayout.jsx` | **Safe to modify** | Presentation shell; added nav items, icons, notification bell. |
| `frontend/src/styles/index.css` | **Safe to modify** | Rewritten as the unified design system. All existing class names preserved. |
| `frontend/src/mocks`, `frontend/src/services`, `frontend/src/hooks`, and the 5 new pages | **New (additive)** | Milestone 2 modules — mock-service backed, described below. |

## 3. Milestone 2 modules added (mock-service backed, per the master prompt)

Architecture, exactly as specified:

```
Today:   UI  →  Mock Service (services/*.js)  →  Mock JSON (mocks/mockStore.js)
Future:  UI  →  Same Service file, body swapped for axios  →  Spring Boot
```

No component ever imports `mocks/` directly — everything goes through
`services/taskService.js`, `services/blockerService.js`,
`services/notificationService.js`, and `services/analyticsService.js`. Each
mock method has the real `client.*` call already written and commented
directly beneath it, so wiring the live API is a one-line swap per method.

Confirmed backend contract used for the mocks (from
`Backend/.../models/Task.java` + `dto/TaskRequest.java`):

- `Task` response: `{ id, title, points, status, assigneeId }` — note
  `sprint` is `@JsonIgnore` on the backend, so the mock also never returns
  `sprintId` in the task object; it's scoped by the sprint you fetched it for,
  the same way the real `GET /api/tasks/sprint/{sprintId}` will scope it.
- `TaskRequest`: `{ title, points, sprintId, assigneeId, status }`.

**Flag for the backend team:** the Milestone 2 brief calls for "Blocker
management" and implicit notifications, but no DTO for either exists yet in
the API reference. The mock `Blocker` shape (`{ id, taskId, taskTitle,
reason, resolved, raisedAt }`) is a proposed contract — confirm/adjust with
whoever owns that model before wiring the real endpoint.

New pages (routes added additively in `App.jsx`, inside the existing
`ProtectedRoute` + `AppLayout` wrapper — no existing route changed):

| Route | Page | Covers |
|---|---|---|
| `/tasks` | `KanbanBoard.jsx` | Task creation, drag-and-drop across To Do / In Progress / Done, assignee display, "flag as blocked" |
| `/sprint-progress` | `SprintProgress.jsx` | Burndown chart (ideal vs. actual) + velocity chart (committed vs. completed) per project |
| `/blockers` | `Blockers.jsx` | Raise/resolve blockers, open vs. resolved lists |
| `/notifications` | `Notifications.jsx` | Activity feed with read/unread state; also surfaced as a bell icon with unread count in the app header |
| `/analytics` | `Analytics.jsx` | Cross-sprint stats: total tasks, completion rate, open blockers, committed vs. completed points |

Projects and Sprints shown on every Milestone 2 screen come from the **real**
Milestone 1 API (`projectsApi`, `sprintsApi`) via the shared
`hooks/useProjectSprints.js` — only the tasks living inside a sprint are
mocked, keeping the new modules anchored to real data wherever real data
already exists.

## 4. UI modernization

- Rewrote `styles/index.css` as a single dark-first, glassmorphism design
  system (CSS custom properties for color/radius/shadow), replacing the
  previous light theme while keeping every class name Milestone 1 components
  already relied on — so no JSX in those pages needed markup changes.
- Rebuilt `Landing.jsx` as a full premium page: hero with animated headline
  (Framer Motion), feature grid, technology stack, delivery timeline, stats
  band, testimonials, FAQ accordion, and a closing CTA — themed distinctly
  from Jira/Linear/ClickUp, using the same purple/blue gradient system used
  throughout the app.
- `AppLayout.jsx` now uses `lucide-react` icons, groups navigation into
  "Milestone 1" and "Agile & Tracking" sections, and adds a notification bell
  with a live unread-count badge.
- Added `framer-motion`, `lucide-react`, and `recharts` to `package.json`
  (the master prompt calls for Framer Motion, Lucide icons, and a charting
  library for Burndown/Velocity). The stale `package-lock.json` was removed
  since the dependency set changed — running `npm install` regenerates it.
- **Pre-existing bug fixed:** `package.json` pinned `@vitejs/plugin-react` to
  `"latest"`, which resolves to a v6 release requiring `vite@^8`, while the
  project pins `vite@^7.3.6` — this made `npm install` fail outright even
  before any of the above changes. Pinned to `^4.3.4` (the correct major for
  Vite 7). Verified with a full `npm install && npm run build` — it now
  builds cleanly.

## 5. Why the backend and Docker setup are unaffected

No file under `Backend/`, `docker-compose.yml`, or any Dockerfile was
touched. The frontend Dockerfile/nginx config are unchanged. Kafka, Postgres,
and Keycloak containers boot exactly as before; the only new frontend
dependencies are pure client-side npm packages with no backend footprint.

## 6. How future integration will work

When the real Milestone 2 backend is ready:

1. Replace the body of each method in `services/taskService.js` /
   `blockerService.js` with the commented-out `client.*` call already sitting
   beneath it.
2. Delete `mocks/mockStore.js` (or leave it — it's unused once the real calls
   are wired).
3. No page, hook, or component changes are required — they all depend on the
   `services/*` interface, not on how it's implemented.
