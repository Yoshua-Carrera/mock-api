defmodule ElixirMockWeb.Router do
  use ElixirMockWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ElixirMockWeb do
    pipe_through :api
    get "/*path", MockController, :index
    post "/*path", MockController, :index
    patch "/*path", MockController, :index
    delete "/*path", MockController, :index
  end
end
