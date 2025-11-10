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

var httpcall = common.MakeHttpCall
var showFields = []string{"standfirst", "wordcount", "byline", "trailText"}
var c = cache.New(15*time.Minute, 20*time.Minute)

type typeData struct {
	AltText   string `json:"altText"`
	Credit    string `json:"credit"`
	Copyright string `json:"copyright"`
}

type Asset struct {
	Type     string   `json:"type"`
	File     string   `json:"file"`
	TypeData typeData `json:"typeData"`
}

type element struct {
	Relation string  `json:"relation"`
	Assets   []Asset `json:"assets"`
}

type fields struct {
	Standfirst string `json:"standfirst"`
	Byline     string `json:"byline"`
	Wordcount  string `json:"wordcount"`
	TrailText  string `json:"trailText"`
}

type results struct {
	Id                 string    `json:"id"`
	SectionName        string    `json:"sectionName"`
	SectionId          string    `json:"sectionId"`
	WebPublicationDate string    `json:"webPublicationDate"`
	WebTitle           string    `json:"webTitle"`
	WebUrl             string    `json:"webUrl"`
	Fields             fields    `json:"fields"`
	Elements           []element `json:"elements"`
}

type res struct {
	Status  string    `json:"status"`
	Results []results `json:"results"`
	Region  string
}

type APIResponse struct {
	Response res `json:"response"`
}

func validateBody(body []byte) (res, error) {
	var apiResp APIResponse
	err := json.Unmarshal(body, &apiResp)
	if err != nil {
		return res{}, err
	}
	if apiResp.Response.Status != "ok" {
		return res{}, errors.New("server responded with not ok status")
	}
	return apiResp.Response, nil
}

func constructShowFields() string {
	return strings.Join(showFields, ",")
}

func constructQuery(region string, api_key string) string {
	params := url.Values{}
	params.Set("api-key", api_key)
	params.Set("show-fields", constructShowFields())
	params.Set("show-elements", "image")

	if region != "" {
		params.Add("q", region)
	}

	queryString := params.Encode()
	return BASE_URL + "?" + queryString
}

func GetContent(region string, API_KEY string) (*res, error) {
	query := constructQuery(region, API_KEY)
	body, err := httpcall(query, http.DefaultClient)
	if err != nil {
		return nil, err
	}
	res, err := validateBody(body)
	if err != nil {
		return nil, err
	}
	res.Region = region
	return &res, nil
}

func GetContentCached(region string, API_KEY string) (*res, error) {
	if v, found := c.Get(region); found {
		if cached, ok := v.(*res); ok {
			return cached, nil
		}
	}

	r, err := GetContent(region, API_KEY)
	if err != nil {
		return nil, err
	}

	c.Set(region, r, cache.DefaultExpiration)
	return r, nil
}
