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

  def getGraphqlFile(%Plug.Conn{} = conn, mockUserName) do
    mutationBody = conn.body_params["mutation"]
    queryBody = conn.body_params["query"]

    if mutationBody != nil do
      [_, operation_name] =
        Regex.run(~r/mutation\s+(\w+)/, mutationBody)

      FR.readFile("graphql/mutation/#{operation_name}", mockUserName)
    else
      [_, operation_name] =
        Regex.run(~r/query\s+(\w+)/, queryBody)

      FR.readFile("graphql/query/#{operation_name}", mockUserName)
    end
  end

  def handleMock(conn, f, path) do
    if is_integer(f) and f != 200 do
      json(
        conn |> put_status(f),
        f
      )
    end

    case Map.has_key?(f, "mockOrchestration") do
      false ->
        {mockDelay, statusCode} = f |> FR.extractMetadata()
        Process.sleep(mockDelay)

        if is_integer(f) and f != 200 do
          json(
            conn |> put_status(f),
            f
          )
        end

        json(
          conn |> put_status(statusCode),
          f
          |> FR.cleanMetadata()
        )

      true ->
        orchestratedF = f |> OC.handleOrchestration(path)

        if is_integer(orchestratedF) and orchestratedF != 200 do
          json(
            conn |> put_status(orchestratedF),
            orchestratedF
          )
        else
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

  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(%Plug.Conn{} = conn, %{} = _params) do
    mockUserName = getHeader(conn)

    if "#{conn.path_info}" == "graphql" do
      {path, f} = getGraphqlFile(conn, mockUserName)
      handleMock(conn, f, path)
    else
      {path, f} = FR.readFile("#{conn.method}/#{conn.path_info}", mockUserName)
      handleMock(conn, f, path)
    end
  end
end
