defmodule ElixirMockWeb.FileReaderController do
  alias ElixirMockWeb.LoggingController, as: LC
  @spec extractMetadata(term()) :: {non_neg_integer(), non_neg_integer()}
  def extractMetadata(f) do
    mockDelay =
      f |> Map.get("mockDelay", 0)

    statusCode = f |> Map.get("mockErrorCode", 200)

    {mockDelay, statusCode}
  end

  @spec readFile(String.t(), String.t()) :: {String.t(), term()}
  def readFile(path, mockUserName) do
    fullPath = "mock/#{path}/#{mockUserName}.json"

    case File.read(fullPath) do
      {:ok, contents} ->
        LC.writeTimedLog(
          "[REST - success] Mock found at #{fullPath}, using mock user name #{mockUserName}."
        )

        {path, Jason.decode!(contents)}

      {:error, :enoent} ->
        if mockUserName === "_default" do
          LC.writeTimedLog(
            "[REST - error] No mock found at #{fullPath}, using mock user name #{mockUserName}, please add the file."
          )

          {path,
           %{
             "mockErrorCode" => 404,
             "mockDelay" => 300,
             "data" => nil,
             "errors" => ["Data not found"]
           }}
        else
          LC.writeTimedLog(
            "[REST - warning] No mock found at #{fullPath}, using mock user name '_default', please add the file."
          )

          readFile(path, "_default")
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
