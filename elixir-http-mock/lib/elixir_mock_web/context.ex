defmodule ElixirMockWeb.Context do
  @behaviour Plug

  def init(opts) do
    opts
  end

  def call(conn, _) do
    Absinthe.Plug.put_options(
      conn,
      context: %{
        conn: conn
      }
    )
  end
end
