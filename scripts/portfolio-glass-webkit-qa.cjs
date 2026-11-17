/* Run after a local build/start. Requires Playwright's WebKit browser. No email or deployment actions. */
const { webkit, devices } = require('playwright');
const assert = require('node:assert/strict');
const baseURL = process.env.QA_BASE_URL || 'http://localhost:3000';

(async () => {
  const browser = await webkit.launch({ executablePath: process.env.QA_WEBKIT_EXECUTABLE || undefined });
  try {
    for (const dpr of [1, 3]) {
      const context = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => {
        window.__glassSurfaces = [];
        const attach = Element.prototype.attachShadow;
        Element.prototype.attachShadow = function (options) {
          const root = attach.call(this, options);
          if (this.classList.contains('liquid-navigation-mirror')) window.__glassSurfaces.push({ host: this, root });
          return root;
        };
      });
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      const checkAlignment = async selector => {
        await page.waitForFunction(selector => window.__glassSurfaces.some(surface => surface.host.isConnected && surface.root.querySelector(selector)), selector);
        const offsets = await page.evaluate(selector => {
          const source = document.querySelector(selector).getBoundingClientRect();
          return window.__glassSurfaces.filter(surface => surface.host.isConnected).flatMap(surface => {
            const copy = surface.root.querySelector(selector);
            if (!copy) return [];
            const rect = copy.getBoundingClientRect();
            return [Math.max(...['x', 'y', 'width', 'height'].map(key => Math.abs(rect[key] - source[key])))];
          });
        }, selector);
        assert.ok(offsets.length > 0 && offsets.every(offset => offset <= .25), `DPR${dpr} ${selector}: ${offsets}`);
      };
      await checkAlignment('h1');
      await page.locator('#about h2').first().evaluate(element => scrollTo({ top: element.getBoundingClientRect().top + scrollY - 22, behavior: 'instant' }));
      await page.waitForTimeout(600);
      await checkAlignment('#about h2');
      await page.locator('[aria-controls="mobile-navigation-menu"]').click();
      await page.waitForTimeout(800);
      await checkAlignment('#about h2');
      assert.equal(await page.locator('.liquid-navigation-mirror').count(), 2);
      assert.ok(await page.locator('.liquid-navigation-mirror').evaluateAll(nodes => nodes.every(node => node.inert)));
      await page.getByRole('button', { name: 'Switch to English' }).locator('visible=true').click();
      await page.waitForTimeout(600);
      await checkAlignment('#about h2');
      await page.keyboard.press('Escape');
      await page.locator('#mobile-navigation-menu').waitFor({ state: 'detached' });
      assert.equal(await page.locator('#portfolio [role=button]').count(), 13);
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(600);
      await page.evaluate(() => {
        const grid = document.createElement('div');
        grid.style.cssText = 'position:absolute;inset:0 0 auto;height:700px;z-index:45;background:repeating-conic-gradient(#111 0% 25%,#eee 0% 50%) 0 0 / 16px 16px';
        document.querySelector('#home').append(grid);
      });
      await page.waitForTimeout(500);
      const on = await page.locator('nav').screenshot();
      await page.locator('nav .liquid-navigation-mirror').evaluate(element => { element.style.filter = 'saturate(1.12)'; });
      const off = await page.locator('nav').screenshot();
      const changed = await page.evaluate(async images => {
        const pixels = await Promise.all(images.map(async image => {
          const img = new Image();
          img.src = 'data:image/png;base64,' + image;
          await img.decode();
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
          return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        }));
        let count = 0;
        for (let i = 0; i < pixels[0].length; i += 4) if ([0, 1, 2].some(c => pixels[0][i+c] !== pixels[1][i+c])) count++;
        return count;
      }, [on.toString('base64'), off.toString('base64')]);
      assert.ok(changed > 500, `DPR${dpr}: filter parsed but did not bend pixels (${changed})`);
      assert.deepEqual(errors, []);
      console.log(`PASS WebKit DPR${dpr}: alignment, dropdown, language, inert surface, 13 cards, ${changed} optically changed pixels`);
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
