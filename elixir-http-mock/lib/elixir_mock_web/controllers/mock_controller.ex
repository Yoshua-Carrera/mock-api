defmodule ElixirMockWeb.MockController do
  use ElixirMockWeb, :controller
  alias ElixirMockWeb.OrchestrationController, as: OC
  alias ElixirMockWeb.FileReaderController, as: FR

  @spec getHeader(Plug.Conn.t()) :: String.t()
  def getHeader(%Plug.Conn{} = conn) do
    case Plug.Conn.get_req_header(conn, "mockusername") do
      [header_val | _] -> header_val
      [] -> "_default"
    end
  end

  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(%Plug.Conn{} = conn, %{} = _params) do
    mockUserName = getHeader(conn)

    {path, f} = FR.readFile("#{conn.method}/#{conn.path_info}", mockUserName)

    case Map.has_key?(f, "mockOrchestration") do
      false ->
        {mockDelay, statusCode} = f |> FR.extractMetadata()
        Process.sleep(mockDelay)

        json(
          conn |> put_status(statusCode),
          f
          |> FR.cleanMetadata()
        )

      true ->
        orchestratedF = f |> OC.handleOrchestration(path)
        {mockDelay, statusCode} = orchestratedF |> FR.extractMetadata()

        Process.sleep(mockDelay)

        json(
          conn |> put_status(statusCode),
          orchestratedF
          |> FR.cleanMetadata()
        )
    end
  end
end
