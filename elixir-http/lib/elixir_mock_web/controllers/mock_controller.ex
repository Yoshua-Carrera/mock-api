defmodule ElixirMockWeb.MockController do
  use ElixirMockWeb, :controller

  @spec readFile(Plug.Conn.t(), String.t()) :: term()
  def readFile(%Plug.Conn{} = conn, mockUserName) do
    "mock/#{conn.method}/#{conn.path_info}/#{mockUserName}.json"
    |> File.read!()
    |> Jason.decode!()
  end

  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(%Plug.Conn{} = conn, %{} = _params) do
    mockUserName =
      case Plug.Conn.get_req_header(conn, "mockusername") do
        [header_val | _] -> header_val
        [] -> "_default"
      end

    f = readFile(conn, mockUserName)

    json(conn, f)
  end
end
