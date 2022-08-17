import { useBrowser } from "./playwright";

export default async (count: number) => useBrowser(
  async (page, count) => {
    await page.goto("https://ctftime.org/event/list/upcoming")

    const result: string[] = [];

    for (let idx = 0; idx < count; idx++) {
      const row = await page.$(`xpath=//html/body/div[3]/table/tbody/tr[${idx + 2}]`);
      result.push(await row.innerText());
    }

    console.log(result);

    return page.title();
  },
  count,
);
