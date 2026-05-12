# Personal Website + CMS

A full-stack portfolio website with a React + Vite public frontend, an Express + MongoDB CMS backend, admin authentication, public portfolio pages, resume upload support, and deployment-ready Render configuration.

## Overview

- Public website routes: home, about, projects, experience, achievements, skills, education, contact, resume.
- Admin CMS routes under `/admin/*` for profile, projects, skills, experience, achievements, education, resume, messages, and settings.
- MongoDB Atlas stores CMS content and contact inbox messages.
- Public pages read from live APIs, not hardcoded content.
- CMS save flow normalizes payloads, enforces consistent field names, and reflects published content on public pages.
- Resume uploads support Cloudinary in production and local file fallback in local development.
- Contact form submissions are stored in the CMS inbox and can optionally send email notifications through Resend.

## Tech Stack

- Frontend: React 18, Vite, React Router, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, Joi validation, JWT auth, Multer uploads
- Database: MongoDB Atlas with Mongoose
- Media: Cloudinary when configured, local `/uploads/*` fallback in dev
- Deployment: Render web service for backend and Render static site for frontend

## Repo Structure

```text
client/   React + Vite frontend
server/   Express + MongoDB backend
render.yaml
CMS_SAVE_DEBUG_CHECKLIST.md
PROJECT_CHANGES.md
```

## Local Setup

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Copy the example files and fill them in:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3. Required backend env vars

From [server/.env.example](/Users/priyanshumidha/Documents/Personal website /server/.env.example:1):

