package service

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

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

func (f *FileLoader) ExtractHeaders(h http.Header) string {
	mockUserName := h.Get("mockUserName")
	if mockUserName == "" {
		mockUserName = "_default"
	}
	return mockUserName
}

func (f *FileLoader) handleLoadFileError(err error, path string, mockUserName string, filePath string) (GenericMockInternal, string, error) {
	if mockUserName == "_default" {
		log.Printf("[error - gql] mock not found, please add a a mock username under '%s'.\n", filePath)
		return GenericMockInternal{}, filePath, err
	} else {
		log.Printf("[warning - gql] %s not found, please add a a mock username under '%s', attempting to use _default username instead.\n", mockUserName, filePath)
		return f.LoadFile(path, "_default")
	}
}

func (f *FileLoader) LoadFile(path string, mockUserName string) (GenericMockInternal, string, error) {
	filePath := fmt.Sprintf("./mock/%s/%s.json", path, mockUserName)
	data, err := os.ReadFile(filePath)
	if err != nil {
		return f.handleLoadFileError(err, path, mockUserName, filePath)
	}

	var result GenericMockInternal
	if err := json.Unmarshal(data, &result); err != nil {
		return GenericMockInternal{}, path, err
	}

	return result, path, nil
}
