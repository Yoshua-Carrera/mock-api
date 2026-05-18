package service

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/99designs/gqlgen/graphql"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph/model"
)

type GenericMockInternal struct {
	Data              map[string]any
	Error             []*model.Error
	MockDelay         int32
	MockErrorCode     int32
	MockOrchestration []GenericMockInternal
}

type FileLoader struct{}

func (f *FileLoader) ExtractHeaders(c *graphql.OperationContext) string {
	mockUserName := c.Headers.Get("mockUserName")
	if mockUserName == "" {
		mockUserName = "_default"
	}
	return mockUserName
}

func (f *FileLoader) handleLoadFileError(err error, c *graphql.OperationContext, mockUserName string, p string) (GenericMockInternal, string, error) {
	if mockUserName == "_default" {
		log.Printf("[error - gql] mock not found, please add a a mock username under '%s'.\n", p)
		return GenericMockInternal{}, p, err
	} else {
		log.Printf("[warning - gql] %s not found, please add a a mock username under '%s', attempting to use _default username instead.\n", mockUserName, p)
		return f.LoadFile(c, "_default")
	}
}

func (f *FileLoader) LoadFile(c *graphql.OperationContext, mockUserName string) (GenericMockInternal, string, error) {
	path := fmt.Sprintf("./mock/%s/%s/%s.json", c.Operation.Operation, c.OperationName, mockUserName)
	data, err := os.ReadFile(path)
	if err != nil {
		return f.handleLoadFileError(err, c, mockUserName, path)
	}

	var result GenericMockInternal
	if err := json.Unmarshal(data, &result); err != nil {
		return GenericMockInternal{}, path, err
	}

	return result, path, nil
}
