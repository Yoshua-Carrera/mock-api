package router

import (
	"fmt"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph/resolvers"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/middleware"
	"github.com/vektah/gqlparser/v2/ast"
)

func NewRouter(resolver *resolvers.Resolver) http.Handler {
	mux := http.NewServeMux()
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

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// TODO: Write REST implementation
		fmt.Fprintln(w, "Hello, world")
	})

	mux.Handle("/gql", playground.Handler("GraphQL sandbox", "/graphql"))
	mux.Handle("/graphql", middleware.Logging(srv))

	return mux
}
