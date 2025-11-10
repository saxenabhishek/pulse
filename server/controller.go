package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/saxenabhishek/pulse/server/internal/ip"
	"github.com/saxenabhishek/pulse/server/internal/news"
)

func pong(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "pong"})
}

func createGetIPdetail(config envConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		rg, err := ip.GetRegionFromContext(c)
		if err != nil {
			rg = ""
		}
		content, err := news.GetContentCached(rg, config.API_KEY)
		if err != nil {
			c.Error(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		c.JSON(http.StatusOK, content)
	}
}
