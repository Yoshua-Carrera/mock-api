defmodule ElixirMockWeb.OrchestrationController do
  alias ElixirMock.OrchestrationState, as: OS

  @spec handleOrchestration(term(), String.t()) :: term()
  def handleOrchestration(f, path) do
    mockOrchestration = f |> Map.get("mockOrchestration")
    mockCapacity = mockOrchestration |> length()
    index = OS.update_state(path, mockCapacity)

    IO.inspect(index, label: "test")

    mockOrchestration |> Enum.at(index)
  end
end
