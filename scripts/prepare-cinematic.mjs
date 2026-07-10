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
        const by = BASE[i][1];
        const dx = smoothPointer.x - bx;
        const dy = smoothPointer.y - by;
        const dist = Math.hypot(dx * 1.78, dy);
        const pull = Math.max(0, 1 - dist / 0.34) * 0.105 * smoothPointer.active;
        centers[i * 2] = bx + dx * pull;
        centers[i * 2 + 1] = by + dy * pull;
      }`,
  `      const centers = new Float32Array(8);
      const mobile = host.getBoundingClientRect().width <= 820;
      const base = mobile ? MOBILE_BASE : BASE;
      let nearest = 10;
      let pointerRed = 0;
      let pointerGreen = 0;
      let pointerBlue = 0;
      let pointerColorWeight = 0;
      for (let i = 0; i < 3; i += 1) {
        const bx = base[i][0];
        const by = base[i][1];
        const dx = smoothPointer.x - bx;
        const dy = smoothPointer.y - by;
        const dist = Math.hypot(dx * (mobile ? 1.35 : 1.78), dy);
        const pull = Math.max(0, 1 - dist / 0.34) * 0.105 * smoothPointer.active;
        const colorWeight = 1 / Math.max(0.012, dist * dist);
        nearest = Math.min(nearest, dist);
        pointerRed += colors[i * 3] * colorWeight;
        pointerGreen += colors[i * 3 + 1] * colorWeight;
        pointerBlue += colors[i * 3 + 2] * colorWeight;
        pointerColorWeight += colorWeight;
        centers[i * 2] = bx + dx * pull;
        centers[i * 2 + 1] = by + dy * pull;
      }
      colors[9] = pointerRed / pointerColorWeight;
      colors[10] = pointerGreen / pointerColorWeight;
      colors[11] = pointerBlue / pointerColorWeight;
      const pointerStrength = Math.max(0, 1 - nearest / 0.36) * smoothPointer.active;`,
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
        (mainRadius * 0.68) * pointerStrength,
      ]);`,
);
liquidPrepared = liquidPrepared.replace(
  `      gl.uniform1f(pointerActiveLoc, smoothPointer.active);`,
  `      gl.uniform1f(pointerActiveLoc, pointerStrength);
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
