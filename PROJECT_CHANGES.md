# Project Changes

## Current Architecture

- Monorepo with `server` and `client`.
- Backend uses Express + Mongoose with route-controller-service-model layering.
- Frontend uses Vite + React + Tailwind CSS with public pages and private admin CMS.
- Backend folders implemented under `server/src/config`, `controllers`, `services`, `models`, `routes`, `middlewares`, `validators`, `utils`, and `seeders`.
- Frontend folders implemented under `client/src/api`, `components`, `layouts`, `pages`, `admin`, `routes`, `hooks`, `utils`, and `constants`.

## Backend APIs

- Public APIs live under `/api/public`.
- Admin APIs live under `/api/admin`.
- Admin authentication uses JWT bearer tokens.
- Health endpoints are available at both `GET /api/health` and `GET /health`, with the Render backend health check targeting `/api/health`.
- Implemented public routes:
  - `GET /api/public/home`
  - `GET /api/public/profile`
  - `GET /api/public/projects`
  - `GET /api/public/projects/featured`
  - `GET /api/public/projects/:slug`
  - `GET /api/public/experience`
  - `GET /api/public/achievements`
  - `GET /api/public/skills`
  - `GET /api/public/education`
  - `GET /api/public/dashboard-stats`
  - `GET /api/public/activity`
  - `POST /api/public/contact`
- Implemented admin routes:
  - `POST /api/admin/auth/login`
  - `GET /api/admin/auth/me`
  - `GET /api/admin/dashboard`
  - `GET /api/admin/dashboard/overview`
  - `GET /api/admin/dashboard/stats`
  - `GET /api/admin/activity`
  - `GET/PUT /api/admin/profile`
  - CRUD under `/api/admin/projects`, `/experience`, `/achievements`, `/skills`, `/education`
  - `GET/PATCH/DELETE /api/admin/messages`
  - `POST /api/admin/uploads/image`
  - `POST /api/admin/uploads/resume`
- Security middleware includes `helmet`, `cors`, request rate limiting for API/login/contact, validation middleware, and centralized error handling.
- Request logging now uses a compact Morgan format that records `method`, `url`, `status`, and `response-time` for production debugging and slow-endpoint audits.
- Admin write routes now normalize incoming CMS payloads before Joi validation so booleans, numbers, arrays, trimmed strings, and nullable dates reach MongoDB in consistent shapes.
- Validation failures now return a structured `errors[{ field, message }]` payload instead of raw message arrays, and local development logs normalized CMS payloads for save debugging.
- Database config now reads `MONGO_URI` only from the local environment.
- Server startup now loads environment variables before importing the Express app and DB bootstrap modules.
- CORS now explicitly allows `http://localhost:5173`, `http://localhost:5174`, and `http://localhost:3000`, supports `GET/POST/PUT/PATCH/DELETE/OPTIONS`, allows `Content-Type` and `Authorization`, keeps credentials enabled, and handles global preflight requests before routes.
- Disallowed origins now fail closed through CORS without being surfaced as an internal-server-error response.
- `GET /api/health` now comes from the dedicated diagnostics controller so it exposes the richer Mongoose snapshot (`server`, `mongodb.readyState`, `mongodb.status`, `host`, `dbName`, `timestamp`) without being shadowed by a simpler app-level handler.
- `GET /health` remains a lightweight non-database server uptime check.
- `GET /api/health` now also exposes a direct Mongoose connection snapshot with `server`, `mongodb.readyState`, `mongodb.status`, `host`, `dbName`, and `timestamp`.
- `GET /api/test/db` now pings MongoDB with `mongoose.connection.db.admin().ping()`, returns `503` plus the current ready state when disconnected, and stays unauthenticated for backend diagnostics.
- Server now starts listening even when MongoDB Atlas is unreachable; API routes return structured `503` responses until the database connection becomes healthy instead of failing at process startup.
- Server startup now handles `EADDRINUSE` explicitly and prints a clean port-conflict message when port `5000` is already occupied.
- `GET /api/admin/dashboard` now returns additive overview data beyond counts: richer stats, recent messages, recently updated projects, quick actions, and lightweight system metadata.
- `GET /api/public/home` now aggregates public landing-page content in one backend call using `Promise.all`, returning `profile`, `featuredProjects`, preview slices for `skills`, `experience`, `achievements`, plus public stats widgets.
- `GET /api/admin/dashboard/overview` now aggregates admin dashboard cards in one backend call using `Promise.all`, returning top-line counts, recent projects/messages, activity, completion, heatmap, and impact/status widgets.
- `GET /api/admin/dashboard/stats` and `GET /api/public/dashboard-stats` now return LeetCode-inspired widget data: portfolio completion, skill topic progress, project status splits, impact totals, heatmap cells, and recent activity.
- `GET /api/admin/activity` and `GET /api/public/activity` now expose CMS-driven activity feeds, with the public endpoint returning a safe subset of fields.
- Admin list APIs now paginate at the backend with query params such as `page`, `limit`, `search`, `status`, and `category` instead of returning full collections by default.
- Public project list responses are now lightweight summary payloads; full `longDescription` and `screenshots` stay on `GET /api/public/projects/:slug`.
- Admin activity is now sorted by `updatedAt`/`createdAt`, and repeated profile updates within 10 minutes are deduplicated into the latest profile activity entry instead of creating dashboard-cluttering duplicates.
- MongoDB bootstrap now uses bounded server selection timeout, prefers IPv4 resolution, and surfaces clearer Atlas/network diagnostic guidance on failure.
- Server startup logging was tightened so missing `MONGO_URI` and MongoDB connection failures are reported with cleaner, more actionable messages.
- Local Atlas configuration was corrected to use a normal application database name in the URI path instead of a password-like string, and the forced IPv4 connect option was removed to reduce driver/network mismatches.

