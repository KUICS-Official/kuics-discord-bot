package ctfapi

import (
	"strconv"
	"strings"

	"github.com/gocolly/colly/v2"
	"github.com/gocolly/colly/v2/extensions"
)

type CtfInfoSummary struct {
	Name       string
	Start      string
	Finish     string
	Weight     float32
	CtfTimeUrl string
}

func min(a, b int) int {
	if a < b {
		return a
	} else {
		return b
	}
}

func GetUpcomingByCount(count int) []CtfInfoSummary {
	c := colly.NewCollector(
		colly.AllowedDomains("ctftime.org"),
		// colly.Debugger(&debug.LogDebugger{}),
	)

	extensions.RandomUserAgent(c)

	var ctfInfos []CtfInfoSummary
	c.OnHTML("tr", func(e *colly.HTMLElement) {
		name := e.ChildText("td:nth-of-type(1)")

		if name != "Name" && name != "" {
			duration_string := e.ChildText("td:nth-of-type(2)")
			duration_slice := strings.Split(duration_string, " — ")
			start := duration_slice[0]
			finish := duration_slice[1]

			weight_string := e.ChildText("td:nth-of-type(5)")
			weight, _ := strconv.ParseFloat(weight_string, 32)

			uri := e.ChildAttr("td:nth-of-type(1) > a", "href")
			url := "https://ctftime.org" + uri

			ctfInfos = append(ctfInfos, CtfInfoSummary{
				Name:       name,
				Start:      start,
				Finish:     finish,
				Weight:     float32(weight),
				CtfTimeUrl: url,
			})
		}
	})

	c.Visit("https://ctftime.org/event/list/upcoming")
	c.Wait()

	return ctfInfos[0:min(len(ctfInfos), count)]
}
