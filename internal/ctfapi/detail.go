package ctfapi

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

type CtfDuration struct {
	Days  int
	Hours int
}

type CtfInfoDetail struct {
	Summary     CtfInfoSummary
	Description string
	Url         string
	Format      string
	Duration    CtfDuration
	Logo        string
}

var client = &http.Client{}

func GetDetailById(id string) CtfInfoDetail {
	log.Printf("GetDetailById: %s", id)
	req, _ := http.NewRequest("GET", "https://ctftime.org/api/v1/events/"+id+"/", nil)
	req.Header.Add("User-Agent", "curl/7.68.0")

	resp, err := client.Do(req)
	if err != nil {
		log.Fatalf("GetDetailById: %v", err)
		return CtfInfoDetail{}
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	var ctfInfoRaw map[string]interface{}
	json.Unmarshal(body, &ctfInfoRaw)

	durationRaw := ctfInfoRaw["duration"].(map[string]interface{})
	days := int(durationRaw["days"].(float64))
	hours := int(durationRaw["hours"].(float64))

	return CtfInfoDetail{
		Summary: CtfInfoSummary{
			Name:       ctfInfoRaw["title"].(string),
			Start:      ctfInfoRaw["start"].(string),
			Finish:     ctfInfoRaw["finish"].(string),
			Weight:     float32(ctfInfoRaw["weight"].(float64)),
			CtfTimeUrl: ctfInfoRaw["ctftime_url"].(string),
		},
		Description: ctfInfoRaw["description"].(string),
		Url:         ctfInfoRaw["url"].(string),
		Format:      ctfInfoRaw["format"].(string),
		Duration:    CtfDuration{Days: days, Hours: hours},
		Logo:        ctfInfoRaw["logo"].(string),
	}
}
