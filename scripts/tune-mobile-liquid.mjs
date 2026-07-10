import { readFile, writeFile } from "node:fs/promises";

const file = "components/cinematic/LiquidNav.tsx";
const source = await readFile(file, "utf8");

let tuned = source.replace(
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

tuned = tuned.replace(
  `      uniform float uPointerActive;`,
  `      uniform float uPointerActive;
      uniform float uBlobAspect;
      uniform vec2 uBridgeStart0;
      uniform vec2 uBridgeEnd0;
      uniform float uBridgeStrength0;
      uniform vec2 uBridgeStart1;
      uniform vec2 uBridgeEnd1;
      uniform float uBridgeStrength1;`,
);

tuned = tuned.replace(
  `      float influence(vec2 uv, int index){
        vec2 d = uv - uCenters[index];
        d.x *= uResolution.x / uResolution.y;
        float angle = atan(d.y, d.x);
        float wobble = 1.0 + 0.045 * sin(angle * 3.0 + uTime * 0.72 + float(index) * 1.7)
                           + 0.025 * sin(angle * 5.0 - uTime * 0.44 + float(index));
        float radius = uRadii[index] * wobble;
        return radius * radius / max(dot(d, d), 0.00008);
      }`,
  `      float influence(vec2 uv, int index){
        vec2 center = uCenters[0];
        float baseRadius = uRadii[0];
        if(index == 1){ center = uCenters[1]; baseRadius = uRadii[1]; }
        if(index == 2){ center = uCenters[2]; baseRadius = uRadii[2]; }
        if(index == 3){ center = uCenters[3]; baseRadius = uRadii[3]; }
        vec2 d = uv - center;
        float shapeScale = index == 3 ? 1.0 : uBlobAspect;
        d.x *= (uResolution.x / uResolution.y) * shapeScale;
        float angle = atan(d.y, d.x);
        float wobble = 1.0 + 0.045 * sin(angle * 3.0 + uTime * 0.72 + float(index) * 1.7)
                           + 0.025 * sin(angle * 5.0 - uTime * 0.44 + float(index));
        float radius = baseRadius * wobble;
        return radius * radius / max(dot(d, d), 0.00008);
      }`,
);

tuned = tuned.replace(
  `        d.x *= uResolution.x / uResolution.y;`,
  `        float shapeScale = index == 3 ? 1.0 : uBlobAspect;
        d.x *= (uResolution.x / uResolution.y) * shapeScale;`,
);

tuned = tuned.replace(
  `      float fieldAt(vec2 uv){
        float value = 0.0;
        for(int i = 0; i < 4; i++) value += influence(uv, i);
        return value;
      }`,
  `      float bridgeInfluence(vec2 uv, vec2 a, vec2 b, float strength){
        vec2 p = uv;
        float aspect = uResolution.x / uResolution.y;
        p.x *= aspect;
        a.x *= aspect;
        b.x *= aspect;
        vec2 pa = p - a;
        vec2 ba = b - a;
        float along = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
        float distanceSquared = dot(pa - ba * along, pa - ba * along);
        float radius = mix(0.012, 0.038, strength);
        return strength * radius * radius / max(distanceSquared, 0.00008);
      }

      float fieldAt(vec2 uv){
        float value = 0.0;
        for(int i = 0; i < 4; i++) value += influence(uv, i);
        value += bridgeInfluence(uv, uBridgeStart0, uBridgeEnd0, uBridgeStrength0);
        value += bridgeInfluence(uv, uBridgeStart1, uBridgeEnd1, uBridgeStrength1);
        return value;
      }`,
);

tuned = tuned.replace(
  `    const pointerActiveLoc = gl.getUniformLocation(program, "uPointerActive");`,
  `    const pointerActiveLoc = gl.getUniformLocation(program, "uPointerActive");
    const blobAspectLoc = gl.getUniformLocation(program, "uBlobAspect");
    const bridgeStart0Loc = gl.getUniformLocation(program, "uBridgeStart0");
    const bridgeEnd0Loc = gl.getUniformLocation(program, "uBridgeEnd0");
    const bridgeStrength0Loc = gl.getUniformLocation(program, "uBridgeStrength0");
    const bridgeStart1Loc = gl.getUniformLocation(program, "uBridgeStart1");
    const bridgeEnd1Loc = gl.getUniformLocation(program, "uBridgeEnd1");
    const bridgeStrength1Loc = gl.getUniformLocation(program, "uBridgeStrength1");`,
);

tuned = tuned.replace(
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
      const distances = new Float32Array(3);
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
        const pull = Math.max(0, 1 - dist / 0.50) * 0.15 * smoothPointer.active;
        const colorWeight = 1 / Math.max(0.012, dist * dist);
        distances[i] = dist;
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
      const pointerStrength = Math.max(0, 1 - nearest / 0.54) * smoothPointer.active;
      const ranked = [0, 1, 2]
        .map((index) => ({ index, distance: distances[index] }))
        .sort((a, b) => a.distance - b.distance);
      const primaryBridgeStrength = Math.max(0, 1 - ranked[0].distance / 0.62) * smoothPointer.active;
      const betweenGate = Math.max(0, 1 - Math.abs(ranked[1].distance - ranked[0].distance) / 0.20);
      const secondaryBridgeStrength = Math.max(0, 1 - ranked[1].distance / 0.62) * betweenGate * smoothPointer.active;`,
);

tuned = tuned.replace(
  `      const radii = new Float32Array([
        0.102,
        0.102,
        0.102,
        0.057 * smoothPointer.active,
      ]);`,
  `      const mainRadius = mobile ? 0.052 : 0.071;
      const radii = new Float32Array([
        mainRadius,
        mainRadius,
        mainRadius,
        (mainRadius * 0.88) * pointerStrength,
      ]);`,
);

tuned = tuned.replace(
  `      gl.uniform1f(pointerActiveLoc, smoothPointer.active);`,
  `      gl.uniform1f(pointerActiveLoc, pointerStrength);
      gl.uniform1f(blobAspectLoc, mobile ? 0.72 : 0.52);
      gl.uniform2f(bridgeStart0Loc, centers[ranked[0].index * 2], centers[ranked[0].index * 2 + 1]);
      gl.uniform2f(bridgeEnd0Loc, smoothPointer.x, smoothPointer.y);
      gl.uniform1f(bridgeStrength0Loc, primaryBridgeStrength);
      gl.uniform2f(bridgeStart1Loc, centers[ranked[1].index * 2], centers[ranked[1].index * 2 + 1]);
      gl.uniform2f(bridgeEnd1Loc, smoothPointer.x, smoothPointer.y);
      gl.uniform1f(bridgeStrength1Loc, secondaryBridgeStrength);`,
);

const required = [
  "MOBILE_BASE",
  "uBlobAspect",
  "vec2 center = uCenters[0]",
  "bridgeInfluence",
  "primaryBridgeStrength",
  "secondaryBridgeStrength",
  "mobile ? 0.052 : 0.071",
];
for (const marker of required) {
  if (!tuned.includes(marker)) throw new Error(`Liquid navigation patch failed at ${marker}`);
}

await writeFile(file, tuned, "utf8");
