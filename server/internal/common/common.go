package common

import (
	"errors"
	"io"
	"net/http"
)

func Construct_url(baseURL string, user_ip string) string {
	return baseURL + "/" + user_ip
}

func isRespValid(code int) bool {
	return code >= 200 && code <= 299
}

func MakeHttpCall(url string, client *http.Client) ([]byte, error) {
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
