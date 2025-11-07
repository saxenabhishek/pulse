package ip

import (
	"strings"
	"testing"
)

func TestValidateBody_Success(t *testing.T) {
	body := []byte(`{
		"status": "success",
		"country": "US",
		"city": "NYC",
		"region": "NY",
		"regionName": "New York",
		"message": ""
	}`)

	res, err := validate_body(body)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if res == nil {
		t.Fatalf("expected non-nil response")
	}
	if res.RegionName != "New York" {
		t.Fatalf("RegionName = %q, want %q", res.RegionName, "New York")
	}
}

func TestValidateBody_InvalidJSON(t *testing.T) {
	body := []byte(`{`)

	_, err := validate_body(body)
	if err == nil {
		t.Fatalf("expected unmarshal error, got nil")
	}
}

func TestValidateBody_FailStatus(t *testing.T) {
	body := []byte(`{
		"status": "fail",
		"message": "invalid query"
	}`)

	_, err := validate_body(body)
	if err == nil {
		t.Fatalf("expected error for fail status, got nil")
	}
	if !strings.Contains(err.Error(), "IP location could not be determined because:invalid query") {
		t.Fatalf("unexpected error message: %v", err)
	}
}
