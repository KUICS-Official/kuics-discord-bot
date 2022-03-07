package ctfapi_test

import (
	"testing"

	"kuics.ac.kr/discordbot/internal/ctfapi"
)

func TestGetUpcomingByCount(t *testing.T) {
	ctfinfos := ctfapi.GetUpcomingByCount(3)
	t.Log(ctfinfos)
}
