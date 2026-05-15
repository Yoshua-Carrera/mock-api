package service

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/99designs/gqlgen/graphql"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph/model"
)

type FileLoader struct{}

func (f *FileLoader) ExtractHeaders(c *graphql.OperationContext) string {
	mockUserName := c.Headers.Get("mockUserName")
	if mockUserName == "" {
		mockUserName = "_default"
	}
	return mockUserName
}

func (f *FileLoader) handleLoadFileError(err error, c *graphql.OperationContext, mockUserName string) (model.GenericMock, error) {
	errorCode := int32(404)
	if mockUserName == "_default" {
		return model.GenericMock{
			MockStatusCode: &errorCode,
		}, err
	} else {
		log.Printf("[warning - gql] %s not found, please adda a mock username under './mock/%s/%s/%s.json', attempting to use _default username instead.\n", mockUserName, c.Operation.Operation, c.OperationName, mockUserName)
		return f.LoadFile(c, "_default")
	}
}

func (f *FileLoader) LoadFile(c *graphql.OperationContext, mockUserName string) (model.GenericMock, error) {
	data, err := os.ReadFile(fmt.Sprintf("./mock/%s/%s/%s.json", c.Operation.Operation, c.OperationName, mockUserName))
	if err != nil {
		return f.handleLoadFileError(err, c, mockUserName)
	}

	var result model.GenericMock
	if err := json.Unmarshal(data, &result); err != nil {
		errorCode := int32(404)
		return model.GenericMock{
			MockStatusCode: &errorCode,
		}, err
	}

	return result, nil
}
