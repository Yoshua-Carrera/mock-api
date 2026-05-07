> [!CAUTION]
> This mock server is still a work in progress.

# Mock API (Go)

A high-performance implementation of the mock API server in Go.

## Status

Currently, this implementation is under active development and does not yet feature the full file-driven mocking capabilities of the Express.js version.

## Features (Planned)

- High-performance REST and GraphQL mocking.
- File-driven scenario selection.
- Low memory footprint.

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

The server starts on `http://localhost:8080` by default.
