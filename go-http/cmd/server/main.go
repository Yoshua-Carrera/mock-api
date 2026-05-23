package main

import (
	"log"
	"net/http"

	"github.com/Yoshua-Carrera/mock-api/go-http/internal/config"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph/resolvers"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/http/handlers"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/http/router"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/service"
)

func main() {
	orchestration := service.NewMockOrchestration()
	resolver := &resolvers.Resolver{
		Orchestration: orchestration,
	}
	restHandler := &handlers.RestHandler{
		Orchestration: orchestration,
	}
	c := config.InitializeConfig()
	c.LoadConfig()

	r := router.NewRouter(resolver, restHandler)

	log.Printf("[info] - Server starting on port %s", c.Port)
	log.Fatal(http.ListenAndServe(":"+c.Port, r))
}
