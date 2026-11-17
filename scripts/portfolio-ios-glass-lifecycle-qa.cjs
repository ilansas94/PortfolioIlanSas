// Local resource-registration regression, not a physical-iPhone certification.
// Covers a size returning to its previous value and repeated menu remounts.
const { webkit, devices } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('fs');
const out = process.env.QA_OUTPUT_DIR || '/tmp/ios-glass-lifecycle';
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await webkit.launch({ executablePath: process.env.QA_WEBKIT_EXECUTABLE || undefined });
  try {
    const page = await browser.newPage({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const errors = [], resources = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.QA_BASE_URL || 'http://localhost:3052', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    async function inspect(surface, previousId) {
      await page.waitForFunction(({ surface, previousId }) => {
        const root = document.querySelector(surface);
        const mirror = root?.querySelector('.liquid-navigation-mirror');
        const filter = root?.querySelector('filter');
        return mirror && filter && filter.id !== previousId && mirror.style.filter.includes(filter.id);
      }, { surface, previousId });
      const state = await page.locator(surface).evaluate(root => {
        const filter = root.querySelector('filter'), mirror = root.querySelector('.liquid-navigation-mirror'), defs = root.querySelector('svg');
        return {
          id: filter.id,
          registered: document.getElementById(filter.id) === filter,
          transform: getComputedStyle(mirror).transform,
          defsWidth: defs.getAttribute('width'),
          map: filter.querySelector('feImage').getAttribute('href').startsWith('data:image/png'),
          overflow: document.documentElement.scrollWidth > innerWidth,
          mirrors: root.querySelectorAll('.liquid-navigation-mirror').length,
        };
      });
      assert.equal(state.registered, true);
      assert.notEqual(state.transform, 'none');
      assert.equal(state.defsWidth, '1');
      assert.equal(state.map, true);
      assert.equal(state.overflow, false);
      assert.equal(state.mirrors, 1);
      resources.push(state);
      return state.id;
    }

    let previous = await inspect('nav .liquid-navigation');
    for (const width of [320, 390, 768, 390]) {
      await page.setViewportSize({ width, height: 844 });
      previous = await inspect('nav .liquid-navigation', previous);
    }
    assert.equal(new Set(resources.map(resource => resource.id)).size, resources.length);

    for (let iteration = 0; iteration < 3; iteration++) {
      await page.getByRole('button', { name: 'פתיחת תפריט ניווט' }).click();
      await inspect('#mobile-navigation-menu .liquid-navigation');
      if (!iteration) await page.screenshot({ path: `${out}/he-menu.png` });
      await page.keyboard.press('Escape');
      await page.locator('#mobile-navigation-menu').waitFor({ state: 'detached' });
      assert.equal(await page.locator('.liquid-navigation-mirror').count(), 1);
    }

    await page.getByRole('button', { name: 'Switch to English' }).click();
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    await inspect('#mobile-navigation-menu .liquid-navigation');
    await page.screenshot({ path: `${out}/en-menu.png` });
    await page.keyboard.press('Escape');
    await page.locator('#mobile-navigation-menu').waitFor({ state: 'detached' });
    await page.reload({ waitUntil: 'networkidle' });
    await inspect('nav .liquid-navigation');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.deepEqual(errors, []);
    fs.writeFileSync(`${out}/results.json`, JSON.stringify({ engine: 'Linux WPE, not Apple iOS', version: await browser.version(), resources, errors }, null, 2));
    console.log('PASS resize/return-to-size, resource registration, three menu remounts, both languages, reload; Linux WPE only');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
