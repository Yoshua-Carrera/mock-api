# Mock API Server

A lightweight, high-performance mock server built with **Express 5** and **TypeScript**, designed to provide a flexible and file-driven way to mock RESTful endpoints with zero configuration.

## 🚀 Rationale

- **Express 5 & TypeScript**: We chose Express for its minimal overhead and wide adoption. TypeScript provides type safety for our orchestration logic and state management, ensuring a reliable mocking environment.
- **File-Driven Design**: No databases or complex UIs. Everything is managed through your filesystem, allowing you to version-control your mocks alongside your application code.
- **Scenario-Based Testing**: Switch between different response scenarios (e.g., Happy Path, Error 500, Unauthorized) simply by changing a request header.

---

## 🏗️ Architecture

The server operates on a directory-to-URL mapping principle for both REST and GraphQL.

### 1. REST Folder-Based Routing
The server dynamically maps incoming REST requests to local files based on the HTTP method and URL path:
`./src/mocks/{METHOD}/{PATH}/`

**Examples:**
- `GET /hello` -> `./src/mocks/GET/hello/`
- `POST /auth/login` -> `./src/mocks/POST/auth/login/`

### 2. GraphQL Folder-Based Routing
The server exposes a GraphQL endpoint at `/graphql`. Operations are mapped to files based on the operation type (query/mutation) and the operation name:
`./src/mocks/graphql/{operationType}/{operationName}/`

**Examples:**
- `query { hello { ... } }` -> `./src/mocks/graphql/query/hello/`
- `mutation { login { ... } }` -> `./src/mocks/graphql/mutation/login/`

### 🔑 The `mockFile` Header (Mock Selection)
This is the core mechanism for selecting specific mock scenarios within a folder for both REST and GraphQL.

1. **Default Behavior**: If no header is provided, the server always looks for `_default.json` in the corresponding directory.
2. **Explicit Selection**: To use a specific mock file, pass the `mockFile` header with the name of the JSON file (without the `.json` extension).

| Header | Value | File Accessed |
| --- | --- | --- |
| *(Missing)* | N/A | `./src/mocks/.../_default.json` |
| `mockFile` | `happy-path` | `./src/mocks/.../happy-path.json` |
| `mockFile` | `error-500` | `./src/mocks/.../error-500.json` |

---

## 🛠️ Features

### 1. Latency Simulation
Add a `mockDelay` field (in milliseconds) to any mock JSON to simulate network latency or long-running operations. The server will wait for this duration before sending the response.
```json
{
  "mockDelay": 1500,
  "data": { "message": "This response was delayed by 1.5s" }
}
```

### 2. Stateful Orchestration
Test sequences of events (like polling) using `orchestratedMock`. This field takes an array of response objects. The server tracks the state per endpoint and cycles through the array on subsequent requests.
```json
{
  "orchestratedMock": [
    { "data": { "status": "pending" } },
    { "data": { "status": "processing" } },
    { "data": { "status": "completed" } }
  ]
}
```

---

## 🏃 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (Recommended)

### Installation
```bash
pnpm install
```

### Running the Server
```bash
pnpm run mock
```
The server starts on `http://localhost:8080` by default (configurable via `PORT` environment variable).
- REST Base: `http://localhost:8080/`
- GraphQL: `http://localhost:8080/graphql`

---

## 📝 How to Add Mocks

### Adding a REST Mock
1. **Identify the endpoint**: e.g., `GET /v1/users`.
2. **Create the directory**: `mkdir -p src/mocks/GET/v1/users`.
3. **Add a default response**: Create `_default.json` in that folder.

### Adding a GraphQL Mock
1. **Identify the operation**: e.g., `query getUser`.
2. **Create the directory**: `mkdir -p src/mocks/graphql/query/getUser`.
3. **Add a default response**: Create `_default.json` in that folder.

**Note:** The server automatically filters out the `mockDelay` and `orchestratedMock` keys from the final JSON response sent to your application.

---

## 🔗 Connecting to Your Application

Point your application's API base URL to `http://localhost:8080`.

**Example using `fetch` for REST:**
```javascript
const response = await fetch('http://localhost:8080/v1/users', {
  headers: {
    'mockFile': 'unauthorized' // Requests unauthorized.json
  }
});

const data = await response.json();
```

**Example using Apollo Client for GraphQL:**
```javascript
const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  headers: {
    'mockFile': 'happy-path' // Requests happy-path.json
  }
});
```

---

## 📚 Legacy Support
The `/legacy` directory contains an older Next.js implementation. If your project specifically requires that version, refer to `legacy/README.md` for setup instructions.
