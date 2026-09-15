import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { writeFileSync } from "node:fs";

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function shot(page, url, path, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(url, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);
  await page.screenshot({ path, type: "png", omitBackground: false });
}

try {
  const page = await browser.newPage();
  const cardUrl = pathToFileURL("/workspace/.grok/og-card.html").href;
  const favUrl = pathToFileURL("/workspace/.grok/favicon.svg.tmp").href;
  await shot(page, cardUrl, "/workspace/.grok/og-raw.png", 1200, 630);
  await shot(page, favUrl, "/workspace/.grok/favicon-32.png", 32, 32);
  await shot(page, favUrl, "/workspace/.grok/favicon-16.png", 16, 16);
  writeFileSync("/workspace/.grok/render-og.ok", "ok");
} finally {
  await browser.close();
}
