package ctfapi

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

type CtfInfo struct {
	title       string
	description string
}

func GetUpcomingByCount(count int) []CtfInfo {
	query := fmt.Sprintf("limit=%d*start=%d&end=%d", count, 0, time.Now().Unix())
	resp, err := http.Get("https://ctftime.org/api/v1/events/?" + query)
	if err != nil {
		log.Fatalf("failed to get upcoming events: %v", err)
		return []CtfInfo{}
	}

	defer resp.Body.Close()

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("failed to read response body: %v", err)
		return []CtfInfo{}
	}

	var ctfInfo []CtfInfo
	err = json.Unmarshal(data, &ctfInfo)
	if err != nil {
		log.Fatalf("failed to unmarshal response: %v", err)
		return []CtfInfo{}
	}

	return ctfInfo
}
