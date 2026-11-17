// Local browser test: artwork must remain inside the SVG filter after scrolling.
// Requires Playwright. Never submits forms or deploys.
const { webkit, devices } = require('playwright'), fs = require('fs'), assert = require('node:assert/strict');
const base = process.env.QA_BASE_URL || 'http://localhost:3000', dir = process.env.QA_OUTPUT_DIR || '/tmp/portfolio-artwork-webkit-qa';
fs.mkdirSync(dir, { recursive: true });
(async () => { const b = await webkit.launch({ executablePath: process.env.QA_WEBKIT_EXECUTABLE || undefined }), results = []; try {
    for (const dpr of [1, 3]) {
        const c = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, deviceScaleFactor: dpr, reducedMotion: 'reduce' }), p = await c.newPage(), errors = [];
        p.on('pageerror', e => errors.push(e.message));
        await p.goto(base, { waitUntil: 'networkidle' });
        await p.evaluate(() => document.fonts.ready);
        await p.waitForTimeout(1500);
        for (const language of ['he', 'en']) {
            if (language === 'en')
                await p.getByRole('button', { name: 'Switch to English' }).locator('visible=true').click();
            for (const project of [0, 1]) {
                const image = p.locator('#portfolio [role=button] img').nth(project);
                await image.scrollIntoViewIfNeeded();
                await p.waitForTimeout(700);
                await image.evaluate(e => scrollTo({ top: e.getBoundingClientRect().top + scrollY + e.height * .3, behavior: 'instant' }));
                await p.waitForTimeout(700);
                const stage = `${dpr}-${language}-${project}`;
                await p.screenshot({ path: `${dir}/${stage}-site.png` });
                // Hide the originals only. The shadow reflection keeps its own
                // stylesheet, so a clipped-away filter cannot pass by exposing
                // the unbent artwork underneath the navigation.
                const hidden = await p.addStyleTag({ content: '#portfolio [role="button"] img{visibility:hidden!important}' });
                await p.waitForTimeout(100);
                const mirror = p.locator('nav .liquid-navigation-mirror'), style = await mirror.getAttribute('style');
                const on = await p.locator('nav').screenshot({ path: `${dir}/${stage}-isolated-on.png` });
                await mirror.evaluate(e => e.style.filter = 'saturate(1.12)');
                const off = await p.locator('nav').screenshot({ path: `${dir}/${stage}-isolated-off.png` });
                const metrics = await p.evaluate(async (imgs) => { const canvases = await Promise.all(imgs.map(async (s) => { const im = new Image(); im.src = 'data:image/png;base64,' + s; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const ctx = c.getContext('2d'); ctx.drawImage(im, 0, 0); return { w: c.width, h: c.height, data: ctx.getImageData(0, 0, c.width, c.height).data }; })); const [a, b] = canvases; let large = 0, midSum = 0, midN = 0; for (let y = 0; y < a.h; y++)
                    for (let x = 0; x < a.w; x++) {
                        const i = (y * a.w + x) * 4, delta = Math.max(...[0, 1, 2].map(k => Math.abs(a.data[i + k] - b.data[i + k])));
                        if (delta > 20)
                            large++;
                        if (Math.abs(x - a.w * .5) < a.w * .025 && y > a.h * .42 && y < a.h * .58) {
                            midSum += delta;
                            midN++;
                        }
                    } return { large, centerDelta: midSum / midN }; }, [on.toString('base64'), off.toString('base64')]);
                assert.ok(metrics.large > 400 * dpr * dpr, `${stage} no significant artwork displacement: ${JSON.stringify(metrics)}`);
                // Two axis passes resample subpixel edges in the center. Allow
                // that small difference, while rejecting the missing-image
                // baseline (about 148 levels for this same artwork and crop).
                assert.ok(metrics.centerDelta < 20, `${stage} filter dropped the image: ${JSON.stringify(metrics)}`);
                await mirror.evaluate((e, s) => e.setAttribute('style', s), style);
                await hidden.evaluate(e => e.remove());
                await p.getByRole('button', { name: language === 'he' ? 'פתיחת תפריט ניווט' : 'Open navigation menu' }).click();
                await p.waitForTimeout(600);
                assert.equal(await p.locator('#mobile-navigation-menu').count(), 1);
                await p.screenshot({ path: `${dir}/${stage}-menu.png` });
                await p.keyboard.press('Escape');
                await p.locator('#mobile-navigation-menu').waitFor({ state: 'detached' });
                assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
                results.push({ dpr, language, project, ...metrics });
                console.log('PASS', JSON.stringify(results.at(-1)));
            }
        }
        assert.deepEqual(errors, []);
        await c.close();
    }
    fs.writeFileSync(`${dir}/results.json`, JSON.stringify(results, null, 2));
}
finally {
    await b.close();
} })().catch(e => { console.error(e); process.exit(1); });
