defmodule ElixirMockWeb.Schema do
  use Absinthe.Schema
  alias ElixirMockWeb.Resolvers.MockResolver, as: MC

  scalar :json do
    serialize(& &1)
    parse(fn value -> {:ok, value.value} end)
  end

  object :mock_error do
    field(:message, :string)
    field(:code, :integer)
    field(:field, :string)
  end

  object :mock_response do
    field(:data, :json)
    field(:error, list_of(:json))
  end

  query do
    field :query_mock, :mock_response do
      resolve(fn parent, args, resolution -> MC.mock(parent, args, resolution) end)
    end
  end

  mutation do
    field :mutate_mock, :mock_response do
      resolve(fn parent, args, resolution -> MC.mock(parent, args, resolution) end)
    end
  end
end
