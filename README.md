# Body Makeup Evolution

A full-stack application for body makeup evolution with modern React frontend and planned backend implementation.

## Project Structure

```
├── frontend/          # Next.js application
├── backend/          # Backend implementation (TBD)
├── docs/             # Documentation and specifications
└── schemas/          # OpenAPI specifications
```

## Frontend

Modern Next.js application built with React 19 and TypeScript.

### Core Technologies

- **Next.js** v15.5.2 - React framework with App Router
- **React** v19.1.0 - UI library
- **TypeScript** v5 - Type-safe JavaScript
- **Tailwind CSS** v4 - Utility-first CSS framework
- **Geist Font** - Vercel optimized font family

### State Management & API

- **@tanstack/react-query** v5.87.4 - Server state management
- **zod** v4.1.8 - TypeScript-first schema validation
- **orval** v7.11.2 - OpenAPI code generation
- **msw** v2.11.1 - API mocking for development

### Development Tools

- **Prettier** v3.6.2 - Code formatting
- **Bun** - Package manager and runtime

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd body-makeup-evolution
```

2. Navigate to frontend and install dependencies:
```bash
cd frontend
bun install
# or npm install
```

3. Start the development server:
```bash
bun dev
# or npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### API Development

Generate TypeScript client from OpenAPI schema:
```bash
cd frontend
bun run orval
```

This will generate:
- React Query hooks in `src/api/endpoints/`
- TypeScript types in `src/api/models/`
- Zod schemas in `src/api/zod/`
- MSW mocks for development

## Project Commands

```bash
# Development
bun dev              # Start development server

# Build
bun build           # Create production build
bun start           # Start production server

# Code Generation
bun orval           # Generate API client from OpenAPI schema
```

## Architecture

- **Frontend**: Next.js with App Router pattern
- **Styling**: Tailwind CSS v4
- **Type Safety**: TypeScript with strict mode
- **API Layer**: Auto-generated from OpenAPI specs
- **Mocking**: MSW for development
- **State**: React Query for server state

## Contributing

1. Update OpenAPI schema in `schemas/openapi.2.0.yaml`
2. Run `bun orval` to generate TypeScript types
3. Implement features using generated hooks
4. Format code with Prettier before committing
