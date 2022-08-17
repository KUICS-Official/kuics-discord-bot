import { chromium, Page } from "playwright-chromium";

export const useBrowser = async <T extends any[], R> (process: (page: Page, ...rest: T) => R, ...rest: T) => {
  const browser = await chromium.launch({ chromiumSandbox: false });
  const page = await browser.newPage();

  const result = await process(page, ...rest);

  await browser.close();
  return result;
}
