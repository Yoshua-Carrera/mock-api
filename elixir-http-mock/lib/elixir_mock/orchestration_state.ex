defmodule ElixirMock.OrchestrationState do
  use Agent

  def start_link(_opts) do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def get_state do
    Agent.get(__MODULE__, & &1)
  end

  def update_state(key, capacity) do
    Agent.get_and_update(__MODULE__, fn state ->
      next =
        state
        |> Map.get(key, -1)
        |> Kernel.+(1)
        |> then(fn v -> if v >= capacity, do: 0, else: v end)

      {next, Map.put(state, key, next)}
    end)
  end

  def debug_state do
    Agent.get(__MODULE__, & &1)
    |> IO.inspect(label: "Orchestration State")
  end
end
