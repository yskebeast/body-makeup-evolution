# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack application for body makeup evolution with separate frontend and backend directories:

- `frontend/` - Next.js 15.5.2 application with React 19, TypeScript, and Tailwind CSS
- `backend/` - Currently empty, prepared for backend implementation
- `docs/` - Documentation repository for AI-generated content and specifications
- `schemas/` - OpenAPI specifications and schema definitions

## Frontend Architecture

The frontend uses Next.js with the App Router pattern:

- Built with Next.js 15.5.2, React 19, and TypeScript
- Uses Tailwind CSS v4 for styling
- App Router structure in `src/app/`
- Path aliasing configured (`@/*` maps to `./src/*`)
- Geist font family integrated

### Key Dependencies

- **@tanstack/react-query** v5.87.4 - Server state management
- **zod** v4.1.8 - TypeScript-first schema validation
- **msw** v2.11.1 - API mocking for development and testing
- **orval** v7.11.2 - OpenAPI code generation
- **prettier** v3.6.2 - Code formatting

### API Layer

- Uses Orval for generating TypeScript clients from OpenAPI specs
- Generates React Query hooks for API calls
- MSW integration for API mocking
- Zod schemas generated alongside TypeScript types
- Custom fetch implementation for HTTP client

## Development Commands

All commands should be run from the `frontend/` directory:

```bash
# Development server (runs on http://localhost:3000)
npm run dev
# or
bun dev

# Production build
npm run build

# Start production server
npm run start

# Generate API client from OpenAPI schema
npm run orval
```

## Key Configuration Files

- `frontend/package.json` - Dependencies and scripts
- `frontend/tsconfig.json` - TypeScript configuration with strict mode
- `frontend/next.config.ts` - Next.js configuration
- `frontend/postcss.config.mjs` - PostCSS configuration for Tailwind
- `frontend/orval.config.ts` - API code generation configuration
- `schemas/openapi.2.0.yaml` - OpenAPI specification (Pet Store example)

## Development Notes

- The project uses Bun as the package manager (bun.lock present)
- TypeScript is configured in strict mode
- Prettier configured for code formatting
- MSW configured with worker directory in `public/`
- API generation targets `src/api/endpoints/` for React Query hooks
- Zod schemas generated in `src/api/zod/`
- Backend directory is empty and ready for implementation

## API Development Workflow

1. Update OpenAPI schema in `schemas/openapi.2.0.yaml`
2. Run `npm run orval` to generate TypeScript types and React Query hooks
3. MSW mocks are automatically generated for development
4. Zod schemas provide runtime validation