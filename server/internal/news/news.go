package news

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/patrickmn/go-cache"
	"github.com/saxenabhishek/pulse/server/internal/common"
)

const BASE_URL = "https://content.guardianapis.com/search"
const API_KEY = "test"

var c = cache.New(5*time.Minute, 10*time.Minute)

type fields struct {
	Standfirst string `json:"standfirst"`
	Byline     string `json:"byline"`
	Wordcount  string `json:"wordcount"`
}

type results struct {
	Id                 string `json:"id"`
	SectionName        string `json:"sectionName"`
	SectionId          string `json:"sectionId"`
	WebPublicationDate string `json:"webPublicationDate"`
	WebTitle           string `json:"webTitle"`
	WebUrl             string `json:"webUrl"`
	Fields             fields `json:"fields"`
}

type res struct {
	Status  string    `json:"status"`
	Results []results `json:"results"`
	Region  string
}

type Response struct {
	Response res `json:"response"`
}

func validate_body(body []byte) (*res, error) {
	var ResponseObj *Response = &Response{}
	err := json.Unmarshal(body, ResponseObj)
	if err != nil {
		return &ResponseObj.Response, err
	}
	if ResponseObj.Response.Status != "ok" {
		return &ResponseObj.Response, errors.New("server responded with not ok status")
	}
	return &ResponseObj.Response, nil
}

func constructShowFields() string {
	fields := []string{"standfirst", "wordcount", "byline"}
	return strings.Join(fields, ",")
}

func construct_query(region string) string {
	params := url.Values{}
	params.Set("api-key", API_KEY)
	params.Set("show-fields", constructShowFields())
	if region != "" {
		params.Add("q", region)
	}

	queryString := params.Encode()
	return BASE_URL + "?" + queryString
}

func GetContent(region string) (*res, error) {
	query := construct_query(region)
	body, err := common.MakeHttpCall(query, http.DefaultClient)
	if err != nil {
		return nil, err
	}
	res, err := validate_body(body)
	if err != nil {
		return nil, err
	}
	res.Region = region
	return res, nil
}

func GetContentCached(region string) (*res, error) {
	if v, found := c.Get(region); found {
		if cached, ok := v.(*res); ok {
			return cached, nil
		}
	}

	r, err := GetContent(region)
	if err != nil {
		return nil, err
	}

	c.Set(region, r, cache.DefaultExpiration)
	return r, nil
}
