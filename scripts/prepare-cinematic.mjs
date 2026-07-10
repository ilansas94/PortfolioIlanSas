import { readFile, writeFile } from "node:fs/promises";

const portfolioFile = "components/cinematic/CinematicPortfolio.tsx";
const portfolioSource = await readFile(portfolioFile, "utf8");
const portfolioPrepared = portfolioSource.replace(
  '    if (next !== "case") setSelected(null);',
  '    setSelected(null);',
);
if (portfolioPrepared === portfolioSource) {
  throw new Error("Expected cinematic portfolio source patch was not found");
}
await writeFile(portfolioFile, portfolioPrepared, "utf8");

const liquidFile = "components/cinematic/LiquidNav.tsx";
const liquidSource = await readFile(liquidFile, "utf8");
let liquidPrepared = liquidSource.replace(
  `const BASE = [
  [0.265, 0.595],
  [0.735, 0.365],
  [0.74, 0.67],
] as const;`,
  `const BASE = [
  [0.265, 0.595],
  [0.735, 0.365],
  [0.74, 0.67],
] as const;

const MOBILE_BASE = [
  [0.31, 0.57],
  [0.69, 0.47],
  [0.56, 0.72],
] as const;`,
);
liquidPrepared = liquidPrepared.replace(
  `      uniform float uPointerActive;`,
  `      uniform float uPointerActive;
      uniform float uBlobAspect;`,
);
liquidPrepared = liquidPrepared.replace(
  `        d.x *= uResolution.x / uResolution.y;`,
  `        float shapeScale = index == 3 ? 1.0 : uBlobAspect;
        d.x *= (uResolution.x / uResolution.y) * shapeScale;`,
);
liquidPrepared = liquidPrepared.replace(
  `    const pointerActiveLoc = gl.getUniformLocation(program, "uPointerActive");`,
  `    const pointerActiveLoc = gl.getUniformLocation(program, "uPointerActive");
    const blobAspectLoc = gl.getUniformLocation(program, "uBlobAspect");`,
);
liquidPrepared = liquidPrepared.replace(
  `      const centers = new Float32Array(8);
      for (let i = 0; i < 3; i += 1) {
        const bx = BASE[i][0];
        const by = BASE[i][1];`,
  `      const centers = new Float32Array(8);
      const mobile = host.getBoundingClientRect().width <= 820;
      const base = mobile ? MOBILE_BASE : BASE;
      for (let i = 0; i < 3; i += 1) {
        const bx = base[i][0];
        const by = base[i][1];`,
);
liquidPrepared = liquidPrepared.replace(
  `      const radii = new Float32Array([
        0.102,
        0.102,
        0.102,
        0.057 * smoothPointer.active,
      ]);`,
  `      const mainRadius = mobile ? 0.07 : 0.071;
      const radii = new Float32Array([
        mainRadius,
        mainRadius,
        mainRadius,
        (mainRadius * 0.68) * smoothPointer.active,
      ]);`,
);
liquidPrepared = liquidPrepared.replace(
  `      gl.uniform1f(pointerActiveLoc, smoothPointer.active);`,
  `      gl.uniform1f(pointerActiveLoc, smoothPointer.active);
      gl.uniform1f(blobAspectLoc, mobile ? 0.72 : 0.52);`,
);
if (liquidPrepared === liquidSource) {
  throw new Error("Expected liquid navigation source patches were not found");
}
await writeFile(liquidFile, liquidPrepared, "utf8");

const coreFile = "app/cinematic-core.css";
const coreSource = await readFile(coreFile, "utf8");
const corePrepared = coreSource
  .replace(
    ".intro-complete .liquid-nav.has-webgl .liquid-nav__canvas { opacity: 1; }",
    ".intro-complete .liquid-nav.has-webgl .liquid-nav__canvas { opacity: .78; }",
  )
  .replace(
    ".intro-complete .liquid-nav.has-webgl .liquid-fallback { opacity: .08; }",
    ".intro-complete .liquid-nav.has-webgl .liquid-fallback { opacity: .48; }",
  );
if (corePrepared === coreSource) {
  throw new Error("Expected cinematic blend source patches were not found");
}
await writeFile(coreFile, corePrepared, "utf8");
