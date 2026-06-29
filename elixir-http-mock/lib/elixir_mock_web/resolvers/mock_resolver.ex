defmodule ElixirMockWeb.Resolvers.MockResolver do
  alias ElixirMockWeb.FileReaderController, as: FR

  @spec hello(any(), map(), Absinthe.Resolution.t()) ::
          {:ok, map()} | {:error, map()}
  def hello(_parent, _args, %Absinthe.Resolution{} = resolution) do
    conn = resolution.context.conn
    IO.inspect(conn.req_headers, label: "headers")
    IO.inspect(resolution.definition.name, label: "Operation Name")
    IO.inspect(resolution.parent_type.identifier, label: "Operation Type")

    {:ok,
     %{
       data: "hello world!",
       operation_type: resolution.parent_type.identifier,
       operation_name: resolution.definition.name
     }}
  end
end
