defmodule ElixirMockWeb.Resolvers.MockResolver do
  alias ElixirMockWeb.FileReaderController, as: FR

  @spec getHeader(Plug.Conn.t()) :: String.t()
  def getHeader(%Plug.Conn{} = conn) do
    case Plug.Conn.get_req_header(conn, "mockusername") do
      [header_val | _] -> header_val
      [] -> "_default"
    end
  end

  @spec hello(any(), map(), Absinthe.Resolution.t()) ::
          {:ok, map()} | {:error, map()}
  def hello(_parent, _args, %Absinthe.Resolution{} = resolution) do
    conn = resolution.context.conn

    mockUserName = getHeader(conn)

    operationType = conn.body_params["operationName"]

    {path, f} =
      FR.readFile(
        "#{resolution.parent_type.identifier}/#{operationType}",
        mockUserName
      )

    IO.inspect(f, label: "f")
    IO.inspect(path, label: "path")

    {:ok,
     %{
       data: "hello world!",
       operation_type: resolution.parent_type.identifier,
       operation_name: resolution.definition.name
     }}
  end
end
