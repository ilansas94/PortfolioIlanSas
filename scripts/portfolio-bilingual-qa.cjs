const { chromium, webkit } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const url = process.env.BASE_URL || "http://127.0.0.1:3000";
const directory = path.resolve("bilingual-visual-qa");
fs.mkdirSync(directory, { recursive: true });
const shot = (name) => path.join(directory, name + ".png");

async function fit(page, label) {
  const dims = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    client: document.documentElement.clientWidth
  }));
  assert.ok(dims.document <= dims.client + 3, label + " layout overflow: " + JSON.stringify(dims));
  assert.ok(dims.body <= dims.client + 3, label + " body overflow: " + JSON.stringify(dims));
}
async function capture(page, id, suffix) {
  await page.locator(id).scrollIntoViewIfNeeded();
  await page.waitForTimeout(550);
  await page.locator(id).screenshot({ path: shot(suffix) });
}

(async () => {
  const errors = [];
  for (const preset of [
    { name: "iphone", browserType: webkit, width: 390, height: 844 },
    { name: "compact", browserType: chromium, width: 320, height: 720 },
    { name: "tablet", browserType: chromium, width: 820, height: 1024 },
    { name: "desktop", browserType: chromium, width: 1440, height: 900 }
  ]) {
    const browser = await preset.browserType.launch({headless: true, args: preset.browserType === chromium ? ["--no-sandbox"] : []});
    try {
      const page = await browser.newPage({ viewport: { width: preset.width, height: preset.height }, deviceScaleFactor: 1 });
      page.on("pageerror", error => errors.push(preset.name + ": " + error.message));
      const response = await page.goto(url, {waitUntil: "networkidle"});
      assert.equal(response.status(), 200, preset.name + " loads");
      await page.waitForTimeout(900);
      assert.equal(await page.locator("html").getAttribute("lang"), "en");
      const navbar = page.locator("nav").first();
      await navbar.screenshot({path: shot(preset.name + "-01-english-nav")});
      await capture(page,"#home",preset.name + "-02-english-hero");
      await fit(page,preset.name + " EN");

      const enContact = page.getByRole("button", {name:"Get In Touch"}).first();
      const secondary = await enContact.evaluate(el => ({background: getComputedStyle(el).backgroundColor, border: getComputedStyle(el).borderColor}));
      assert.ok(!secondary.background.includes("0, 0, 0, 0"), "Contact CTA is no longer invisible");
      assert.ok(!secondary.border.includes("0, 0, 0, 0"), "Contact CTA has a visible outline");

      const switcher = page.getByRole("button", {name:"מעבר לעברית"}).filter({visible:true}).first();
      await switcher.click();
      await page.waitForTimeout(850);
      assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
      assert.equal(await page.locator("html").getAttribute("lang"), "he");
      assert.equal(await page.locator("html").evaluate(el => getComputedStyle(el).direction), "rtl");
      assert.equal(await page.getByText("לצפייה בעבודות").count() > 0,true);
      assert.equal(await page.getByText("קצת עליי").count() > 0,true);
      await navbar.screenshot({path: shot(preset.name + "-03-hebrew-nav")});
      await capture(page,"#home",preset.name + "-04-hebrew-hero");
      await capture(page,"#about",preset.name + "-05-hebrew-about");
      await capture(page,"#portfolio",preset.name + "-06-hebrew-portfolio");
      await capture(page,"#skills",preset.name + "-07-hebrew-skills");
      await capture(page,"#contact",preset.name + "-08-hebrew-contact");
      await fit(page,preset.name + " HE");
      assert.ok((await page.locator("#portfolio").innerText()).includes("עבודות נבחרות"));

      const portfolioCard = page.getByRole("button", {name:/פתיחת פרויקט.*FIRST SHIFT/}).first();
      await portfolioCard.click();
      const modal = page.getByRole("dialog");
      await modal.waitFor({state:"visible"});
      assert.ok((await modal.innerText()).includes("פרויקט קונספט עצמאי"));
      await modal.screenshot({path:shot(preset.name + "-09-hebrew-modal")});
      await page.getByRole("button",{name:"סגירת פרויקט"}).click();
      await modal.waitFor({state:"hidden"});
      await fit(page,preset.name + " modal");
      await page.reload({waitUntil:"networkidle"});
      await page.waitForTimeout(600);
      assert.equal(await page.locator("html").getAttribute("lang"),"he","Language choice survives reload");
      assert.equal(await page.locator("html").getAttribute("dir"),"rtl");
      await page.getByRole("button",{name:"Switch to English"}).filter({visible:true}).first().click();
      await page.waitForTimeout(300);
      assert.equal(await page.locator("html").getAttribute("lang"),"en","Switch back to English");
      assert.equal(await page.locator("html").getAttribute("dir"),"ltr");
      await fit(page,preset.name + " English restored");
      console.log("PASS",preset.name, "English, Hebrew, visual, portfolio modal, persistence, RTL and CTA");
      await page.close();
    } finally {
      await browser.close();
    }
  }
  assert.deepEqual(errors,[],"No client exceptions");
  console.log("BILINGUAL VISUAL QA PASS",directory);
})().catch(error => {console.error(error);process.exitCode=1;});
