const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const projects = [
  "Company Redesign",
  "HAKAMERI Brochure",
  "Digital Painting",
  "Gesture Poster",
  "Keren Nails",
  "Graphic Course",
  "PASSPORTOGO",
  "Sketchbook",
  "SPACE",
  "THE GRIND",
  "Twitchy Rabbit",
];

const viewports = [
  { name: "desktop", width: 1600, height: 900 },
  { name: "mobile", width: 450, height: 800 },
];

const root = path.resolve("artifacts/cinematic-recut");
const diagnostics = [];

async function settle(page, delay = 800) {
  await page.waitForTimeout(delay);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function capture(page, viewport, file) {
  const directory = path.join(root, viewport);
  fs.mkdirSync(directory, { recursive: true });
  await page.screenshot({
    path: path.join(directory, file),
    fullPage: false,
    animations: "disabled",
  });
}

async function seekVideo(page, selector, time) {
  await page.locator(selector).evaluate(async (video, target) => {
    video.pause();
    if (video.readyState < 1) {
      await Promise.race([
        new Promise((resolve) => video.addEventListener("loadedmetadata", resolve, { once: true })),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);
    }
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    video.currentTime = target === "end" ? Math.max(0, duration - 0.08) : Number(target);
    await Promise.race([
      new Promise((resolve) => video.addEventListener("seeked", resolve, { once: true })),
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]);
    video.pause();
  }, time);
}

async function captureViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const errors = [];

  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });

  await page.goto("http://127.0.0.1:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.locator('section[aria-label="Portfolio opening"]').waitFor({ state: "visible", timeout: 10000 });
  await settle(page, 900);

  await seekVideo(page, 'section[aria-label="Portfolio opening"] video', 0);
  await capture(page, viewport.name, "00-opening-start.png");

  await seekVideo(page, 'section[aria-label="Portfolio opening"] video', "end");
  await page.getByRole("button", { name: "Enter experience" }).click();
  await settle(page, 700);
  await capture(page, viewport.name, "01-opening-ready.png");

  await page.getByRole("button", { name: "About", exact: true }).last().click();
  await settle(page, 4400);
  await capture(page, viewport.name, "02-about.png");

  await page.getByRole("button", { name: "Work", exact: true }).last().click();
  await settle(page, 6100);
  await capture(page, viewport.name, "03-work-01-company-redesign.png");

  await page.getByRole("button", { name: "Open Company Redesign" }).click();
  await settle(page, 6100);
  await page.locator('article[aria-label="Company Redesign case study"]').waitFor({ state: "visible", timeout: 8000 });
  await capture(page, viewport.name, "04-case-company-redesign.png");

  await page.getByRole("button", { name: "Back to the film" }).click();
  await settle(page, 6100);

  for (let index = 1; index < projects.length; index += 1) {
    await page.getByRole("button", { name: "Next project" }).click();
    await settle(page, 4700);
    await capture(page, viewport.name, `work-${String(index + 1).padStart(2, "0")}-${projects[index].toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`);
  }

  await page.getByRole("button", { name: "Next project" }).click();
  await settle(page, 4500);
  await capture(page, viewport.name, "99-contact.png");

  diagnostics.push({ viewport: viewport.name, errors });
  await context.close();
}

(async () => {
  fs.rmSync(root, { recursive: true, force: true });
  fs.mkdirSync(root, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) {
      console.log(`Capturing cinematic recut: ${viewport.name}`);
      await captureViewport(browser, viewport);
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(root, "diagnostics.json"), JSON.stringify(diagnostics, null, 2));
  console.log("Cinematic recut capture complete");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
