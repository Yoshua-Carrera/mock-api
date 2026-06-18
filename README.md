# Mock API implementations

This repository contains multiple implementations of a file-driven mock API server. These servers are designed to provide a flexible and easy-to-use mocking environment for development and testing.

## Implementations

- **[Express.js (TypeScript)](./express-js)**: The primary and most feature-rich implementation. Supports dynamic REST and GraphQL mocking with orchestration and latency simulation.
- **[Go](./go-http)**: A high-performance implementation in Go, featuring REST and GraphQL support with response orchestration.
- **[Elixir (Phoenix)](./elixir-http)**: A scalable mock server implementation using Elixir and the Phoenix framework. (Under Development)
- **[Python (FastAPI)](./python)**: A modern implementation using FastAPI. (Under Development)
- **[Next.js (Legacy)](./next-js)**: A deprecated implementation using Next.js. Retained for legacy support.

## Feature Comparison

| Feature              |       Express.js        |            Go            | Elixir | Python | Next.js (Legacy) |
| :------------------- | :---------------------: | :----------------------: | :----: | :----: | :--------------: |
| **REST Support**     |           ✅            |            ✅            |   🚧   |   🚧   |        ✅        |
| **GraphQL Support**  |           ✅            |            ✅            |   ❌   |   ❌   |        ✅        |
| **Selection Header** |       `mockFile`        |      `mockUserName`      |  TBD   |  TBD   |      `from`      |
| **Delay Simulation** |    ✅ (`mockDelay`)     |     ✅ (`mockDelay`)     |   ❌   |   ❌   |        ❌        |
| **Orchestration**    | ✅ (`orchestratedMock`) | ✅ (`mockOrchestration`) |   ❌   |   ❌   |        ✅        |
| **Default Fallback** |     `_default.json`     |     `_default.json`      |  TBD   |  TBD   | `_default.json`  |

## Project Structure

```text
.
├── elixir-http-mock/    # Elixir (Phoenix) implementation
├── express-http-mock/     # Express.js (TypeScript) implementation
├── go-http-mock/        # Go implementation
├── next-http-mock/        # Next.js (Legacy) implementation
└── python-http-mock/         # Python (FastAPI) implementation
```

## Core Concepts

All implementations (to varying degrees) share these core concepts:

- **File-Driven Routing**: Mocks are defined by the directory structure in a `mocks` (or `mock`) folder.
- **Scenario Selection**: Use a custom header to select specific JSON mock files (e.g., `happy-path.json`, `error-500.json`).
- **Default Mocks**: Fallback to `_default.json` when no specific scenario is requested.

## Getting Started

Refer to the individual implementation directories for specific setup and usage instructions.
