package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/saxenabhishek/pulse/server/internal/ip"
	"github.com/saxenabhishek/pulse/server/internal/news"
)

func pong(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "pong"})
}

func getIPdetail(c *gin.Context) {
	rg, err := ip.GetRegionFromContext(c)
	if err != nil {
		rg = ""
	}
	content, err := news.GetContentCached(rg)
	if err != nil {
		c.Error(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, content)
}

func main() {
	gin.SetMode(gin.DebugMode)
	l := log.Default()
	r := gin.Default()
	cors_config := cors.DefaultConfig()
	cors_config.AllowOrigins = []string{"http://localhost:5500", "https://saxenabhishek.me"}
	// config.AllowAllOrigins = true
	r.Use(cors.New(cors_config))
	r.TrustedPlatform = gin.PlatformGoogleAppEngine

	PORT, ok := os.LookupEnv("PORT")
	if !ok {
		PORT = "8080"
	}

	l.Printf("Started Pulse Server")
	r.GET("/ping", pong)
	r.GET("/content", getIPdetail)
	r.Run(":" + PORT)
}
