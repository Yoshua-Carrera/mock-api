package router

import (
	"net/http"

	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph/resolvers"
	graphUtils "github.com/Yoshua-Carrera/mock-api/go-http/internal/graph/utils"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/http/handlers"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/middleware"
)

func NewRouter(resolver *resolvers.Resolver) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/", handlers.HandleMockRequest)
	mux.Handle("/gql", playground.Handler("GraphQL sandbox", "/graphql"))
	mux.Handle("/graphql", middleware.Logging(graphUtils.BootstrapGraphqlServer(resolver)))

	return mux
}
