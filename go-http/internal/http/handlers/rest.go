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

func HandleMockRequest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	f := service.FileLoader{}
	path := fmt.Sprintf("%s%s", r.Method, r.URL.Path)
	mockUserName := f.ExtractHeaders(r.Header)
	genericMockInternal, path, err := f.LoadFile(path, mockUserName)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(model.Error{
			Message: "mock not found",
			Code:    http.StatusNotFound,
		})
		return
	}
	w.WriteHeader(http.StatusOK)
	time.Sleep(time.Duration(genericMockInternal.MockDelay) * time.Millisecond)
	json.NewEncoder(w).Encode(genericMock{
		Data:  genericMockInternal.Data,
		Error: genericMockInternal.Error,
	})
}