## Content Model

- Singleton `Profile` stores personal info, social links, resume metadata, and CMS-oriented fields such as `name/fullName`, `shortIntro`, `about`, `currentRole`, `currentCompany`, direct social URLs, and direct image/resume URLs.
- Collection models: `Project`, `Experience`, `Achievement`, `Skill`, `Education`, `ContactMessage`.
- Collection indexes now support the heaviest CMS/public filters:
  - `Project`: `isPublished`, `isFeatured`, `displayOrder`, `status`, `category`, `slug`
  - `Skill`: `isPublished`, `category`, `displayOrder`
  - `Experience`: `isPublished`, `displayOrder`
  - `Achievement`: `isPublished`, `isFeatured`, `displayOrder`
  - `ContactMessage`: `status`, `createdAt`
- `ActivityLog` now records create/update/delete/upload actions for projects, skills, experience, achievements, education, profile updates, and resume changes.
- `ActivityLog` now keeps `updatedAt` so deduplicated profile-update events can refresh their admin-visible timestamp without multiplying public/admin activity noise.
- Published public content is filtered with `isPublished` and sorted with `displayOrder`.
- `Project` uses unique slugs, exact CMS-enforced category/status enums, and supports Cloudinary-backed or local-fallback `screenshots`.
- `ContactMessage` supports statuses `new`, `read`, `replied`, and `archived`.
- Public contact submissions are always stored in `ContactMessage`, and the server now also attempts an email notification via a provider-backed server call when `CONTACT_NOTIFICATION_*` / `RESEND_API_KEY` environment variables are configured.
- `POST /api/public/contact` now returns an accurate delivery status message: successful email delivery stays green on the frontend, while skipped/misconfigured or provider-failed notifications are surfaced as a saved-but-not-emailed warning instead of a false success state.
- CRUD and profile/upload services now emit activity logs so dashboard widgets and heatmaps update from Mongo-backed behavior instead of hardcoded data.
- Image and resume uploads prefer Cloudinary, but local development now falls back to server-hosted files under `/uploads/*` when Cloudinary credentials are missing so CMS upload flows still work on localhost.

## Frontend Routes

