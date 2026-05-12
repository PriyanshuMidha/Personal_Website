---
name: portfolio-change-tracker
description: Maintain the Personal Portfolio + CMS repo change log in `PROJECT_CHANGES.md`. Use when Codex changes portfolio frontend routes, backend APIs, Mongoose models, CMS behavior, upload flows, deployment config, or other meaningful implementation behavior in this repo and the Markdown spec must stay in sync.
---

# Portfolio Change Tracker

## Overview

Keep `PROJECT_CHANGES.md` as the concise source of truth for live architecture, public/admin routes, model behavior, and notable implementation decisions in this portfolio repo.

## Workflow

1. Read `PROJECT_CHANGES.md` before making edits.
2. Inspect the actual code paths that changed.
3. Update only the sections affected by the implementation:
   - architecture
   - backend APIs
   - content model behavior
   - frontend routes and CMS behavior
   - deployment notes or deferred items
4. Keep the file short, implementation-oriented, and accurate to the current codebase.
5. Remove stale statements when behavior changes.

## Content Rules

- Prefer bullets over long prose.
- Describe live behavior, not planned aspirations, except in explicit deferred notes.
- Mention exact API paths and frontend route paths when they change.
- Mention schema-field additions or behavior changes when they affect app behavior.
- Keep the heading structure stable unless a small improvement makes the file clearer.

## Validation

- Confirm documented API paths exist in the Express routes.
- Confirm documented page paths exist in the React router.
- Confirm model and CMS behavior statements match current schemas and admin flows.
- Ensure deferred notes remain truly deferred.
