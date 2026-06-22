defmodule ElixirMockWeb.MockController do
  use ElixirMockWeb, :controller
  alias ElixirMockWeb.OrchestrationController, as: OC

  @spec readFile(Plug.Conn.t(), String.t()) :: term()
  def readFile(%Plug.Conn{} = conn, mockUserName) do
    "mock/#{conn.method}/#{conn.path_info}/#{mockUserName}.json"
    |> File.read!()
    |> Jason.decode!()
  end

  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(%Plug.Conn{} = conn, %{} = _params) do
    # Extract username from headers
    mockUserName =
      case Plug.Conn.get_req_header(conn, "mockusername") do
        [header_val | _] -> header_val
        [] -> "_default"
      end

    # Extract read file from mock repository
    f = readFile(conn, mockUserName)

    # Sleep if mock delay is found
    case Map.get(f, "mockDelay") do
      nil -> :ok
      delay -> Process.sleep(delay)
    end

    # Extract status code, default to 200 if none is found
    statusCode = Map.get(f, "mockErrorCode", 200)

    OC.handleOrchestration(f)

    # Return file in the response
    json(conn |> put_status(statusCode), f |> Map.delete("mockDelay"))
  end
end
