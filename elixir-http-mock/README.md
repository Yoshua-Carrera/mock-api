# Mock API (Elixir/Phoenix)

A scalable and high-performance mock API server implementation using **Elixir** and the **Phoenix** framework.

> [!WARNING]
> This implementation is currently **Under Development**.

## Rationale

- **Elixir & Phoenix**: Chosen for their exceptional concurrency model and ability to handle thousands of simultaneous connections with low latency.
- **Scalability**: Designed to be the most scalable implementation in this repository.

## Getting Started

### Prerequisites

- [Elixir](https://elixir-lang.org/install.html) (v1.14+)
- [Erlang/OTP](https://www.erlang.org/) (v25+)

### Installation

To install dependencies:
```bash
mix deps.get
```

### Running the Server

To start your Phoenix server:
```bash
mix phx.server
```

The server will be available at `http://localhost:8080`.

## Features (Planned)

- **File-driven REST and GraphQL mocking**.
- **Scenario selection** via custom headers.
- **Response Orchestration**.
- **Latency simulation**.
