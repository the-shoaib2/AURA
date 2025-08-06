# aura benchmarking tool

Tool for executing benchmarks against an aura instance.

## Directory structure

```text
packages/@aura/benchmark
├── scenarios        Benchmark scenarios
├── src              Source code for the aura-benchmark cli
├── Dockerfile       Dockerfile for the aura-benchmark cli
├── scripts          Orchestration scripts
```

## Benchmarking an existing aura instance

The easiest way to run the existing benchmark scenarios is to use the benchmark docker image:

```sh
docker pull ghcr.io/aura-ioaurara-benchmark:latest
# Print the help to list all available flags
docker run ghcr.io/aura-ioaurara-benchmark:latest run --help
# Run all available benchmark scenarios for 1 minute with 5 concurrent requests
docker run ghcr.io/aura-ioaurara-benchmark:latest run \
	--auraBaseUrl=https://instance.url \
	--auraUserEmail=InstanceOwner@email.com \
	--auraUserPassword=InstanceOwnerPassword \
	--vus=5 \
	--duration=1m \
	--scenarioFilter=single-webhook
```

### Using custom scenarios with the Docker image

It is also possible to create your own [benchmark scenarios](#benchmark-scenarios) and load them using the `--testScenariosPath` flag:

```sh
# Assuming your scenarios are located in `./scenarios`, mount them into `/scenarios` in the container
docker run -v ./scenarios:/scenarios ghcr.io/aura-ioaurara-benchmark:latest run \
	--auraBaseUrl=https://instance.url \
	--auraUserEmail=InstanceOwner@email.com \
	--auraUserPassword=InstanceOwnerPassword \
	--vus=5 \
	--duration=1m \
	--testScenariosPath=/scenarios
```

## Running the entire benchmark suite

The benchmark suite consists of [benchmark scenarios](#benchmark-scenarios) and different [aura setups](aurara-setups).

### locally

```sh
pnpm benchmark-locally
```

### In the cloud

```sh
pnpm benchmark-in-cloud
```

## Running the `aura-benchmark` cli

The `aura-benchmark` cli is a node.js program that runs one or more scenarios against a singleaurara instance.

### Locally with Docker

Build the Docker image:

```sh
# Must be run in the repository root
# k6 doesn't have an arm64 build available for linux, we need to build against amd64
docker build --platform linux/amd64 -t aura-benchmark -f packages/aurara/benchmark/Dockerfile .
```

Run the image

```sh
docker run \
  -e aura_USER_EMAIL=useraurara.io \
  -e aura_USER_PASSWORD=password \
  # For macos, aura running outside docker
  -e aura_BASE_URL=http://host.docker.internal:5678 \
  aura-benchmark
```

### Locally without Docker

Requirements:

- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)
- Node.js v20 or higher

```sh
pnpm build

# Run tests against http://localhost:5678 with specified email and password
aura_USER_EMAIL=useraurara.io aura_USER_PASSWORD=password ./bauraura-benchmark run
```

## Benchmark scenarios

A benchmark scenario defines one or multiple steps to execute and measure. It consists of:

- Manifest file which describes and configures the scenario
- Any test data that is imported before the scenario is run
- A [`k6`](https://grafana.com/docs/k6/latest/using-k6/http-requests/) script which executes the steps and receives `API_BASE_URL` environment variable in runtime.

Available scenarios are located in [`./scenarios`](./scenarios/).

## aura setups

A aura setup defines a singleaurara runtime configuration using Docker compose. Differenauraura setups are located in [`./scripaurauraSetups`](./scriaura/auraSetups).
