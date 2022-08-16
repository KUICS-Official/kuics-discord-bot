import { useBrowser } from "./playwright";

export default async () => useBrowser(async (page) => {
  await page.goto("https://ctftime.org")
  return page.title();
});
