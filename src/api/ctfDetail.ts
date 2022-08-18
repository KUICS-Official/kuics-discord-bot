import fetch from "node-fetch";
import { CtfDuration, CtfInfoDetail } from "../dto/ctfInfoDetail";

export default async (requestId: string, ctfId: string) => {
  const targetUrl = `https://ctftime.org/api/v1/events/${ctfId}/`
  console.debug(`${requestId}:request:${targetUrl}`);
  const response = await fetch(targetUrl, {
    headers: {
      "User-Agent": "curl/7.68.0",
    },
  });
  const resp = await response.json();
  console.debug(`${requestId}:response:${resp}`);

  const duration = resp["duration"];
  return new CtfInfoDetail(
    resp["title"],
    new Date(resp["start"]),
    new Date(resp["finish"]),
    resp["format"],
    resp["weight"],
    resp["ctftime_url"],
    resp["url"],
    resp["description"],
    resp["logo"],
    new CtfDuration(
      duration["days"],
      duration["hours"],
    )
  );
}
