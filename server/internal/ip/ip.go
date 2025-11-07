package ip

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Status     string `json:"status"`
	Country    string `json:"country"`
	City       string `json:"city"`
	Region     string `json:"region"`
	RegionName string `json:"regionName"`
	Message    string `json:"message"`
}

func construct_url(baseURL string, user_ip string) string {
	return baseURL + "/" + user_ip
}

func isRespValid(code int) bool {
	return code >= 200 && code <= 299
}

func makeHttpCall(url string, client *http.Client) ([]byte, error) {
	resp, err := client.Get(url)
	if err != nil {
		return nil, errors.New("can not perform get err:" + err.Error())
	}
	defer resp.Body.Close()

	if !isRespValid(resp.StatusCode) {
		return nil, errors.New("got a non standard response code:" + resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.New("could not read body:" + err.Error())
	}

	return body, nil
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
	body, err := makeHttpCall(construct_url(baseURL, ip), http.DefaultClient)
	if err != nil {
		return "", err
	}
	res, err := validate_body(body)
	if err != nil {
		return "", err
	}
	return res.RegionName, nil

}
