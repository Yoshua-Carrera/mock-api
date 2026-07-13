# Mock API implementations

This repository contains multiple implementations of a file-driven mock API server. These servers are designed to provide a flexible, zero-config, and easy-to-use mocking environment for development and testing.

---

## 🏗️ Repository Structure

Each mock server is self-contained in its own directory, sharing a common folder-based mock structure:

```text
.
├── elixir-http-mock/   # Elixir (Phoenix & Absinthe) implementation
├── express-http-mock/  # Express.js (TypeScript) implementation [Primary]
├── go-http-mock/       # Go implementation [High-Performance]
├── python-http-mock/   # Python (FastAPI) implementation [Work in Progress]
└── rust-http-mock/     # Rust implementation [Work in Progress]
```

---

## 📊 Feature Comparison

| Feature              |       Express.js        |            Go            |          Elixir          | Python |
| :------------------- | :---------------------: | :----------------------: | :----------------------: | :----: |
| **REST Support**     |           ✅            |            ✅            |            ✅            |   🚧   |
| **GraphQL Support**  |           ✅            |            ✅            |            ✅            |   ❌   |
| **Selection Header** |     `mockUserName`      |      `mockUserName`      |      `mockUserName`      |  TBD   |
| **Delay Simulation** |    ✅ (`mockDelay`)     |     ✅ (`mockDelay`)     |     ✅ (`mockDelay`)     |   ❌   |
| **Orchestration**    | ✅ (`orchestratedMock`) | ✅ (`mockOrchestration`) | ✅ (`mockOrchestration`) |   ❌   |
| **Default Fallback** |     `_default.json`     |     `_default.json`      |     `_default.json`      |  TBD   |

---

## 💡 Core Concepts

All implementations share these fundamental file-driven routing principles:

### 1. File-Driven REST Routing

Requests are mapped dynamically to local JSON files matching the HTTP method and URL path:

- **Express.js**: `express-http-mock/src/mocks/{METHOD}/{PATH}/`
- **Go**: `go-http-mock/mock/{METHOD}/{PATH}/`
- **Elixir**: `elixir-http-mock/mock/{METHOD}/{PATH}/`

_Example:_ `GET /hello` maps to the `/GET/hello/` directory on disk.

### 2. File-Driven GraphQL Routing

GraphQL queries/mutations are mapped based on their operation type and operation name:

- **Express.js**: `express-http-mock/src/mocks/graphql/{query|mutation}/{operationName}/`
- **Go**: `go-http-mock/mock/{query|mutation}/{operationName}/`
- **Elixir**: `elixir-http-mock/mock/{query|mutation}/{operationName}/`

### 3. Scenario Selection & Fallbacks

- **Default**: When no selection header is passed, the server looks for `_default.json`.
- **Custom Scenarios**: Pass the designated selection header (e.g., `mockFile: error-500` or `mockUserName: error-500`) to load a specific `error-500.json` file inside the target directory.

### 4. Delay & Orchestration Simulation

- **Delay Simulation**: Include `"mockDelay": 1500` inside your JSON file to pause the response by that duration.
- **Stateful Orchestration**: Cycle through a sequence of mock responses to simulate stateful actions (e.g., polling statuses) using the orchestration keys.

---

## 🏃 Getting Started

Refer to the README inside each implementation directory for language-specific setup, prerequisites, and execution scripts:

- [Express.js Setup](./express-http-mock/README.md)
- [Go Setup](./go-http-mock/README.md)
- [Elixir Setup](./elixir-http-mock/README.md)
