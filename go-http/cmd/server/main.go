package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph/resolvers"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/middleware"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/service"
	"github.com/vektah/gqlparser/v2/ast"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = defaultPort
	}

	orchestration := service.NewMockOrchestration()
	resolver := &resolvers.Resolver{
		Orchestration: orchestration,
	}

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hello, world")
	})

	http.Handle("/gql", playground.Handler("GraphQL sandbox", "/graphql"))
	http.Handle("/graphql", middleware.Logging(srv))

	log.Printf("[info] - Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))

	http.ListenAndServe(":8080", nil)
}
