defmodule ElixirMockWeb.Resolvers.MockResolver do
  alias ElixirMockWeb.FileReaderController, as: FR
  alias ElixirMockWeb.OrchestrationController, as: OC

  @spec getHeader(Plug.Conn.t()) :: String.t()
  def getHeader(%Plug.Conn{} = conn) do
    case Plug.Conn.get_req_header(conn, "mockusername") do
      [header_val | _] -> header_val
      [] -> "_default"
    end
  end

  defp build_error(status, path, body) do
    {:error,
     %{
       message: "Mock error",
       status: status,
       path: path,
       body: body
     }}
  end

  @spec mock(any(), map(), Absinthe.Resolution.t()) ::
          {:ok, map()} | {:error, map()}
  def mock(_parent, _args, %Absinthe.Resolution{} = resolution) do
    conn = resolution.context.conn

    mockUserName = getHeader(conn)

    operationType = conn.body_params["operationName"]

    {path, f} =
      FR.readFile(
        "#{resolution.parent_type.identifier}/#{operationType}",
        mockUserName
      )

    case Map.has_key?(f, "mockOrchestration") do
      false ->
        {mockDelay, statusCode} = f |> FR.extractMetadata()
        Process.sleep(mockDelay)

        if (is_integer(f) and f != 200) or statusCode != 200 do
          build_error(f, path, "Something went wrong")
        else
          {:ok,
           %{
             data: f["data"],
             error: f["error"]
           }}
        end

      true ->
        orchestratedF = f |> OC.handleOrchestration(path)
        {mockDelay, statusCode} = orchestratedF |> FR.extractMetadata()

        Process.sleep(mockDelay)

        if (is_integer(f) and f != 200) or statusCode != 200 do
          build_error(f, path, "Something went wrong")
        else
          {:ok,
           %{
             data: f["data"],
             error: f["error"]
           }}
        end
    end
  end
end
