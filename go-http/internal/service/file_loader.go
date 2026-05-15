package service

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/99designs/gqlgen/graphql"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph/model"
)

type FileLoader struct{}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

func (f *FileLoader) LoadFile(path string, c *graphql.OperationContext) (model.GenericMock, error) {
	mockUserName := c.Headers.Get("mockUserName")
	if mockUserName == "" {
		mockUserName = "_default"
	}
	data, err := os.ReadFile(fmt.Sprintf("./mock/%s/%s/%s.json", c.Operation.Operation, c.OperationName, mockUserName))
	if err != nil {
		errorCode := int32(404)
		return model.GenericMock{
			MockStatusCode: &errorCode,
		}, err
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
