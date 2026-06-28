defmodule ElixirMockWeb.Schema do
  use Absinthe.Schema

  query do
    field :hello, :string do
      resolve(fn _, _, _ -> {:ok, "Hello world!"} end)
    end
  end
end
