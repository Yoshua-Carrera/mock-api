defmodule ElixirMockWeb.FileReaderController do
  @spec extractMetadata(term()) :: {non_neg_integer(), non_neg_integer()}
  def extractMetadata(f) do
    # Sleep if mock delay is found
    mockDelay =
      f |> Map.get("mockDelay", 0)

    # Extract status code, default to 200 if none is found
    statusCode = f |> Map.get("mockErrorCode", 200)

    {mockDelay, statusCode}
  end

  @spec readFile(Plug.Conn.t(), String.t()) :: {String.t(), term()}
  def readFile(%Plug.Conn{} = conn, mockUserName) do
    path = "mock/#{conn.method}/#{conn.path_info}/#{mockUserName}.json"

    case File.read(path) do
      {:ok, contents} ->
        {path, Jason.decode!(contents)}

      {:error, :enoent} ->
        if mockUserName === "_default" do
          {path, %{"mockErrorCode" => 404, "data" => nil, "errors" => ["Data not found"]}}
        else
          readFile(conn, "_default")
        end
    end
  end

  @spec extractMetadata(term()) :: term()
  def cleanMetadata(f) do
    f
    |> Map.delete("mockDelay")
    |> Map.delete("mockOrchestration")
    |> Map.delete("mockErrorCode")
  end
end
