package ip

import (
	"encoding/json"
	"errors"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/saxenabhishek/pulse/server/internal/common"
)

var regionCache sync.Map

type Response struct {
	Status     string `json:"status"`
	Country    string `json:"country"`
	City       string `json:"city"`
	Region     string `json:"region"`
	RegionName string `json:"regionName"`
	Message    string `json:"message"`
}

func validate_body(body []byte) (*Response, error) {
	var responseObject *Response = &Response{}
	err := json.Unmarshal(body, responseObject)
	if err != nil {
		return responseObject, err
	}
	if responseObject.Status == "fail" {
		return responseObject, errors.New("IP location could not be determined because:" + responseObject.Message)
	}

	return responseObject, nil
}

func GetRegionFromContext(c *gin.Context, baseURL string) (string, error) {
	ip := c.ClientIP()
	if v, ok := regionCache.Load(ip); ok {
		return v.(string), nil
	}
	body, err := common.MakeHttpCall(common.Construct_url(baseURL, ip), http.DefaultClient)
	if err != nil {
		return "", err
	}
	res, err := validate_body(body)
	if err != nil {
		return "", err
	}
	regionCache.Store(ip, res.RegionName)
	return res.RegionName, nil
}
