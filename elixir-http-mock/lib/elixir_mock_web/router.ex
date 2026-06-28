defmodule ElixirMockWeb.Router do
  use ElixirMockWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  if Mix.env() == :dev do
    forward "/gql",
            Absinthe.Plug.GraphiQL,
            schema: ElixirMockWeb.Schema,
            interface: :simple
  end

  forward("/graphql", Absinthe.Plug, schema: ElixirMockWeb.Schema)

  scope "/", ElixirMockWeb do
    pipe_through :api
    get "/*path", MockController, :index
    post "/*path", MockController, :index
    patch "/*path", MockController, :index
    delete "/*path", MockController, :index
  end
end