- `PORT`
- `NODE_ENV`
- `CLIENT_URL`
- `PUBLIC_SERVER_URL`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional backend env vars:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CONTACT_NOTIFICATION_PROVIDER`
- `CONTACT_NOTIFICATION_TO_EMAIL`
- `CONTACT_NOTIFICATION_FROM_EMAIL`
- `RESEND_API_KEY`

### 4. Required frontend env vars

From [client/.env.example](/Users/priyanshumidha/Documents/Personal website /client/.env.example:1):

- `VITE_API_BASE_URL`

Local example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 5. Seed the admin account

Run this after `server/.env` contains `ADMIN_EMAIL` and `ADMIN_PASSWORD`:

```bash
cd server
npm run seed:admin
```

### 6. Start both apps

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## Health Checks

The backend supports both:

- `GET /api/health`
- `GET /health`

Render is configured to use `/api/health` as the production health check path.

Local test:

```bash
curl -s http://localhost:5000/api/health | jq
curl -s http://localhost:5000/health | jq
```

## CMS Access

- Public shortcut route: `/cms`
- If `adminToken` exists, `/cms` redirects to `/admin/dashboard`
- Otherwise `/cms` redirects to `/admin/login`
- The public sidebar/footer includes an `Admin CMS` link

## CMS Save Flow

Admin JSON writes go through the shared frontend request helper and:

- send `Content-Type: application/json` only when a JSON body exists
- send `Authorization: Bearer <adminToken>` for protected admin write routes
- normalize payloads before save
- surface exact backend validation errors in the admin UI
- refetch content lists after successful save

Normalization and validation currently cover:

- trimmed strings
- non-negative `displayOrder`
- safe number conversion
- array coercion
- default dropdown values
- consistent CMS field names such as:
  - `isPublished`
  - `isFeatured`
  - `githubUrl`
  - `liveUrl`
  - `resumeUrl`

For a step-by-step verification checklist, see [CMS_SAVE_DEBUG_CHECKLIST.md](/Users/priyanshumidha/Documents/Personal website /CMS_SAVE_DEBUG_CHECKLIST.md:1).

## Public Reflection Rules

Public pages and APIs read only published content:

- profile: `/api/public/profile`
- projects: `/api/public/projects`
- featured projects: `/api/public/projects/featured`
- experience: `/api/public/experience`
- achievements: `/api/public/achievements`
- skills: `/api/public/skills`
- education: `/api/public/education`
- resume page: `/resume` uses `profile.resumeUrl`

Important behavior:

- public content appears when `isPublished: true`
- featured project widgets additionally rely on `isFeatured: true`
- project cards use `githubUrl` and `liveUrl`
- resume buttons and resume page use `profile.resumeUrl`

## Resume Upload Flow

- Admin upload endpoint: `POST /api/admin/uploads/resume`
- Accepted file types: PDF, DOC, DOCX
- If Cloudinary env vars exist, uploads go to Cloudinary
- If Cloudinary env vars are missing, local fallback stores files in `/uploads/*`
- Local fallback is intended for local development, not durable production storage
- The final uploaded asset URL is saved to `profile.resumeUrl`
- The public resume button and `/resume` page read from that field

## Contact Form Flow

- Public submit endpoint: `POST /api/public/contact`
- Messages are always stored in MongoDB as `ContactMessage`
- Admin inbox page reads those submissions under `/admin/messages`
- Optional email notification is sent when configured

To enable email notifications with Resend:

```env
CONTACT_NOTIFICATION_PROVIDER=resend
CONTACT_NOTIFICATION_TO_EMAIL=you@example.com
CONTACT_NOTIFICATION_FROM_EMAIL=verified@yourdomain.com
RESEND_API_KEY=re_xxxxx
```

Notes:

- `CONTACT_NOTIFICATION_FROM_EMAIL` must be verified in Resend
- the visitor email is set as `reply_to`
- if notifications are not configured, form submissions still save to the CMS inbox

## API Test Commands

### Public APIs

```bash
curl -s http://localhost:5000/api/public/profile | jq
curl -s http://localhost:5000/api/public/projects | jq
curl -s http://localhost:5000/api/public/projects/featured | jq
curl -s http://localhost:5000/api/public/skills | jq
curl -s http://localhost:5000/api/public/experience | jq
curl -s http://localhost:5000/api/public/achievements | jq
curl -s http://localhost:5000/api/public/education | jq
curl -s http://localhost:5000/api/public/dashboard-stats | jq
```

### Health and DB diagnostics

```bash
curl -s http://localhost:5000/api/health | jq
curl -s http://localhost:5000/health | jq
curl -s http://localhost:5000/api/test/db | jq
```

### Admin login

```bash
curl -s http://localhost:5000/api/admin/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"ChangeMe123!"}' | jq
```

### Contact form submit

```bash
curl -s http://localhost:5000/api/public/contact \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "subject":"Portfolio inquiry",
    "message":"This is a test message with more than ten characters."
  }' | jq
```

## Render Deployment

The repo includes a Render blueprint in [render.yaml](/Users/priyanshumidha/Documents/Personal website /render.yaml:1).

### Backend service

Configured as:

- `rootDir: server`
- `buildCommand: npm install`
- `startCommand: npm run start`
- `healthCheckPath: /api/health`

Required backend env vars on Render:

- `CLIENT_URL`
- `PUBLIC_SERVER_URL`
- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional backend env vars on Render:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CONTACT_NOTIFICATION_PROVIDER`
- `CONTACT_NOTIFICATION_TO_EMAIL`
- `CONTACT_NOTIFICATION_FROM_EMAIL`
- `RESEND_API_KEY`

Recommended production values:

- `NODE_ENV=production`
- `PUBLIC_SERVER_URL=https://your-backend-service.onrender.com`
- `CLIENT_URL=https://your-frontend-site.onrender.com`

### Frontend static site

Configured as:

- `rootDir: client`
- `buildCommand: npm install && npm run build`
- `staticPublishPath: ./dist`
- `VITE_API_BASE_URL=https://your-backend-service.onrender.com/api`
- SPA rewrite from `/*` to `/index.html`

If you deploy the frontend manually instead of using the blueprint, make sure the rewrite is still configured for client-side routing.

## Troubleshooting

### Public site loads but CMS/public data is missing

- Check `VITE_API_BASE_URL`
- Check backend CORS `CLIENT_URL`
- Confirm MongoDB is reachable
- Confirm records are marked `isPublished: true`

### Admin login fails

- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- Re-run `npm run seed:admin` after changing admin credentials
- Make sure the login request uses a valid email string

### CMS save fails with validation errors

- Check the exact inline/toast error from the backend
- Confirm required fields are present
- Confirm select fields use valid enums
- Confirm `displayOrder` is not negative

### Resume upload works locally but breaks in production

- Local fallback depends on writable local disk and `PUBLIC_SERVER_URL`
- Use Cloudinary for durable production uploads on Render

### Contact form submits but no email arrives

- Confirm the message appears in `/admin/messages`
- Verify `CONTACT_NOTIFICATION_TO_EMAIL`
- Verify `CONTACT_NOTIFICATION_FROM_EMAIL`
- Verify `RESEND_API_KEY`
- Confirm the sender/domain is verified in Resend

### Health check fails on Render

- Confirm the backend is reachable at `/api/health`
- Confirm Render uses the backend service URL, not the frontend URL
- Check server logs for Mongo or startup errors

## Extra Features Status

Already present:

- portfolio completion stats
- activity heatmap
- contact message status

Recommended next-phase additions:

- CMS preview mode
- GitHub repo import
- resume versioning
- SEO/OpenGraph metadata

## Useful Project Docs

- [CMS_SAVE_DEBUG_CHECKLIST.md](/Users/priyanshumidha/Documents/Personal website /CMS_SAVE_DEBUG_CHECKLIST.md:1)
- [PROJECT_CHANGES.md](/Users/priyanshumidha/Documents/Personal website /PROJECT_CHANGES.md:1)
