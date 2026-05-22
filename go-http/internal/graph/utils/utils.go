package graph_utils

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph/resolvers"
	"github.com/vektah/gqlparser/v2/ast"
)

func BootstrapGraphqlServer(resolver *resolvers.Resolver) *handler.Server {
	srv := handler.New(
		graph.NewExecutableSchema(
			graph.Config{
				Resolvers: resolver,
			},
		),
	)
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.POST{})
	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))
	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})
	return srv
}
