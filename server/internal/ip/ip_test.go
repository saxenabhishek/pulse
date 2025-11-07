package ip

import (
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestGetRegion(t *testing.T) {
	t.Run("success returns region name", func(t *testing.T) {
		ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			io.WriteString(w, `{
				"status":"success",
				"country":"US",
				"city":"New York",
				"region":"NY",
				"regionName":"New York"
			}`)
		}))
		defer ts.Close()

		region, err := getRegion(ts.URL, http.DefaultClient)
		if err != nil {
			t.Fatalf("getRegion returned error: %v", err)
		}
		if region != "New York" {
			t.Fatalf("expected region %q, got %q", "New York", region)
		}
	})

	t.Run("http get error bubbles up", func(t *testing.T) {
		ts := httptest.NewServer(http.NotFoundHandler())
		ts.Close() // close server to simulate http error

		region, err := getRegion(ts.URL, http.DefaultClient)
		if err == nil {
			t.Fatalf("expected error, got none (region=%q)", region)
		}
		if !strings.Contains(err.Error(), "can not perform get") {
			t.Fatalf("expected wrapped get error, got: %v", err)
		}
	})

	t.Run("invalid JSON", func(t *testing.T) {
		ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			io.WriteString(w, `{`) // invalid JSON -> Unmarshal would error
		}))
		defer ts.Close()

		_, err := getRegion(ts.URL, http.DefaultClient)
		if err == nil {
			t.Fatalf("expected unmarshal error but got none")
		}
	})
}