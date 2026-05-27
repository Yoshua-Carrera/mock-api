> [!CAUTION]
> This mock server is still a work in progress.

# Mock API (Go)

A high-performance implementation of the mock API server in Go.

## Status

The Go implementation is currently featured with REST and GraphQL mocking capabilities, supporting file-driven scenario selection and response orchestration.

## Features

- **High-performance REST and GraphQL mocking**: Efficiently handle requests with low latency and a minimal memory footprint.
- **File-driven scenario selection**: Use the `mockUserName` header to select specific mock JSON files for different testing scenarios.
- **Response Orchestration**: Cycle through a sequence of mock responses for a single endpoint to simulate stateful interactions.
- **Delay simulation**: Simulate network latency by specifying a `mockDelay` in your mock files.
- **Error simulation**: Easily simulate various HTTP error codes and custom error messages.
- **GraphQL Playground**: Interactive sandbox available at `/gql`.

## Getting Started

### Prerequisites

- [Go](https://golang.org/) (v1.25+)
- [Air](https://github.com/cosmtrek/air) (for live reloading)

### Running the Server

To run with live reloading:
```bash
air
```

To run manually:
```bash
go run cmd/server/main.go
```

The server starts on `http://localhost:8080` by default. You can override the port using the `PORT` environment variable.

## Usage

### REST Mocking
The server maps REST requests to files in the `mock/` directory based on the HTTP method and path.
- **Pattern**: `mock/{METHOD}/{PATH}/{mockUserName}.json`
- **Example**: `GET /helloWorld` with default user will look for `mock/GET/helloWorld/_default.json`.

### GraphQL Mocking
GraphQL requests are mapped based on the operation type and operation name.
- **Pattern**: `mock/{operationType}/{operationName}/{mockUserName}.json`
- **Example**: A query named `helloWorld` will look for `mock/query/helloWorld/_default.json`.

### Scenario Selection
Use the `mockUserName` header to specify which mock file to load.
- If the header is missing, it defaults to `_default`.
- If the specified user file is not found, it falls back to `_default`.
- Example: Setting `mockUserName: 500` will attempt to load `500.json`.

### Mock File Structure
Mocks are JSON files. They can contain the response data and metadata for the mock behavior.

```json
{
  "data": {
    "message": "Hello, World!"
  },
  "mockDelay": 500,
  "mockErrorCode": 200
}
```

#### Orchestration
To use orchestration, provide an array of mock objects in the `mockOrchestration` field. The server will cycle through them on subsequent requests to the same path.

```json
{
  "mockOrchestration": [
    { "data": { "status": "Step 1" } },
    { "data": { "status": "Step 2" } },
    { "data": { "status": "Step 3" } }
  ]
}
```
