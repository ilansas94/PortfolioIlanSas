import { test, expect, Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

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
] as const;

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

type ManifestEntry = {
  viewport: string;
  kind: "opening" | "section" | "project-open" | "project-return";
  transition?: string;
  project?: string;
  from: string;
  to?: string;
};

const manifest: ManifestEntry[] = [];
const root = path.resolve("artifacts/cinematic-v3");

function safeName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function screenshot(page: Page, viewport: string, file: string) {
  const directory = path.join(root, viewport);
  fs.mkdirSync(directory, { recursive: true });
  const relative = `${viewport}/${file}`;
  await page.screenshot({ path: path.join(root, relative), fullPage: false, animations: "disabled" });
  return relative;
}

async function settle(page: Page, delay = 900) {
  await page.waitForTimeout(delay);
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

async function scrollTo(page: Page, selector: string) {
  await page.locator(selector).evaluate((element) => element.scrollIntoView({ block: "start", behavior: "auto" }));
  await settle(page, 1000);
}

async function freezeOpeningFilmAtStart(page: Page) {
  const film = page.locator("#home video").first();
  await film.waitFor({ state: "attached" });
  await film.evaluate(async (element: HTMLVideoElement) => {
    element.pause();
    if (element.readyState < 1) {
      await new Promise<void>((resolve) => element.addEventListener("loadedmetadata", () => resolve(), { once: true }));
    }
    element.currentTime = 0;
    await new Promise<void>((resolve) => element.addEventListener("seeked", () => resolve(), { once: true }));
  });
  await settle(page, 250);
}

for (const viewport of viewports) {
  test(`capture cinematic V3 frames — ${viewport.name}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
    await expect(page.locator("#home")).toBeVisible();

    await freezeOpeningFilmAtStart(page);
    const openingStart = await screenshot(page, viewport.name, "00-opening-start.png");

    await page.getByRole("button", { name: "Enter experience" }).click();
    await settle(page, 1300);
    const openingReady = await screenshot(page, viewport.name, "01-opening-ready.png");
    manifest.push({ viewport: viewport.name, kind: "opening", from: openingStart, to: openingReady });

    const sectionFrames = [
      { selector: "#home", name: "home" },
      { selector: "#about", name: "about" },
      { selector: "#work", name: "work" },
      { selector: "#contact", name: "contact" },
    ];

    let previousSection: string | undefined;
    for (const section of sectionFrames) {
      await scrollTo(page, section.selector);
      const frame = await screenshot(page, viewport.name, `section-${section.name}.png`);
      if (previousSection) {
        manifest.push({ viewport: viewport.name, kind: "section", from: previousSection, to: frame });
      }
      previousSection = frame;
    }

    await scrollTo(page, "#work");

    for (const project of projects) {
      await page.getByRole("button", { name: `Show ${project.title}` }).click();
      await settle(page, 950);

      const slug = `${String(project.id).padStart(2, "0")}-${safeName(project.title)}`;
      const before = await screenshot(page, viewport.name, `project-${slug}-before-open.png`);

      await page.getByRole("button", { name: `${project.title}, ${project.category}` }).click();
      await expect(page.locator("article").filter({ has: page.getByRole("heading", { name: project.title, exact: true }) })).toBeVisible({ timeout: 7000 });
      await settle(page, 2200);
      const after = await screenshot(page, viewport.name, `project-${slug}-after-open.png`);
      manifest.push({
        viewport: viewport.name,
        kind: "project-open",
        transition: project.transition,
        project: project.title,
        from: before,
        to: after,
      });

      await page.getByRole("button", { name: "Back to the film" }).click();
      await expect(page.locator("#work")).toBeVisible({ timeout: 7000 });
      await settle(page, 1900);
      const returned = await screenshot(page, viewport.name, `project-${slug}-after-return.png`);
      manifest.push({
        viewport: viewport.name,
        kind: "project-return",
        transition: project.transition,
        project: project.title,
        from: after,
        to: returned,
      });
    }

    expect(pageErrors, `Browser page errors: ${pageErrors.join(" | ")}`).toEqual([]);
    await context.close();
  });
}

test.afterAll(async () => {
  fs.mkdirSync(root, { recursive: true });
  fs.writeFileSync(path.join(root, "transition-manifest.json"), JSON.stringify(manifest, null, 2));
});
