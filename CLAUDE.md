# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack application for body makeup evolution with separate frontend and backend directories:

- `frontend/` - Next.js 15.5.2 application with React 19, TypeScript, and Tailwind CSS
- `backend/` - Currently empty, prepared for backend implementation

## Frontend Architecture

The frontend uses Next.js with the App Router pattern:

- Built with Next.js 15.5.2, React 19, and TypeScript
- Uses Tailwind CSS v4 for styling
- App Router structure in `src/app/`
- Path aliasing configured (`@/*` maps to `./src/*`)
- Geist font family integrated

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
```

## Key Configuration Files

- `frontend/package.json` - Dependencies and scripts
- `frontend/tsconfig.json` - TypeScript configuration with strict mode
- `frontend/next.config.ts` - Next.js configuration
- `frontend/postcss.config.mjs` - PostCSS configuration for Tailwind

## Development Notes

- The project uses Bun as the package manager (bun.lock present)
- TypeScript is configured in strict mode
- No linting or testing scripts are currently configured
- Backend directory is empty and ready for implementation