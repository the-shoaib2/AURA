# AURA Workflow Platform

This is the main AURA package that provides the workflow automation platform functionality.

## Features

- RESTful API server running on port 8080
- CORS enabled for frontend connection (port 5174)
- Health check endpoints
- Modular architecture with workspace dependencies

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Development mode:**
   ```bash
   pnpm dev
   ```

4. **Build for production:**
   ```bash
   pnpm build
   ```

5. **Start production server:**
   ```bash
   pnpm start
   ```

## API Endpoints

- `GET /health` - Health check
- `GET /api/v1/status` - API status information

## Frontend Connection

The API is configured to accept connections from:
- `http://localhost:5174` (Web frontend)
- `http://127.0.0.1:5174`

## Dependencies

This package depends on other workspace packages:
- `aura-core` - Core functionality
- `aura-workflow` - Workflow engine
- `aura-nodes-base` - Base nodes
- `@aura/*` - Various AURA utilities

## Development

The package uses TypeScript and includes:
- Hot reloading with nodemon
- TypeScript compilation
- ESLint for code quality
- Biome for formatting 