package service

import (
	"log"
)

type MockOrchestration struct {
	State map[string]int
}

func NewMockOrchestration() *MockOrchestration {
	return &MockOrchestration{
		State: make(map[string]int),
	}
}

func (o *MockOrchestration) cycleMock(p string, l int) int {
	if val, ok := o.State[p]; ok {
		if o.State[p] == l {
			log.Printf("[warning - gql] Path %s is at max orchestration index, it will be reset.\n", p)
			o.State[p] = 1
			return 0
		} else {
			o.State[p]++
			return val
		}
	} else {
		log.Printf("[warning - gql] Path %s is not present in state, it will be added.\n", p)
		o.State[p] = 1
		return 0
	}
}

func (o *MockOrchestration) HandleOrchestratedMock(m []GenericMockInternal, p string) GenericMockInternal {
	index := o.cycleMock(p, len(m))
	log.Printf("[info - gql] Path %s is currently at mock index: %d.\n", p, index)
	return m[index]
}
