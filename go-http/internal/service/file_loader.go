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
	mockOrchestration []GenericMockInternal
}

type FileLoader struct{}

func (f *FileLoader) ExtractHeaders(c *graphql.OperationContext) string {
	mockUserName := c.Headers.Get("mockUserName")
	if mockUserName == "" {
		mockUserName = "_default"
	}
	return mockUserName
}

func (f *FileLoader) handleLoadFileError(err error, c *graphql.OperationContext, mockUserName string) (GenericMockInternal, error) {
	if mockUserName == "_default" {
		log.Printf("[error - gql] mock not found, please add a a mock username under './mock/%s/%s/%s.json'.\n", c.Operation.Operation, c.OperationName, mockUserName)
		return GenericMockInternal{}, err
	} else {
		log.Printf("[warning - gql] %s not found, please add a a mock username under './mock/%s/%s/%s.json', attempting to use _default username instead.\n", mockUserName, c.Operation.Operation, c.OperationName, mockUserName)
		return f.LoadFile(c, "_default")
	}
}

func (f *FileLoader) LoadFile(c *graphql.OperationContext, mockUserName string) (GenericMockInternal, error) {
	data, err := os.ReadFile(fmt.Sprintf("./mock/%s/%s/%s.json", c.Operation.Operation, c.OperationName, mockUserName))
	if err != nil {
		return f.handleLoadFileError(err, c, mockUserName)
	}

	var result GenericMockInternal
	if err := json.Unmarshal(data, &result); err != nil {
		return GenericMockInternal{}, err
	}

	return result, nil
}
