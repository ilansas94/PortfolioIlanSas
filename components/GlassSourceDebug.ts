"use client";

/**
 * iOS-only, explicitly opt-in diagnostic overlay for the WebGL glass prototype.
 * Shows the actual input texture sent to WebGL, not a recreated CSS mock-up.
 * No telemetry or requests, and it is never mounted without ?glass-debug=1.
 */
type GlassRenderer = {
  buffer?: HTMLCanvasElement;
  options?: { maxDpr?: number };
  mode?: string;
};
export function mountGlassSourceDebug(renderer: GlassRenderer, lens: HTMLElement): () => void {
  if (document.getElementById("ios-glass-source-diagnostic")) return () => {};
  const shell = document.createElement("div");
  shell.id = "ios-glass-source-diagnostic";
  shell.setAttribute("dir", "rtl");
  shell.setAttribute("role", "status");
  shell.style.cssText = [
    "position:fixed","z-index:2147483647","left:10px","right:10px","bottom:8px",
    "background:#101b28ee","color:#fff","padding:10px","border-radius:14px",
    "border:1px solid #ffffff66","font:12px/1.45 system-ui,sans-serif",
    "box-shadow:0 10px 35px #0008","pointer-events:auto"
  ].join(";");
  const row = document.createElement("div");
  row.style.cssText = "display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:5px;";
  const heading = document.createElement("strong");
  heading.textContent = "בדיקת מקור הזכוכית — לא חלק מהאתר";
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "סגור";
  close.style.cssText = "padding:5px 10px;border-radius:7px;background:#35495e;color:#fff;border:1px solid #fff6;";
  row.append(heading, close);
  const explain = document.createElement("div");
  explain.textContent = "התמונה למטה היא מה שהמנוע מקבל לפני עיוות הזכוכית. השווה אותה לתפריט העליון.";
  explain.style.cssText = "font-size:11px;opacity:.92;margin-bottom:6px;";
  const canvas = document.createElement("canvas");
  canvas.width = 716;
  canvas.height = 128;
  canvas.style.cssText = "display:block;width:100%;height:64px;background:#fff;border-radius:8px;border:2px solid #ffba45;";
  const status = document.createElement("div");
  status.style.cssText = "font:11px/1.5 ui-monospace,monospace;direction:ltr;text-align:left;overflow-wrap:anywhere;margin-top:5px;";
  shell.append(row, explain, canvas, status);
  document.body.appendChild(shell);
  let active = true;
  const draw = () => {
    if (!active) return;
    const source = renderer.buffer;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const lensRect = lens.getBoundingClientRect();
    const svg = document.querySelector("#home .hero-logo svg");
    const svgRect = svg?.getBoundingClientRect();
    const svgOverlaps = !!svgRect && svgRect.bottom > lensRect.top && svgRect.top < lensRect.bottom;
    const imageCount = Array.from(document.querySelectorAll("img")).filter(el => {
      const r = el.getBoundingClientRect();
      return r.bottom > lensRect.top && r.top < lensRect.bottom;
    }).length;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let result = "NO_SOURCE_BUFFER";
    if (source?.width && source.height && lensRect.width > 0) {
      try {
        const scale = Math.min(devicePixelRatio || 1, renderer.options?.maxDpr ?? 1.6);
        const expectedWidth = lensRect.width * scale;
        const expectedHeight = lensRect.height * scale;
        const cropX = Math.max(0,(source.width-expectedWidth)/2);
        const cropY = Math.max(0,(source.height-expectedHeight)/2);
        const w = Math.min(source.width-cropX,expectedWidth);
        const h = Math.min(source.height-cropY,expectedHeight);
        ctx.drawImage(source,cropX,cropY,w,h,0,0,canvas.width,canvas.height);
        result = "SOURCE_OK";
      } catch (error) {
        result = "SOURCE_DRAW_ERROR:" + (error instanceof Error ? error.message : String(error));
      }
    }
    status.textContent = [
      result,
      "glass=" + (lens.getAttribute("data-liquid-glass") || "pending"),
      "buffer=" + (source ? source.width + "x" + source.height : "none"),
      "scroll=" + Math.round(scrollY),
      "SVGoverlap=" + svgOverlaps,
      "IMGoverlap=" + imageCount
    ].join(" | ");
  };
  const timer = window.setInterval(draw, 650);
  const onScroll = () => window.requestAnimationFrame(draw);
  window.addEventListener("scroll",onScroll,{passive:true});
  close.addEventListener("click",()=>cleanup());
  const cleanup = () => {
    if (!active) return;
    active = false;
    window.clearInterval(timer);
    window.removeEventListener("scroll",onScroll);
    shell.remove();
  };
  window.requestAnimationFrame(draw);
  return cleanup;
}
