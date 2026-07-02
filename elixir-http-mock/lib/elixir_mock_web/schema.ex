defmodule ElixirMockWeb.Schema do
  use Absinthe.Schema
  alias ElixirMockWeb.Resolvers.MockResolver, as: MC

  scalar :json do
    serialize(& &1)
    parse(fn value -> {:ok, value.value} end)
  end

  query do
    field :query_mock, :json do
      resolve(fn parent, args, resolution -> MC.hello(parent, args, resolution) end)
    end
  end

  mutation do
    field :mutation_mock, :json do
      resolve(fn parent, args, resolution -> MC.hello(parent, args, resolution) end)
    end
  end
end
