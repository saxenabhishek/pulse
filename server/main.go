package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func pong(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "pong"})
}


func main() {
	l := log.Default()
	r := gin.Default()
	l.Printf("Started Pulse Server")
	r.GET("/ping", pong)
	r.Run()
}