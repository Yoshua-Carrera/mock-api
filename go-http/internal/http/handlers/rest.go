package handlers

import (
	"fmt"
	"net/http"
)

func HandleMockRequest(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, world")
}
