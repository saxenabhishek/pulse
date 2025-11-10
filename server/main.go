package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type envConfig struct {
	PORT    string
	API_KEY string
}

func getEnvVars() envConfig {
	API_KEY, ok := os.LookupEnv("API_KEY")
	if !ok {
		log.Fatal("api key not found in env, use `API_KEY`")
	}
	PORT, ok := os.LookupEnv("PORT")
	if !ok {
		PORT = "8080"
	}
	return envConfig{PORT: PORT, API_KEY: API_KEY}
}

func main() {
	gin.SetMode(gin.DebugMode)
	l := log.Default()
	r := gin.Default()
	cors_config := cors.DefaultConfig()
	cors_config.AllowOrigins = []string{"http://localhost:5500", "https://saxenabhishek.me"}
	r.Use(cors.New(cors_config))
	r.TrustedPlatform = gin.PlatformGoogleAppEngine

	envConfigObj := getEnvVars()

	l.Printf("Started Pulse Server")
	r.GET("/ping", pong)
	r.GET("/content", createGetIPdetail(envConfigObj))
	r.Run("0.0.0.0:" + envConfigObj.PORT)
}
