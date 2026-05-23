package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Yoshua-Carrera/mock-api/go-http/internal/graph/model"
	"github.com/Yoshua-Carrera/mock-api/go-http/internal/service"
)

type genericMock struct {
	Data  map[string]any `json:"data"`
	Error []*model.Error `json:"error,omitempty"`
}

type RestHandler struct {
	fileLoader    *service.FileLoader
	Orchestration *service.MockOrchestration
}

func (h *RestHandler) HandleMockRequest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	path := fmt.Sprintf("%s%s", r.Method, r.URL.Path)
	mockUserName := h.fileLoader.ExtractHeaders(r.Header)
	genericMockInternal, path, err := h.fileLoader.LoadFile(path, mockUserName)
	if len(genericMockInternal.MockOrchestration) > 0 {
		genericMockInternal = h.Orchestration.HandleOrchestratedMock(genericMockInternal.MockOrchestration, path)
	}
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(model.Error{
			Message: "mock not found",
			Code:    http.StatusNotFound,
		})
		return
	}
	statusCode := genericMockInternal.MockErrorCode
	if statusCode == 0 {
		statusCode = http.StatusOK
	}
	w.WriteHeader(int(statusCode))
	time.Sleep(time.Duration(genericMockInternal.MockDelay) * time.Millisecond)
	json.NewEncoder(w).Encode(genericMock{
		Data:  genericMockInternal.Data,
		Error: genericMockInternal.Error,
	})
}
