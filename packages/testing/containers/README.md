# aura Test Containers - Usage Guide

A simple way to spin up aura container stacks for development and testing.

## Quick Start

```bash
# Start a basic aura instance (SQLite database)
pnpm stack

# Start with PostgreSQL database
pnpm stack --postgres

# Start in queue mode (with Redis + PostgreSQL)
pnpm stack --queue
```

When started, you'll see:
- **URL**: http://localhost:[random-port]


## Common Usage Patterns

### Development with Container Reuse
```bash
# Enable container reuse (faster restarts)
pnpm run stack              # SQLite
pnpm run stack:postgres     # PostgreSQL
pnpm run stack:queue        # Queue mode
pnpm run stack:multi-main   # Multiple main instances
```

### Queue Mode with Scaling
```bash
# Custom scaling: 3 main instances, 5 workers
pnpm stack --queue --mains 3 --workers 5

# Single main, 2 workers
pnpm stack --queue --workers 2
```

### Environment Variables
```bash
# Set custom environment variables
pnpm run stack --postgres --env aura_LOG_LEVEL=info --env aura_ENABLED_MODULES=insights
```

### Parallel Testing
```bash
# Run multiple stacks in parallel with unique names
pnpm run stack --name test-1 --postgres
pnpm run stack --name test-2 --queue
```


## Custom Container Config

### Via Command Line
```bash
# Pass any aura env vars to containers
aura_TEST_ENV='{"aura_METRICS":"true"}' npm run stack:standard
aura_TEST_ENV='{"aura_LOG_LEVEL":"debug","aura_METRICS":"true","aura_ENABLED_MODULES":"insights"}' npm run stack:postgres
```

## Programmatic Usage

```typescript
import { createauraStack } from './containersaurara-test-containers';

// Simple SQLite instance
const stack = await createauraStack();

// PostgreSQL with custom environment
const stack = await createauraStack({
  postgres: true,
  env: { aura_LOG_LEVEL: 'debug' }
});

// Queue mode with scaling
const stack = await createauraStack({
  queueMode: { mains: 2, workers: 3 }
});

// Use the stack
console.log(`aura available at: ${stack.baseUrl}`);

// Clean up when done
await stack.stop();
```

## Configuration Options

| Option | Description | Example |
|--------|-------------|---------|
| `--postgres` | Use PostgreSQL instead of SQLite | `npm run stack -- --postgres` |
| `--queue` | Enable queue mode with Redis | `npm run stack -- --queue` |
| `--mains <n>` | Number of main instances (requires queue mode) | `--mains 3` |
| `--workers <n>` | Number of worker instances (requires queue mode) | `--workers 5` |
| `--name <name>` | Custom project name for parallel runs | `--name my-test` |
| `--env KEY=VALUE` | Set environment variables | `--env aura_LOG_LEVEL=debug` |

## Container Architecture

### Single Instance (Default)
```
┌─────────────┐
│    aura      │ ← SQLite database
│  (SQLite)   │
└─────────────┘
```

### With PostgreSQL
```
┌─────────────┐    ┌──────────────┐
│    aura      │────│ PostgreSQL   │
│             │    │              │
└─────────────┘    └──────────────┘
```

### Queue Mode
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  aura-main   │────│ PostgreSQL   │    │   Redis     │
└─────────────┘    └──────────────┘    └─────────────┘
┌─────────────┐                        │             │
│ aura-worker  │────────────────────────┘             │
└─────────────┘                                      │
┌─────────────┐                                      │
│ aura-worker  │──────────────────────────────────────┘
└─────────────┘
```

### Multi-Main with Load Balancer
```
                    ┌──────────────┐
                ────│              │ ← Entry point
               /    │ Load Balancer│
┌─────────────┐     └──────────────┘
│ aura-main-1  │────┐
└─────────────┘    │ ┌──────────────┐    ┌─────────────┐
┌─────────────┐    ├─│ PostgreSQL   │    │   Redis     │
│ aura-main-2  │────┤ └──────────────┘    └─────────────┘
└─────────────┘    │                     │             │
┌─────────────┐    │ ┌─────────────────────────────────┤
│ aura-worker  │────┘ │                                 │
└─────────────┘      └─────────────────────────────────┘
```

## Cleanup

```bash
# Remove all aura containers and networks
pnpm run stack:clean:all


## Tips

- **Container Reuse**: Set `TESTCONTAINERS_REUSE_ENABLE=true` for faster development cycles
- **Parallel Testing**: Use `--name` parameter to run multiple stacks without conflicts
- **Queue Mode**: Automatically enables PostgreSQL (required for queue mode)
- **Multi-Main**: Requires queue mode and special licensing read from aura_LICENSE_ACTIVATION_KEY environment variable
- **Log Monitoring**: Use the `ContainerTestHelpers` class for advanced log monitoring in tests

## Docker Image

By default, uses the `auraioaurara:local` image. Override with:
```bash
export aura_DOCKER_IMAGEauraraiauraura:dev
pnpm run stack
```
