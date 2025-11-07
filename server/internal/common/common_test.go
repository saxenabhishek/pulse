package common

import (
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestConstructURL(t *testing.T) {
	baseURL := "A"
	ip := "B"

	got := Construct_url(baseURL, ip)
	want := "A/B"

	if got != want {
		t.Fatalf("construct_url(%q, %q) = %q, want %q", baseURL, ip, got, want)
	}
}

func TestIsRespValid(t *testing.T) {
	tests := []struct {
		code int
		want bool
	}{
		{199, false},
		{200, true},
		{250, true},
		{299, true},
		{300, false},
	}

	for _, tt := range tests {
		if got := isRespValid(tt.code); got != tt.want {
			t.Errorf("isRespValid(%d) = %v, want %v", tt.code, got, tt.want)
		}
	}
}

func TestMakeHttpCall_Success(t *testing.T) {
	expected := `{"status":"success","regionName":"TestRegion"}`

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = io.WriteString(w, expected)
	}))
	defer ts.Close()

	body, err := MakeHttpCall(ts.URL, ts.Client())
	if err != nil {
		t.Fatalf("makeHttpCall returned error: %v", err)
	}
	if string(body) != expected {
		t.Fatalf("body = %q, want %q", body, expected)
	}
}

func TestMakeHttpCall_Non2xx(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "nope", http.StatusBadRequest)
	}))
	defer ts.Close()

	_, err := MakeHttpCall(ts.URL, ts.Client())
	if err == nil {
		t.Fatalf("expected error for non-2xx status, got nil")
	}
	if !strings.Contains(err.Error(), "got a non standard response code:") {
		t.Fatalf("unexpected error message: %v", err)
	}
}
