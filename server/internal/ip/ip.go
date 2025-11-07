package ip

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Status	string	`json:"status"`
	Country	string	`json:"country"`
	City 	string	`json:"city"`
	Region 	string	`json:"region"`
	RegionName 	string	`json:"regionName"`
	Message	string 	`json:"message"`
}

func construct_url(baseURL string, user_ip string) string{
	return baseURL + "/" + user_ip
}

func isRespValid(code int) bool {
	return code >= 200 && code <= 299
}

func getRegion(url string, client *http.Client) (string, error) {
	resp, err := client.Get(url)
	if err != nil{
		return "", errors.New("can not perform get err:" + err.Error())
	}
	defer resp.Body.Close()

	if !isRespValid(resp.StatusCode){
		return "",errors.New("got a non standard response code:" + resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", errors.New("could not read body:" + err.Error())
	}

	var responseObject Response
    err = json.Unmarshal(body, &responseObject)
	if err != nil {
		return  "", err
	}

	// split this later
	if responseObject.Status == "fail"{
		return "", errors.New("IP location could not be determined because:" + responseObject.Message )
	}

	return  responseObject.RegionName, nil

}

func GetRegionFromContext(c *gin.Context, baseURL string) (string, error){
	ip := c.RemoteIP()
	return getRegion(construct_url(baseURL, ip), http.DefaultClient)

}