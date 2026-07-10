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
  const absolute = path.join(process.cwd(), "public", relativePath.replace(/^\//, ""));
  const bytes = await readFile(absolute);
  return `data:${mimeFor(absolute)};base64,${bytes.toString("base64")}`;
};

const defs = `
<defs>
  <filter id="soft"><feGaussianBlur stdDeviation="44"/></filter>
  <filter id="shadow" x="-45%" y="-45%" width="190%" height="190%"><feDropShadow dx="0" dy="34" stdDeviation="30" flood-color="#000" flood-opacity=".72"/></filter>
  <clipPath id="projectClip"><path d="M58 76L290 8L1160 8L1397 116L1440 615L1310 750L215 735L0 605Z"/></clipPath>
  <linearGradient id="work" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f21b75"/><stop offset=".48" stop-color="#c70863"/><stop offset="1" stop-color="#18a8d2"/></linearGradient>
  <linearGradient id="about" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb51a"/><stop offset=".5" stop-color="#ff7e1f"/><stop offset="1" stop-color="#d90b64"/></linearGradient>
  <linearGradient id="contact" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16c9e2"/><stop offset=".5" stop-color="#00a8c7"/><stop offset="1" stop-color="#ffe32a"/></linearGradient>
  <radialGradient id="spec" cx=".28" cy=".12" r=".54"><stop offset="0" stop-color="#fff" stop-opacity=".98"/><stop offset=".12" stop-color="#fff" stop-opacity=".46"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".18"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>
</defs>`;

const base = (body: string, ambient = true) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
${defs}
<rect width="1920" height="1080" fill="#030508"/>
${ambient ? `<ellipse cx="90" cy="530" rx="710" ry="660" fill="#00a9c8" opacity=".055" filter="url(#soft)"/><ellipse cx="1840" cy="500" rx="720" ry="650" fill="#d10a64" opacity=".065" filter="url(#soft)"/><ellipse cx="1040" cy="1160" rx="620" ry="470" fill="#ffdc00" opacity=".045" filter="url(#soft)"/>` : ""}
${body}
</svg>`;

const blob = (x: number, y: number, fill: string, label: string, note: string, rotate = 0) => `
<g transform="translate(${x} ${y}) rotate(${rotate})" filter="url(#shadow)">
  <path d="M25 78C80 12 170-5 270 25C360 50 408 120 365 170C315 224 96 230 30 170C-8 136-8 104 25 78Z" fill="${fill}"/>
  <path d="M25 78C80 12 170-5 270 25C360 50 408 120 365 170C315 224 96 230 30 170C-8 136-8 104 25 78Z" fill="url(#shade)"/>
  <ellipse cx="118" cy="44" rx="92" ry="47" fill="url(#spec)"/>
  <text x="200" y="115" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="19" letter-spacing="8" text-anchor="middle">${label}</text>
  <text x="200" y="142" fill="#fff" fill-opacity=".68" font-family="Arial,Helvetica,sans-serif" font-size="7" letter-spacing="4" text-anchor="middle">${note}</text>
</g>`;

async function hubFrame() {
  const symbol = await dataUriForPublicFile("/cinematic/symbol.svg");
  return base(`
    <g fill="none" stroke-width="1" opacity=".16"><path d="M960 520L475 650" stroke="#21b7d7"/><path d="M960 520L1455 355" stroke="#d91466"/><path d="M960 520L1460 755" stroke="#ffdc00"/></g>
    ${blob(275, 560, "url(#work)", "WORK", "SELECTED WORLDS", -2)}
    ${blob(1260, 250, "url(#about)", "ABOUT", "PROFILE", 2)}
    ${blob(1280, 645, "url(#contact)", "CONTACT", "BEGIN A PROJECT", -1)}
    <image href="${symbol}" x="820" y="365" width="280" height="280" preserveAspectRatio="xMidYMid meet" filter="url(#shadow)"/>
  `);
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
        <rect width="1440" height="760" fill="url(#spec)" opacity=".13"/>
        <rect width="1440" height="760" fill="none" stroke="#fff" stroke-opacity=".1"/>
      </g>
    </g>
    <text x="82" y="180" fill="#fff" fill-opacity=".46" font-family="Arial,Helvetica,sans-serif" font-size="13" letter-spacing="7">${String(index).padStart(2, "0")}</text>
    <text x="150" y="925" fill="#fff" fill-opacity=".62" font-family="Arial,Helvetica,sans-serif" font-size="13" letter-spacing="7">${escapeXml(project.category.toUpperCase())}</text>
    <text x="150" y="1005" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="72" font-weight="300" letter-spacing="-4">${escapeXml(project.title)}</text>
    <text x="1630" y="996" fill="#fff" fill-opacity=".72" font-family="Arial,Helvetica,sans-serif" font-size="12" letter-spacing="5">ENTER PROJECT</text>
    <circle cx="1790" cy="182" r="34" fill="#05080c" fill-opacity=".45" stroke="#fff" stroke-opacity=".24"/><text x="1790" y="192" text-anchor="middle" fill="#fff" font-family="Arial" font-size="28">↗</text>
  `);
}

const voidFrame = () => base(`<circle cx="960" cy="540" r="4" fill="#fff" opacity=".05"/><circle cx="960" cy="540" r="140" fill="#0a1118" opacity=".4" filter="url(#soft)"/>`, false);

export async function GET(_request: Request, context: { params: { id: string } }) {
  const id = context.params.id;
  let svg: string | null = null;
  if (id === "void") svg = voidFrame();
  else if (id === "hub") svg = await hubFrame();
  else if (/^project-\d+$/.test(id)) svg = await projectFrame(Number(id.replace("project-", "")));
  else if (/^\d+$/.test(id)) svg = await projectFrame(Number(id));

  if (!svg) return new Response("Not found", { status: 404 });
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" } });
}
