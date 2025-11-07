package news

import (
	"encoding/json"
	"net/http"
	"strings"
	"testing"
)

func TestGetContent_UsesStubbedHttpCall(t *testing.T) {
	origHTTPCall := httpcall
	defer func() { httpcall = origHTTPCall }()

	httpcall = func(url string, client *http.Client) ([]byte, error) {
		resp := APIResponse{
			Response: res{Status: "ok"},
		}
		b, _ := json.Marshal(resp)
		return b, nil
	}
	got, err := GetContent("us")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got == nil || got.Status != "ok" || got.Region != "us" {
		t.Fatalf("unexpected result: %#v", got)
	}
}

func TestValidateBody_OK(t *testing.T) {
	body := []byte(`{"response":{"status":"ok"}}`)
	got, err := validateBody(body)
	if err != nil {
		t.Fatal(err)
	}
	if got.Status != "ok" {
		t.Fatalf("got %q", got.Status)
	}
}

func TestValidateBody_notOK(t *testing.T) {
	body := []byte(`{"response":{"status":"error"}}`)
	_, err := validateBody(body)
	if err == nil {
		t.Fatal(err)
	}
}

func TestConstructQuery_WithRegion(t *testing.T) {
	raw := constructQuery("us")
	if !strings.Contains(raw, "q=us") {
		t.Errorf("expected q param")
	}
}

func TestConstructQuery_WithoutRegion(t *testing.T) {
	raw := constructQuery("")
	if strings.Contains(raw, "q=") {
		t.Errorf("unexpected q param")
	}
}
