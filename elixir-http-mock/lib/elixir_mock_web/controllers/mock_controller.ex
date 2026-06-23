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
    # Extract username from headers
    mockUserName = getHeader(conn)

    # Extract read file from mock repository
    {path, f} = FR.readFile(conn, mockUserName)

    case Map.has_key?(f, "mockOrchestration") do
      false ->
        {mockDelay, statusCode} = FR.extractMetadata(f)
        Process.sleep(mockDelay)

        json(
          conn |> put_status(statusCode),
          f
          |> FR.extractMetadata()
        )

      true ->
        orchestratedF = OC.handleOrchestration(f, path)
        {mockDelay, statusCode} = FR.extractMetadata(orchestratedF)

        Process.sleep(mockDelay)

        json(
          conn |> put_status(statusCode),
          orchestratedF
          |> FR.extractMetadata()
        )
    end
  end
end
