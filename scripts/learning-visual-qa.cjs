const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const TARGET = process.env.LEARNING_URL || "http://127.0.0.1:3000/learning-lab";
const OUT = path.resolve("visual-qa/learning");
fs.mkdirSync(OUT, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const errors = [];
  try {
    for (const preset of [
      { name: "mobile", viewport: { width: 390, height: 844 }, scale: 2 },
      { name: "tablet", viewport: { width: 820, height: 1024 }, scale: 1 },
      { name: "desktop", viewport: { width: 1440, height: 900 }, scale: 1 }
    ]) {
      const page = await browser.newPage({ viewport: preset.viewport, deviceScaleFactor: preset.scale });
      page.on("pageerror", err => errors.push(preset.name + ": " + err.message));
      await page.goto(TARGET.replace(/learning-lab\/?$/, "") + "#portfolio", { waitUntil: "domcontentloaded" });
      const feature = page.locator('a[href="/learning-lab"]');
      await feature.waitFor();
      await feature.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await feature.screenshot({ path: path.join(OUT, preset.name + "-00-portfolio-feature.png") });
      await testOverflow(page, preset.name + " portfolio");
      const response = await page.goto(TARGET, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200, preset.name + ": status");
      await page.locator(".ml-hero").waitFor();
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(OUT, preset.name + "-01-intro.png"), fullPage: true });
      await testOverflow(page, preset.name + " intro");

      const hotspots = page.locator(".ml-orbit");
      assert.equal(await hotspots.count(), 5, "Five hotspot buttons should be visible");
      await hotspots.nth(0).focus();
      await page.keyboard.press("Enter");
      await page.locator(".ml-scene-tooltip").waitFor();
      await page.waitForTimeout(450);
      await page.screenshot({ path: path.join(OUT, preset.name + "-02-hotspot.png"), fullPage: true });
      await page.getByRole("button", { name: /ללמידה על הרגע/ }).click();

      await page.locator(".ml-learning-grid").waitFor();
      await page.waitForTimeout(650);
      await page.screenshot({ path: path.join(OUT, preset.name + "-03-learning.png"), fullPage: true });
      await testOverflow(page, preset.name + " learn");
      for (let i = 0; i < 5; i++) {
        await page.locator(".ml-moment-tab").nth(i).click();
        assert.equal(await page.locator(".ml-moment-tab[aria-pressed=true]").count(), 1);
      }
      await page.getByRole("button", { name: /מוכנים לתרגול/ }).click();

      await page.locator(".ml-quiz-card").waitFor();
      await page.waitForTimeout(650);
      await page.screenshot({ path: path.join(OUT, preset.name + "-04-quiz.png"), fullPage: true });
      await testOverflow(page, preset.name + " quiz");
      for (let i = 0; i < 5; i++) {
        assert.equal(await page.locator(".ml-answer").count(), 5, "Five answer choices per scenario");
        await page.locator(".ml-answer").nth(i % 5).click();
        await page.locator(".ml-feedback").waitFor();
        const disabled = await page.locator(".ml-answer:disabled").count();
        assert.equal(disabled, 5, "Answers lock when one is chosen");
        if (i === 0) {
          await page.waitForTimeout(650);
          await page.screenshot({ path: path.join(OUT, preset.name + "-05-feedback.png"), fullPage: true });
        }
        await page.getByRole("button", { name: i === 4 ? /לסיכום הלמידה/ : /לתרחיש הבא/ }).click();
      }
      await page.locator(".ml-finish-stage").waitFor();
      await page.waitForTimeout(650);
      await testOverflow(page, preset.name + " finish");
      await page.screenshot({ path: path.join(OUT, preset.name + "-06-finish.png"), fullPage: true });

      await page.getByRole("button", { name: /לתרגל מחדש/ }).click();
      await page.locator(".ml-learning-grid").waitFor();
      await testOverflow(page, preset.name + " restart");
      console.log("PASS", preset.name, preset.viewport.width, "all stages, 5 decisions, restart & overflow");
      await page.close();
    }
    if (errors.length) {
      console.error("BROWSER ERRORS", errors);
      throw new Error("Unhandled browser errors: " + errors.length);
    }
    console.log("VISUAL QA PASSED: screenshots at", OUT);
  } finally {
    await browser.close();
  }
}

async function testOverflow(page, label) {
  const dims = await page.evaluate(() => ({
    pageWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    bodyWidth: document.body.scrollWidth
  }));
  console.log("LAYOUT", label, JSON.stringify(dims));
  assert.ok(dims.pageWidth <= dims.viewportWidth + 4, label + ": horizontal overflow detected");
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
