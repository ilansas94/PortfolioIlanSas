import { readFile } from "node:fs/promises";
import path from "node:path";
import { projects } from "../../../../components/cinematic/projects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character] || character);

const mimeFor = (filePath: string) => {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".svg") return "image/svg+xml";
  return "image/jpeg";
};

const dataUriForPublicFile = async (relativePath: string) => {
  const normalized = relativePath.replace(/^\//, "");
  const absolute = path.join(process.cwd(), "public", normalized);
  const bytes = await readFile(absolute);
  return `data:${mimeFor(absolute)};base64,${bytes.toString("base64")}`;
};

const defs = `
  <defs>
    <filter id="soft"><feGaussianBlur stdDeviation="44"/></filter>
    <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="34" stdDeviation="32" flood-color="#000" flood-opacity=".7"/></filter>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <clipPath id="projectClip"><path d="M55 90 L300 10 L1210 0 L1390 115 L1440 620 L1305 755 L210 735 L0 610 Z"/></clipPath>
    <linearGradient id="work" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f01a72"/><stop offset=".45" stop-color="#cb0b67"/><stop offset="1" stop-color="#16a7d1"/></linearGradient>
    <linearGradient id="about" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb31a"/><stop offset=".48" stop-color="#ff7d1f"/><stop offset="1" stop-color="#d90b64"/></linearGradient>
    <linearGradient id="contact" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14c6df"/><stop offset=".5" stop-color="#00a9c8"/><stop offset="1" stop-color="#ffe42b"/></linearGradient>
    <radialGradient id="spec" cx=".34" cy=".12" r=".52"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".1" stop-color="#fff" stop-opacity=".44"/><stop offset=".36" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>`;

const base = (body: string) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
${defs}
<rect width="1920" height="1080" fill="#030508"/>
<ellipse cx="180" cy="510" rx="720" ry="650" fill="#00a9c8" opacity=".055" filter="url(#soft)"/>
<ellipse cx="1780" cy="500" rx="720" ry="650" fill="#d10a64" opacity=".065" filter="url(#soft)"/>
<ellipse cx="1040" cy="1120" rx="620" ry="470" fill="#ffd900" opacity=".05" filter="url(#soft)"/>
${body}
</svg>`;

const blob = (x: number, y: number, width: number, height: number, fill: string, label: string, note: string, rotate = 0) => `
<g transform="translate(${x} ${y}) rotate(${rotate})" filter="url(#shadow)">
  <path d="M20 46 C58 2 166 -8 248 18 C315 39 330 104 281 145 C229 187 87 185 29 140 C-7 111 -11 76 20 46Z" transform="scale(${width / 330} ${height / 185})" fill="${fill}"/>
  <path d="M34 30 C66 5 148 -1 205 14 C155 22 88 42 55 67 C42 57 34 44 34 30Z" transform="scale(${width / 330} ${height / 185})" fill="url(#spec)"/>
  <text x="${width / 2}" y="${height * .52}" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="22" letter-spacing="8" text-anchor="middle">${label}</text>
  <text x="${width / 2}" y="${height * .67}" fill="#fff" fill-opacity=".66" font-family="Arial,Helvetica,sans-serif" font-size="8" letter-spacing="4" text-anchor="middle">${note}</text>
</g>`;

async function hubFrame() {
  const symbol = await dataUriForPublicFile("/cinematic/symbol.svg");
  return base(`
    <g opacity=".2"><path d="M960 525 L500 650" stroke="#0bb1d1"/><path d="M960 525 L1420 350" stroke="#d10a64"/><path d="M960 525 L1425 720" stroke="#ffd900"/></g>
    ${blob(330, 565, 340, 190, "url(#work)", "WORK", "SELECTED WORLDS", -2)}
    ${blob(1320, 270, 340, 190, "url(#about)", "ABOUT", "PROFILE", 2)}
    ${blob(1320, 650, 340, 190, "url(#contact)", "CONTACT", "BEGIN A PROJECT", -1)}
    <image href="${symbol}" x="850" y="415" width="220" height="220" filter="url(#shadow)"/>
  `);
}

function familyStart(kind: string) {
  if (kind === "print") return base(`
    <g transform="translate(960 540)" filter="url(#shadow)">
      <rect x="-650" y="-370" width="480" height="740" rx="28" fill="#111722" transform="rotate(-13)"/>
      <rect x="-340" y="-390" width="480" height="760" rx="28" fill="#d10a64" fill-opacity=".82" transform="rotate(-5)"/>
      <rect x="-30" y="-390" width="480" height="760" rx="28" fill="#ffd900" fill-opacity=".88" transform="rotate(5)"/>
      <rect x="280" y="-360" width="480" height="720" rx="28" fill="#00a9c8" fill-opacity=".85" transform="rotate(13)"/>
      <circle r="150" fill="#030508"/>
    </g>`);
  if (kind === "ui") return base(`
    <g transform="translate(960 540)" filter="url(#glow)">
      <path d="M-650 -130 C-370 -390 350 -390 650 -110 C470 20 420 210 650 330 C280 470 -400 430 -650 190 C-480 80 -470 -40 -650 -130Z" fill="url(#contact)" fill-opacity=".9"/>
      <path d="M-510 -80 L510 -80 M-510 20 L390 20 M-510 120 L470 120" stroke="#fff" stroke-opacity=".3" stroke-width="3"/>
    </g>`);
  return base(`
    <g transform="translate(960 540)">
      <circle cx="-250" cy="20" r="330" fill="#d10a64" opacity=".74" filter="url(#soft)"/>
      <circle cx="260" cy="-40" r="330" fill="#00a9c8" opacity=".68" filter="url(#soft)"/>
      <circle cx="40" cy="250" r="260" fill="#ffd900" opacity=".48" filter="url(#soft)"/>
      <path d="M-620 80 C-330 -360 280 -390 620 20 C260 70 150 250 -20 390 C-160 210 -320 70 -620 80Z" fill="#030508" fill-opacity=".55"/>
    </g>`);
}

async function projectFrame(projectId: number) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return null;
  const image = await dataUriForPublicFile(project.image);
  const index = projects.findIndex((item) => item.id === project.id) + 1;
  return base(`
    <g transform="translate(240 145)" filter="url(#shadow)">
      <g clip-path="url(#projectClip)">
        <rect width="1440" height="760" fill="#11161c"/>
        <image href="${image}" width="1440" height="760" preserveAspectRatio="xMidYMid slice"/>
        <rect width="1440" height="760" fill="url(#spec)" opacity=".22"/>
        <rect width="1440" height="760" fill="none" stroke="#fff" stroke-opacity=".12"/>
      </g>
    </g>
    <text x="82" y="180" fill="#fff" fill-opacity=".46" font-family="Arial,Helvetica,sans-serif" font-size="13" letter-spacing="7">${String(index).padStart(2, "0")}</text>
    <text x="150" y="925" fill="#fff" fill-opacity=".6" font-family="Arial,Helvetica,sans-serif" font-size="13" letter-spacing="7">${escapeXml(project.category.toUpperCase())}</text>
    <text x="150" y="1005" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="72" font-weight="300" letter-spacing="-4">${escapeXml(project.title)}</text>
    <text x="1630" y="996" fill="#fff" fill-opacity=".7" font-family="Arial,Helvetica,sans-serif" font-size="12" letter-spacing="5">ENTER PROJECT</text>
    <circle cx="1790" cy="182" r="34" fill="#05080c" fill-opacity=".45" stroke="#fff" stroke-opacity=".24"/><text x="1790" y="192" text-anchor="middle" fill="#fff" font-family="Arial" font-size="28">↗</text>
  `);
}

export async function GET(_request: Request, context: { params: { id: string } }) {
  const id = context.params.id;
  let svg: string | null = null;
  if (id === "hub") svg = await hubFrame();
  else if (id === "start-print") svg = familyStart("print");
  else if (id === "start-ui") svg = familyStart("ui");
  else if (id === "start-ink") svg = familyStart("ink");
  else if (/^\d+$/.test(id)) svg = await projectFrame(Number(id));

  if (!svg) return new Response("Not found", { status: 404 });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
