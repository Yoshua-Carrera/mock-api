import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :elixir_mock, ElixirMockWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "bwrBOxqb3eKGYF/gvIF5QXXL7cZjE9OtSZu0cmmVG+Us7yj0N1FWiyw2tc/iaGoi",
  server: false

# In test we don't send emails
config :elixir_mock, ElixirMock.Mailer, adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

# Sort query params output of verified routes for robust url comparisons
config :phoenix,
  sort_verified_routes_query_params: true
