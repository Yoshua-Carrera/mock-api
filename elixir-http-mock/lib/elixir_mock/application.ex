defmodule ElixirMock.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start a worker by calling: ElixirMock.Worker.start_link(arg)
      # {ElixirMock.Worker, arg},
      # Start to serve requests, typically the last entry
      ElixirMockWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: ElixirMock.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    ElixirMockWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
