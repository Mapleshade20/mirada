# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Contigo (backend repo name "hilo" and frontend repo name "mirada") is a one-time social pairing application that matches university students (1 female - 1 male) based on interests, traits, and preferences. This is a React frontend that will communicate with the existing fully-featured Rust backend.

## Development Commands

When unsure about usage of an external component, use `context7` mcp tool to check out online docs.

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production (TypeScript check included)
- `npx @biomejs/biome check --write` - Format, lint, and organize imports of all files
- `pnpm run preview` - Preview production build

## Code Formatting

Uses Biome for formatting with these key settings:
- 2-space indentation
- Semicolons required
- Trailing commas in arrays/objects
- Arrow function parentheses always required
- Line width: 80 characters

## Architecture & Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (with SWC for fast compilation)
- **Current Stack**:
  - **Styling**: Tailwind CSS + shadcn/ui components (Radix UI primitives)
  - **UI Libraries**: Ant Design (forms) + shadcn/ui (other components)
  - **HTTP**: Axios with React Query for data fetching
  - **State**: Zustand
  - **Routing**: React Router DOM v6
  - **Icons**: Lucide React + Ant Design Icons
  - **Internationalization**: react-i18next (configured, texts go in `src/i18n/locales/`)
  - **Form Handling**: React Hook Form with Zod validation
- Note the "@" alias defined in `vite.config.ts` and `components.json`

### Backend Integration

The frontend will integrate with an Rust-based backend providing:
- JWT authentication with refresh tokens
- Email verification (university domains only)
- File uploads (ID cards, profile photos)
- Multi-step user workflow: verification → form completion → match previews → final matching
- Sophisticated matching algorithm with veto system

Development and production connect with different backend URLs (configured via environment variables)

## User Workflow States
Users progress through these states (affects UI rendering):
1. `unverified` - Email verified, awaiting ID card upload
2. `verification_pending` - ID card uploaded, awaiting admin approval
3. `verified` - Can fill a questionnaire form
4. `form_completed` - Can view match previews and do veto
5. `matched` - Assigned final match, can accept/reject
6. `confirmed` - Self has accepted, the partner may be deciding or confirmed

## Key API Endpoints (Backend)

See `docs/api.md`

## Project Structure

- `src/components/` - Reusable UI components (custom + shadcn/ui)
- `src/pages/` - Route-level page components
- `src/store/` - Zustand state management (authStore.ts for authentication)
- `src/lib/` - Utility functions and API client (api.ts)
- `src/hooks/` - Custom React hooks
- `src/i18n/` - Internationalization setup and translations
- `src/utils/` - Validation schemas and helper functions
- `src/data/` - Static data and constants

## Current Implementation Status

- ✅ **Authentication**: JWT-based auth with Zustand store
- ✅ **Routing**: Protected routes based on user status
- ✅ **UI Framework**: shadcn/ui + Ant Design integration
- ✅ **Internationalization**: react-i18next setup
- ✅ **Form Handling**: React Hook Form + Zod validation
- ✅ **Draft Saving**: Local storage for form data persistence
- ✅ **API Integration**: Completed backend integration

## Design Principles

- **State-Driven UI**: User status determines available actions and views
- **Responsive Design**: Desktop and mobile support
- **Optimistic UI**: Immediate feedback for user actions
- **Auto Token Refresh**: Frontend handles JWT expiration automatically
- **Component Composition**: Prefer composition over large monolithic components
- **Type Safety**: Strict TypeScript usage with Zod for runtime validation