- Public routes cover Home, About, Projects, Project Details, Experience, Achievements, Skills, Education, Contact, and Resume.
- Public routes also include `/cms`, which redirects to `/admin/dashboard` when `adminToken` exists in localStorage and otherwise redirects to `/admin/login`.
- Admin routes cover login, dashboard, profile, projects, skills, experience, achievements, education, resume, messages, and settings (all under `/admin/*` with `AdminLayout` wrapping protected shell routes).
- Public UI now uses a left-sidebar command-center shell on desktop plus a mobile drawer, with `Overview` replacing `Home` in the public navigation and a workspace-style topbar similar to the admin CMS.
- Admin UI now uses the same command-center shell language with grouped sidebar sections, denser dashboard panels, recent activity cards, and quick-action surfaces closer to the dark SaaS reference style.
- The frontend reads only `import.meta.env.VITE_API_BASE_URL` (fallback `http://localhost:5000/api`, trailing slashes stripped); admin JWT persists in localStorage under `adminToken` (legacy `portfolio_admin_token` is migrated once on read).
- Shared frontend HTTP requests now merge headers after request options, so admin JSON saves keep `Content-Type: application/json` even when `Authorization` is attached.
- Vite dev server defaults to port `5174`; `CLIENT_URL`/CORS allow both `5173` and `5174`.
- `/admin/dashboard` is now the canonical admin overview route, while `/admin` redirects there and `/admin/login` redirects to it after successful login.
- The public sidebar/footer now includes an `Admin CMS` entry that routes through `/cms` for easier workspace access without changing the command-center UI language.
- Shared frontend primitives now include `AppShell`, `PageHeader`, `DashboardCard`, `QuickActionCard`, `SectionPanel`, `AdminDataTable`, `AdminFormPanel`, metric cards with progress strips, `ProgressRing`, `TopicProgressList`, `StatusSplitCard`, `HeatmapGrid`, and `ActivityFeedCard`.
- Admin and public overview pages now render LeetCode-inspired progress widgets driven by MongoDB APIs instead of static assumptions.
- The admin profile page now exposes direct CMS fields for editable intro/about/social/current-role content, so public profile pages can be updated without code changes.
- Public route data now uses a small shared cache/in-flight dedupe layer, with the home page pulling from `/api/public/home` and other public pages caching API responses for roughly five minutes to avoid duplicate page-load calls.
- The admin dashboard now loads from `/api/admin/dashboard/overview` in one request and shows skeleton cards while the combined payload is loading.
- Admin resource tables and the message inbox now load paginated slices, expose lightweight search/filter controls, and use local row updates after create/update/delete/status changes instead of refetching unrelated CMS modules.
- Admin save flows now surface toast-style success/error notifications for profile updates, CRUD content saves/deletes, message status changes, and asset uploads; successful writes invalidate only the affected public/admin cache keys so later views refresh without a full app-wide reload.
- Admin resource editors now use exact select enums for project category/status and skill category/level, provide a `View public page` shortcut, default dropdowns and `displayOrder` to valid values, clamp negative display ordering client-side, and normalize trimmed/array-safe payloads before save APIs.
- Admin JSON writes now flow through one shared helper that applies bearer auth automatically for protected `POST`/`PUT`/`PATCH` requests, while upload endpoints remain multipart with bearer auth only.
- The admin profile and CRUD editors now run frontend validation before save for required fields, non-negative numeric fields, email/url formatting, and exact backend validation errors are surfaced back through inline error text plus toast notifications.
- Public resume and project link surfaces now read CMS-managed `resumeUrl`, `githubUrl`, and `liveUrl` values consistently, and external links open with `target="_blank"` plus `rel="noopener noreferrer"`.
- The public overview no longer renders the long recent-activity feed; it now keeps the command-center layout focused on featured projects, progress/status widgets, resume readiness, and external quick actions while activity remains an admin-only concern.
- Tailwind theme tokens now follow the newest command-center palette with `background`, `panel`, `sidebar`, `card`, `border`, `text.*`, and `accent.*` colors while keeping the dark premium design system intact.
- Tailwind theme tokens were normalized to kebab-case utility names so the new design system classes compile cleanly in Vite/PostCSS.

## Deferred / Notes

- Repo-local change-tracking skill is included under `tools/skills/portfolio-change-tracker`.
- A discoverable Codex copy of `portfolio-change-tracker` was also installed under `~/.codex/skills/portfolio-change-tracker`.
- Client builds no longer read `VITE_API_URL`; set `VITE_API_BASE_URL` when overriding the API origin.
- Production deployment and runtime verification still depend on installing project dependencies, setting environment variables, and connecting MongoDB/Cloudinary credentials.
- The repo-level `render.yaml` now defines both the backend Node service (`rootDir: server`) and the frontend Render static site (`rootDir: client`) with SPA rewrite routing to `/index.html`.
- Contact email notifications require server environment variables on Render or the host runtime: `CONTACT_NOTIFICATION_TO_EMAIL`, `CONTACT_NOTIFICATION_FROM_EMAIL`, and either `CONTACT_NOTIFICATION_PROVIDER=resend` plus `RESEND_API_KEY` or a future supported provider.
- `README.md` is now the primary setup/deployment/operator guide and links to `CMS_SAVE_DEBUG_CHECKLIST.md` for save-to-public verification.
- A repo-level `CMS_SAVE_DEBUG_CHECKLIST.md` now documents the localhost verification commands and manual acceptance flow for CMS save-to-public reflection.
- Local server bootstrap now includes a `.env` file path expectation in `server/`, and accidental shell-created files were cleaned from that folder.
