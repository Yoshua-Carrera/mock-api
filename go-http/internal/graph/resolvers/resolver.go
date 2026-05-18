package resolvers

import "github.com/Yoshua-Carrera/mock-api/go-http/internal/service"

//go:generate go tool gqlgen generate

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require
// here.

type Resolver struct {
	FileLoader    *service.FileLoader
	Orchestration *service.MockOrchestration
}
