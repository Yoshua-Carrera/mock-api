package service

import (
	"encoding/json"
	"os"

	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph/model"
)

type FileLoader struct{}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

func (f *FileLoader) LoadFile(path string) (model.GenericMock, error) {
	data, err := os.ReadFile("./mock/query/_default.json")
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
