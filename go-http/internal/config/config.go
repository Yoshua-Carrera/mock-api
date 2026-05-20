package config

import "os"

type ServerConfig struct {
	defaultPort string
	Port        string
}

func InitializeConfig() *ServerConfig {
	return &ServerConfig{
		defaultPort: "8080",
	}
}

func (s *ServerConfig) LoadConfig() {
	port := os.Getenv("PORT")

	if port == "" {
		port = s.defaultPort
	}

	s.Port = port
}
