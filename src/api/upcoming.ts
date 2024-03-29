import { useBrowser } from "./playwright";
import { CtfInfo } from "../dto/ctfInfo";
import { LoggingMeta } from "../log/loggingMeta";

export default async (requestId: string, count: number) => useBrowser(
  async (page, requestId, count) => {
    const targetUrl = "https://ctftime.org/event/list/upcoming";
    (new LoggingMeta(
      requestId,
      "request",
      targetUrl,
    )).log("debug");
    await page.goto(targetUrl);

    const result: CtfInfo[] = [];

    for (let idx = 0; idx < count; idx++) {
      const nameElement = await page.$(`xpath=//html/body/div[3]/table/tbody/tr[${idx + 2}]/td[1]/a`);
      const dateRangeRawElement = await page.$(`xpath=//html/body/div[3]/table/tbody/tr[${idx + 2}]/td[2]`);
      const formatElement = await page.$(`xpath=//html/body/div[3]/table/tbody/tr[${idx + 2}]/td[3]`);
      const weightElement = await page.$(`xpath=//html/body/div[3]/table/tbody/tr[${idx + 2}]/td[5]`);
      const targetUri = await nameElement.getAttribute("href");

      const dateRangeSplitted = (await dateRangeRawElement.innerText()).split(" — ");

      const ctfInfo = new CtfInfo(
        await nameElement.innerText(),
        dateRangeSplitted[0],
        dateRangeSplitted[1],
        await formatElement.innerText(),
        parseFloat(await weightElement.innerText()),
        `https://ctftime.org${targetUri}`,
      );
      (new LoggingMeta(
          requestId,
          "response",
          ctfInfo.toString(),
      )).log("debug");
      result.push(ctfInfo);
    }

    return result;
  },
  requestId,
  count,
);
