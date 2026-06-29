defmodule ElixirMockWeb.Schema do
  use Absinthe.Schema
  alias ElixirMockWeb.Resolvers.MockResolver, as: MC

  object :hello_response do
    field(:data, :string)
    field(:operation_type, :string)
    field(:operation_name, :string)
  end

  query do
    field :hello, :hello_response do
      resolve(fn parent, args, resolution -> MC.hello(parent, args, resolution) end)
    end
  end
end
