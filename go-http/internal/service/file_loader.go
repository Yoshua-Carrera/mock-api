package service

import "fmt"

type FileLoader struct{}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

func (f *FileLoader) LoadFile(path string) (map[string]any, error) {
	return map[string]any{
		"message": fmt.Sprintf("[%s] - Hello, world", path),
	}, nil
}
