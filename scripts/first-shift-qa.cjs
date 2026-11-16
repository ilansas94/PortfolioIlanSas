const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const url = process.env.BASE_URL || "http://127.0.0.1:3000";
const output = path.resolve("first-shift-qa");
fs.mkdirSync(output, { recursive: true });

async function checkOverflow(page, label) {
  const sizes = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  assert.ok(sizes.document <= sizes.viewport + 4, label + ": horizontal overflow");
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const errors = [];
  try {
    for (const preset of [
      { name: "iphone", width: 390, height: 844 },
      { name: "desktop", width: 1440, height: 900 }
    ]) {
      const page = await browser.newPage({ viewport: { width: preset.width, height: preset.height }, deviceScaleFactor: 1 });
      page.on("pageerror", error => errors.push(preset.name + ": " + error.message));
      const main = await page.goto(url, { waitUntil: "networkidle" });
      assert.equal(main.status(), 200, "Homepage must load");
      const firstShiftCard = page.getByRole("button", { name: "Open FIRST SHIFT" });
      assert.equal(await firstShiftCard.count(), 1, "FIRST SHIFT must appear exactly once in gallery");
      assert.equal(await page.getByRole("button", { name: "Open Safe Moments" }).count(), 1, "Safe Moments must stay visible");
      await firstShiftCard.scrollIntoViewIfNeeded();
      const cover = firstShiftCard.locator("img");
      await cover.waitFor({ state: "visible" });
      await page.waitForTimeout(500);
      assert.ok(await cover.evaluate(img => img.complete && img.naturalWidth > 0), "Artwork cover must load");
      await firstShiftCard.screenshot({ path: path.join(output, preset.name + "-portfolio-card.png") });

      await firstShiftCard.click();
      const modal = page.getByRole("dialog", { name: "FIRST SHIFT" });
      await modal.waitFor({ state: "visible" });
      assert.ok((await modal.innerText()).includes("Animated corridor"), "Modal includes authentic highlights");
      const link = modal.locator('a[href="/first-shift"]');
      assert.equal(await link.count(), 1, "Modal links to FIRST SHIFT experience");
      await modal.screenshot({ path: path.join(output, preset.name + "-portfolio-modal.png") });

      const work = await page.goto(url + "/first-shift", { waitUntil: "networkidle" });
      assert.equal(work.status(), 200, "Full FIRST SHIFT experience must load at its short URL");
      assert.ok((await page.title()).includes("FIRST SHIFT"), "Document title should match the source");
      await page.locator(".fs-cover").waitFor({ state: "visible" });
      await page.waitForTimeout(2500);
      assert.equal(await page.locator(".fs-cover").getAttribute("data-ready"), "true", "Original illustration is ready");
      assert.equal(await page.locator(".fs-beacon").count(), 5, "Original orange route's five beacons are present");
      await checkOverflow(page, preset.name + " hero");
      await page.screenshot({ path: path.join(output, preset.name + "-interactive-hero.png"), fullPage: true });
      const kitTrigger = page.locator(".fs-kit-invite");
      await kitTrigger.waitFor({ state: "visible" });
      assert.equal(await kitTrigger.locator("svg").count(), 2, "Kit action uses vector icons only");
      assert.equal(await kitTrigger.locator(".fs-kit-invite-arrow").count(), 1, "The action arrow is SVG");
      assert.ok(!(await kitTrigger.innerText()).includes("↗"), "No emoji-rendered arrow remains");
      await kitTrigger.screenshot({ path: path.join(output, preset.name + "-kit-button.png") });
      await kitTrigger.click();
      await page.locator("body.fs-kit-active").waitFor();
      await page.locator(".fs-kit-close").click();
      await page.locator("body:not(.fs-kit-active)").waitFor();



      await page.locator(".fs-hero .fs-action").click();
      await page.locator(".fs-map").waitFor({ state: "visible" });
      await page.locator(".fs-panel").waitFor({ state: "visible" });
      await checkOverflow(page, preset.name + " journey");
      await page.screenshot({ path: path.join(output, preset.name + "-first-station.png"), fullPage: true });
      console.log("PASS", preset.name, "card/modal/exact source/route/interaction");
      await page.close();
    }
    assert.deepEqual(errors, [], "No uncaught browser errors");
    console.log("FIRST SHIFT QA PASSED");
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
