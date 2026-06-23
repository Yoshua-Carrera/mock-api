defmodule ElixirMockWeb.LoggingController do
  @spec writeTimedLog(String.t()) :: :ok
  def(writeTimedLog(log)) do
    IO.inspect(log,
      label: "#{DateTime.utc_now() |> Calendar.strftime("%Y-%m-%d %H:%M:%S")}"
    )
  end
end
