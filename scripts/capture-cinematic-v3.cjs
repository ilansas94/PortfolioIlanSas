const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const projects = [
  { id: 2, title: "Company Redesign", category: "Brand identity", transition: "print" },
  { id: 3, title: "HAKAMERI Brochure", category: "Editorial design", transition: "print" },
  { id: 5, title: "Digital Painting", category: "Digital art", transition: "ink" },
  { id: 6, title: "Gesture Poster", category: "Poster design", transition: "print" },
  { id: 8, title: "Keren Nails", category: "Logo design", transition: "ink" },
  { id: 9, title: "Graphic Course", category: "UI / UX", transition: "ui" },
  { id: 10, title: "PASSPORTOGO", category: "Brand identity", transition: "ui" },
  { id: 11, title: "Sketchbook", category: "Illustration", transition: "ink" },
  { id: 13, title: "SPACE", category: "Logo design", transition: "ui" },
  { id: 14, title: "THE GRIND", category: "Logo design", transition: "print" },
  { id: 15, title: "Twitchy Rabbit", category: "Character identity", transition: "ink" },
];

// These exact ratios map to Runway's uncropped desktop and mobile outputs.
const viewports = [
  { name: "desktop", width: 1600, height: 900 },
  { name: "mobile", width: 450, height: 800 },
];

const root = path.resolve("artifacts/cinematic-v3");
const manifest = [];
const diagnostics = [];

function safeName(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function capture(page, viewport, file) {
  const directory = path.join(root, viewport);
  fs.mkdirSync(directory, { recursive: true });
  const relative = `${viewport}/${file}`;
  await page.screenshot({
    path: path.join(root, relative),
    fullPage: false,
    animations: "disabled",
  });
  return relative;
}

async function settle(page, delay = 900) {
  await page.waitForTimeout(delay);
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function scrollTo(page, selector) {
  await page.locator(selector).evaluate((element) =>
    element.scrollIntoView({ block: "start", behavior: "auto" }),
  );
  await settle(page, 1000);
}

async function freezeOpeningFilmAtStart(page) {
  const film = page.locator("#home video").first();
  await film.waitFor({ state: "attached" });
  await film.evaluate(async (element) => {
    element.pause();
    if (element.readyState < 1) {
      await Promise.race([
        new Promise((resolve) => element.addEventListener("loadedmetadata", resolve, { once: true })),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);
    }
    if (Math.abs(element.currentTime) > 0.01) {
      const sought = Promise.race([
        new Promise((resolve) => element.addEventListener("seeked", resolve, { once: true })),
        new Promise((resolve) => setTimeout(resolve, 1200)),
      ]);
      element.currentTime = 0;
      await sought;
    }
  });
  await settle(page, 250);
}

async function captureViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const pageErrors = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") pageErrors.push(`console: ${message.text()}`);
  });

  await page.goto("http://127.0.0.1:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.locator("#home").waitFor({ state: "visible", timeout: 10000 });
  await settle(page, 1000);

  await freezeOpeningFilmAtStart(page);
  const openingStart = await capture(page, viewport.name, "00-opening-start.png");

  await page.getByRole("button", { name: "Enter experience" }).click();
  await settle(page, 1400);
  const openingReady = await capture(page, viewport.name, "01-opening-ready.png");
  manifest.push({ viewport: viewport.name, kind: "opening", from: openingStart, to: openingReady });

  const sections = [
    { selector: "#home", name: "home" },
    { selector: "#about", name: "about" },
    { selector: "#work", name: "work" },
    { selector: "#contact", name: "contact" },
  ];

  let previousSection;
  for (const section of sections) {
    await scrollTo(page, section.selector);
    const frame = await capture(page, viewport.name, `section-${section.name}.png`);
    if (previousSection) {
      manifest.push({ viewport: viewport.name, kind: "section", from: previousSection, to: frame });
    }
    previousSection = frame;
  }

  await scrollTo(page, "#work");

  for (const project of projects) {
    // Change the carousel state without Playwright auto-scrolling the rail button.
    await page.getByRole("button", { name: `Show ${project.title}` }).evaluate((element) => element.click());
    await settle(page, 1000);

    const activeCard = page.getByRole("button", { name: `${project.title}, ${project.category}` });
    await activeCard.scrollIntoViewIfNeeded();
    await settle(page, 500);

    const slug = `${String(project.id).padStart(2, "0")}-${safeName(project.title)}`;
    const before = await capture(page, viewport.name, `project-${slug}-before-open.png`);

    // Trigger the real React click without changing scroll position before the transition starts.
    await activeCard.evaluate((element) => element.click());
    const caseStudy = page.locator(`article[aria-label="${project.title} case study"]`);
    await caseStudy.waitFor({ state: "visible", timeout: 8000 });
    await settle(page, 2300);
    const after = await capture(page, viewport.name, `project-${slug}-after-open.png`);

    manifest.push({
      viewport: viewport.name,
      kind: "project-open",
      transition: project.transition,
      project: project.title,
      from: before,
      to: after,
    });

    await page.getByRole("button", { name: "Back to the film" }).evaluate((element) => element.click());
    await page.locator("#work").waitFor({ state: "visible", timeout: 8000 });
    await settle(page, 2000);

    // The app restores Work; make sure the same active card is visible before capturing the exact return target.
    const restoredCard = page.getByRole("button", { name: `${project.title}, ${project.category}` });
    await restoredCard.scrollIntoViewIfNeeded();
    await settle(page, 350);
    const returned = await capture(page, viewport.name, `project-${slug}-after-return.png`);

    manifest.push({
      viewport: viewport.name,
      kind: "project-return",
      transition: project.transition,
      project: project.title,
      from: after,
      to: returned,
    });
  }

  diagnostics.push({ viewport: viewport.name, width: viewport.width, height: viewport.height, pageErrors });
  await context.close();
}

(async () => {
  fs.rmSync(root, { recursive: true, force: true });
  fs.mkdirSync(root, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) {
      console.log(`Capturing ${viewport.name} frames...`);
      await captureViewport(browser, viewport);
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(root, "transition-manifest.json"), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(root, "diagnostics.json"), JSON.stringify(diagnostics, null, 2));

  const pngCount = fs
    .readdirSync(path.join(root, "desktop"))
    .filter((file) => file.endsWith(".png")).length
    + fs
      .readdirSync(path.join(root, "mobile"))
      .filter((file) => file.endsWith(".png")).length;

  console.log(`Captured ${pngCount} PNG frames and ${manifest.length} transition pairs.`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
