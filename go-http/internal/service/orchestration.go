package service

type MockOrchestration struct {
	state map[string]int
}

func (o *MockOrchestration) CycleMock(path string) (int, error) {
	return 1, nil
}
