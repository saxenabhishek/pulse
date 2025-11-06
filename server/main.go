package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func pong(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "pong"})
}


func main() {
	l := log.Default()
	r := gin.Default()
	cors_config := cors.DefaultConfig()
	cors_config.AllowOrigins = []string{"http://localhost:5500", "https://saxenabhishek.me"}
	// config.AllowAllOrigins = true
	r.Use(cors.New(cors_config))
	l.Printf("Started Pulse Server")
	r.GET("/ping", pong)
	r.Run()
}