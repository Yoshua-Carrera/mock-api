defmodule ElixirMockWeb.MockController do
  use ElixirMockWeb, :controller

  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(%Plug.Conn{} = conn, %{} = _params) do
    json(conn, %{status: "ok"})
  end
end
