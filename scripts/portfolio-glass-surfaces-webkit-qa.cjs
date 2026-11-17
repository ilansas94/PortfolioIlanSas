// Optical checks on real text and artwork in both fixed navigation surfaces.
// Requires Playwright; sends no messages and performs no deployments.
const { webkit, devices } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright'), fs = require('fs'), assert = require('node:assert/strict');
const out = process.env.QA_OUTPUT_DIR || '/tmp/portfolio-glass-surfaces-qa';
fs.mkdirSync(out, { recursive: true });
(async () => { const b = await webkit.launch({ executablePath: process.env.QA_WEBKIT_EXECUTABLE || undefined }); try {
    const p = await b.newPage({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: 'reduce' }), errors = [], results = [];
    p.on('pageerror', e => errors.push(e.message));
    await p.goto(process.env.QA_BASE_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(1800);
    for (const [caseName, selector, image] of [['hero', '#home h1', false], ['about', '#about h2', false], ['safe', '#portfolio [role=button] img', true], ['shift', '#portfolio [role=button]:nth-child(2) img', true]])
        for (const surface of ['nav', 'menu']) {
            if (surface === 'menu') {
                await p.getByRole('button', { name: 'פתיחת תפריט ניווט' }).click();
                await p.waitForTimeout(1000);
            }
            const receiver = p.locator(surface === 'nav' ? 'nav .liquid-navigation' : '#mobile-navigation-menu .liquid-navigation'), box = await receiver.boundingBox();
            const target = p.locator(selector).first();
            await target.scrollIntoViewIfNeeded();
            await p.waitForTimeout(350);
            await target.evaluate((e, params) => scrollTo({ top: e.getBoundingClientRect().top + scrollY - params.y + (params.image ? e.getBoundingClientRect().height * .3 : 0), behavior: 'instant' }), { y: box.y, image });
            await p.waitForTimeout(600);
            const name = `${caseName}-${surface}`;
            await p.screenshot({ path: `${out}/${name}-site.png` });
            const hidden = await p.addStyleTag({ content: `${selector}{visibility:hidden!important}` });
            const mirror = p.locator(surface === 'nav' ? 'nav .liquid-navigation-mirror' : '#mobile-navigation-menu .liquid-navigation-mirror'), style = await mirror.getAttribute('style');
            const on = await receiver.screenshot({ path: `${out}/${name}-on.png` });
            await mirror.evaluate(e => e.style.filter = 'saturate(1.12)');
            const off = await receiver.screenshot({ path: `${out}/${name}-off.png` });
            const metrics = await p.evaluate(async (imgs) => { const inputs = await Promise.all(imgs.map(async (s) => { const im = new Image(); im.src = 'data:image/png;base64,' + s; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const ctx = c.getContext('2d'); ctx.drawImage(im, 0, 0); return ctx.getImageData(0, 0, c.width, c.height).data; })); let changed = 0, large = 0; for (let i = 0; i < inputs[0].length; i += 4) {
                const d = Math.max(...[0, 1, 2].map(k => Math.abs(inputs[0][i + k] - inputs[1][i + k])));
                if (d > 0)
                    changed++;
                if (d > 20)
                    large++;
            } return { changed, large }; }, [on.toString('base64'), off.toString('base64')]);
            assert.ok(metrics.large > 150, `${name} missing refraction ${JSON.stringify(metrics)}`);
            await mirror.evaluate((e, s) => e.setAttribute('style', s), style);
            await hidden.evaluate(e => e.remove());
            if (surface === 'menu') {
                await p.keyboard.press('Escape');
                await p.locator('#mobile-navigation-menu').waitFor({ state: 'detached' });
            }
            results.push({ caseName, surface, ...metrics });
            console.log('PASS', JSON.stringify(results.at(-1)));
        }
    assert.deepEqual(errors, []);
    fs.writeFileSync(`${out}/results.json`, JSON.stringify({ version: await b.version(), results, errors }, null, 2));
    console.log('PASS WebKit', await b.version());
}
finally {
    await b.close();
} })().catch(e => { console.error(e); process.exit(1); });
