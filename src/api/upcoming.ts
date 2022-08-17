import { useBrowser } from "./playwright";
import { CtfInfo } from "../dto/ctfInfo";

export default async (count: number) => useBrowser(
  async (page, count) => {
    await page.goto("https://ctftime.org/event/list/upcoming")

    const result: CtfInfo[] = [];

    for (let idx = 0; idx < count; idx++) {
      const nameElement = await page.$(`xpath=//html/body/div[3]/table/tbody/tr[${idx + 2}]/td[1]`);
      const dateRangeRawElement = await page.$(`xpath=//html/body/div[3]/table/tbody/tr[${idx + 2}]/td[2]`);
      const formatElement = await page.$(`xpath=//html/body/div[3]/table/tbody/tr[${idx + 2}]/td[3]`);
      const weightElement = await page.$(`xpath=//html/body/div[3]/table/tbody/tr[${idx + 2}]/td[5]`);

      const dateRangeSplitted = (await dateRangeRawElement.innerText()).split(' — ');

      result.push(
        new CtfInfo(
          await nameElement.innerText(),
          dateRangeSplitted[0],
          dateRangeSplitted[1],
          await formatElement.innerText(),
          parseFloat(await weightElement.innerText()),
        )
      );
    }

    return result;
  },
  count,
);
