/* Requires Playwright. Compares pixels against a reviewed Git revision, with no
 * server, deployment, network request or contact-form submission. */
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');
const { chromium, webkit } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const baseline = process.env.QA_BASELINE_REF || '94e29a4';
const compilerOptions = { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 };
const source = (path, previous) => previous ? execFileSync('git', ['show', `${baseline}:${path}`], { encoding: 'utf8' }) : fs.readFileSync(path, 'utf8');
let html = '<!doctype html><title>Optical regression check</title>';
for (const [name, previous] of [['before', true], ['after', false]]) {
  const js = ts.transpileModule(source('lib/refractive-glass.ts', previous), { compilerOptions }).outputText;
  html += `<script>globalThis.${name}=(()=>{const exports={};${js};return exports})();</script>`;
  const file = ts.createSourceFile('navigation.tsx', source('components/RefractiveNavigation.tsx', previous), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const makeBezel = file.statements.find(node => ts.isFunctionDeclaration(node) && node.name.text === 'makeBezel');
  const map = ts.transpileModule(makeBezel.getText(file), { compilerOptions }).outputText;
  html += `<script>globalThis.map${name}=(()=>{const bezelCache=new Map();${map};return makeBezel})();</script>`;
}
(async () => {
  for (const engine of ['chromium', 'webkit']) {
    const browser = await (engine === 'chromium'
      ? chromium.launch({ executablePath: process.env.QA_CHROMIUM_EXECUTABLE || '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] })
      : webkit.launch({ executablePath: process.env.QA_WEBKIT_EXECUTABLE || undefined }));
    try {
      const page = await browser.newPage();
      await page.setContent(html);
      const result = await page.evaluate(() => {
        if (before.GLASS_FRAGMENT !== after.GLASS_FRAGMENT) throw Error('Optical shader changed');
        let renderCases = 0, mapCases = 0;
        for (const [width, height] of [[320,844], [390,844], [768,1024], [1440,900], [2560,1440], [3440,1440], [5120,1440]]) {
          const canvases = [document.createElement('canvas'), document.createElement('canvas')];
          const renderers = [before.createGlassRenderer(canvases[0]), after.createGlassRenderer(canvases[1])];
          for (const time of [0,7,31]) {
            const positions = after.glassPositions(width, height, time, 1.7);
            if (width < 640 && JSON.stringify(positions) !== JSON.stringify(before.glassPositions(width, height, time, 1.7))) throw Error('Mobile trajectory changed');
            for (const diagnostic of [false, true]) {
              const pixels = renderers.map((renderer, i) => {
                renderer.draw(width, height, positions, 1, diagnostic);
                const canvas = canvases[i], gl = canvas.getContext('webgl');
                const data = new Uint8Array(canvas.width * canvas.height * 4);
                gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
                if (gl.getError() || gl.isContextLost()) throw Error('Invalid WebGL comparison');
                return data;
              });
              let alpha = 0;
              for (let i = 0; i < pixels[0].length; i++) {
                if (pixels[0][i] !== pixels[1][i]) throw Error(`Pixel changed at ${width}, ${time}, ${diagnostic}, channel ${i}`);
                if (i % 4 === 3 && pixels[0][i]) alpha++;
              }
              if (alpha < 100) throw Error('Empty comparison');
              renderCases++;
            }
          }
          renderers.forEach(renderer => renderer.dispose());
        }
        for (const [w,h] of [[288,64], [358,68], [720,76], [1280,80], [1536,80], [358,520], [720,600]]) {
          const a = mapbefore(w,h), b = mapafter(w,h);
          if (a.src !== b.src || mapafter(w,h) !== b) throw Error(`Bezel changed or cache missed: ${w}x${h}`);
          mapCases++;
        }
        return { renderCases, mapCases };
      });
      assert.equal(result.renderCases, 42);
      assert.equal(result.mapCases, 7);
      console.log(`PASS ${engine}: ${result.renderCases} exact RGBA scenes; ${result.mapCases} identical cached maps`);
    } finally { await browser.close(); }
  }
})().catch(error => { console.error(error); process.exit(1); });
