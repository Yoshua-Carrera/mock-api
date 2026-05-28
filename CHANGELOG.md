# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.1] - 2026-05-27

### Added

- **Elixir (Phoenix)**: New mock implementation using Elixir and the Phoenix framework, providing a scalable alternative for mocking.
- **Go Implementation Enhancements**:
  - Functional REST and GraphQL mock handlers.
  - File-driven scenario selection using the `mockUserName` header.
  - Support for response orchestration to simulate stateful sequences.
  - Integrated `gqlgen` for schema-first GraphQL development.
  - Added logging middleware and live reloading support with `Air`.
  - Comprehensive documentation and examples in `go-http/README.md`.

### Changed

- Improved Go implementation from a basic WIP setup to a feature-rich mock server.
- Refined README documentation for Go and Express.js implementations.
- Updated root README with project overview and new implementation details.

## [1.0.0] - 2026-05-06

### Added

- Initial release of the Mock API suite with three distinct implementations: Express.js, Next.js (Legacy), and Go (WIP).

#### Express.js (TypeScript)

- **File-Driven Routing**: REST and GraphQL endpoints dynamically mapped to JSON files in the filesystem based on path and operation names.
- **Scenario Selection**: Use the `mockFile` header to select specific mock responses (e.g., `happy-path`, `error-500`).
- **Latency Simulation**: Added support for `mockDelay` field (in milliseconds) in JSON mocks to simulate network delays.
- **Status Code Support**: Support for `mockStatusCode` to define custom HTTP response codes.
- **Stateful Orchestration**: Sequence-based mocks using `orchestratedMock` for complex scenarios like polling.
- **GraphQL Support**: Operation-based routing for queries and mutations at the `/graphql` endpoint.
- **CI/CD**: Integrated GitHub Actions for linting, formatting (Prettier/ESLint), and code quality.

#### Go (WIP)

- High-performance Go implementation setup.
- Integration with `gqlgen` for schema-first GraphQL development.
- Support for live reloading during development using `Air`.
- Core file loader service for handling filesystem-based mocks.

#### Next.js (Legacy)

- Retained legacy implementation updated to Next.js 16 and React 19.
- Support for both REST (`/api/v1`) and GraphQL (`/api/v2/graphql`) mocking.

### Changed

- Unified multiple mock implementations into a single monorepo structure.
- Standardized documentation and READMEs across all projects.
