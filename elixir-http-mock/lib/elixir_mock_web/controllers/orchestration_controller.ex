defmodule ElixirMockWeb.OrchestrationController do
  alias ElixirMock.OrchestrationState, as: OS

  @spec handleOrchestration(term()) :: term()
  def handleOrchestration(f) do
    IO.puts("handleOrchestration")
    f
  end
end
