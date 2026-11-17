import { subscribeGlassFrames } from "./refractive-glass";

const shadowRoots = new WeakMap<HTMLElement, ShadowRoot>();

/** Read-only diagnostics, requested explicitly through ?glass-check=1. */
export function inspectDomRefraction(host: HTMLElement) {
  const shadow=shadowRoots.get(host);
  if(!shadow)return null;
  const box=(element:Element|null)=>{
    if(!element)return null;
    const r=element.getBoundingClientRect();
    return [r.x,r.y,r.width,r.height].map(value=>Math.round(value*10)/10);
  };
  return {
    nodes:shadow.querySelectorAll("*").length,
    stage:box(shadow.querySelector(".glass-source-stage")),
    sections:Array.from(shadow.querySelectorAll("section")).map(section=>({id:section.id,box:box(section)})),
    paint:Array.from(shadow.querySelectorAll("h1,h2,p,img")).filter(element=>{
      const rect=element.getBoundingClientRect(),lens=host.getBoundingClientRect();
      return rect.bottom>=lens.top&&rect.top<=lens.bottom;
    }).slice(0,3).map(element=>{
      const css=getComputedStyle(element);
      return {tag:element.tagName,box:box(element),opacity:css.opacity,visibility:css.visibility,display:css.display};
    }),
    styleBytes:shadow.querySelector("style")?.textContent?.length||0,
  };
}

/** Reflect only sections behind a lens into an inert shadow tree. WebKit can
 * displace this real DOM paint with an ordinary SVG filter, although its SVG
 * backdrop-filter is unsupported. The original controls stay on a sharp plane.
 */
export function mountDomRefraction(host: HTMLElement, options?: { receiver: Element|null; align: ()=>void }) {
  const source = document.getElementById("portfolio-site");
  if (!source) return () => {};
  host.inert = true;
  const shadow = shadowRoots.get(host) || host.attachShadow({ mode: "closed" });
  shadowRoots.set(host, shadow);
  const style = document.createElement("style");
  const styles = Array.from(document.styleSheets).map(sheet => {
    try { return Array.from(sheet.cssRules).map(rule => rule.cssText).join("\n"); }
    catch { return ""; }
  }).join("\n");
  // Real html/body elements have document-level paint behavior in WebKit.
  // Ordinary wrappers retain the selectors without creating a second body.
  style.textContent = styles
    .replace(/(^|[\s,>+~}])html(?=[\s,.#:\[\]>+~{])/g, "$1.glass-source-document")
    .replace(/(^|[\s,>+~}])body(?=[\s,.#:\[\]>+~{])/g, "$1.glass-source-body")
    .replace(/:root\b/g, ".glass-source-document")
    + "\n:host{display:block;pointer-events:none}.glass-source-stage{position:absolute;inset:0;overflow:hidden;contain:strict;clip-path:inset(0)}.glass-source-document,.glass-source-body{margin:0!important;padding:0!important}*{pointer-events:none!important}";
  // Bound the paint before filtering. Otherwise the entire tall gallery becomes
  // the SVG object bounding box, moving the displacement map away from the lens.
  const stage = document.createElement("div");
  stage.className = "glass-source-stage";
  const html = document.createElement("div"), body = document.createElement("div");
  body.className = `glass-source-body ${document.body.className}`;
  const root = source.cloneNode(false) as HTMLElement;
  const dim = document.createElement("div");
  dim.style.cssText = "position:absolute;inset:0;background:rgba(0,0,0,.2);z-index:100";
  root.append(dim); body.append(root); html.append(body); stage.append(html); shadow.append(style, stage);
  const copies = new WeakMap<Node, Node>();
  const receiver = options?.receiver || host.closest("nav") || host.closest("#mobile-navigation-menu");
  const sections = new Map<HTMLElement, { wrapper: HTMLElement; clone: HTMLElement }>();
  const canvases = new Map<HTMLCanvasElement, { clone: HTMLCanvasElement; rect: DOMRect }>();
  let frame = 0, disposed = false, lens = host.getBoundingClientRect();

  function cloneTree(node: Node): Node | null {
    if (node instanceof Element && /^(SCRIPT|NOSCRIPT|IFRAME|AUDIO|VIDEO)$/.test(node.tagName)) return null;
    const clone = node.cloneNode(false);
    copies.set(node, clone);
    if (node instanceof HTMLCanvasElement && clone instanceof HTMLCanvasElement) {
      canvases.set(node, { clone, rect: node.getBoundingClientRect() });
    }
    if (clone instanceof HTMLImageElement) clone.loading = "eager";
    for (const child of Array.from(node.childNodes)) {
      const childClone = cloneTree(child);
      if (childClone) clone.appendChild(childClone);
    }
    return clone;
  }

  function copyCanvas(canvas: HTMLCanvasElement) {
    const entry = canvases.get(canvas);
    if (!entry || disposed || document.hidden) return;
    const { clone, rect } = entry;
    if (!rect.width || !rect.height || !canvas.width || !canvas.height) return;
    if (clone.width !== canvas.width) clone.width = canvas.width;
    if (clone.height !== canvas.height) clone.height = canvas.height;
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    const left = Math.max(0, Math.floor((lens.left-52-rect.left)*sx));
    const top = Math.max(0, Math.floor((lens.top-52-rect.top)*sy));
    const right = Math.min(canvas.width, Math.ceil((lens.right+52-rect.left)*sx));
    const bottom = Math.min(canvas.height, Math.ceil((lens.bottom+52-rect.top)*sy));
    const ctx = clone.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, clone.width, clone.height);
    if (right > left && bottom > top) ctx.drawImage(canvas, left, top, right-left, bottom-top, left, top, right-left, bottom-top);
  }

  function forgetTree(node: Node) {
    copies.delete(node);
    if (node instanceof HTMLCanvasElement) canvases.delete(node);
    for (const child of Array.from(node.childNodes)) forgetTree(child);
  }

  function refresh() {
    frame = 0;
    if (disposed) return;
    options?.align();
    lens = host.getBoundingClientRect();
    const sourceWidth = source!.clientWidth;
    const sourceRects = Array.from(source!.children)
      .filter((section): section is HTMLElement => section instanceof HTMLElement && section.tagName === "SECTION")
      .map(section => ({ section, rect: section.getBoundingClientRect() }));
    for (const [canvas, entry] of Array.from(canvases)) entry.rect = canvas.getBoundingClientRect();
    const overlay = source!.querySelector<HTMLElement>("[data-navigation-overlay]");
    const overlayStyle = overlay && getComputedStyle(overlay);
    const dimVisible = !!overlayStyle && overlayStyle.display !== "none";
    const dimOpacity = overlayStyle?.opacity || "0";
    html.lang = document.documentElement.lang;
    html.dir = document.documentElement.dir;
    html.className = `glass-source-document ${document.documentElement.className}`;
    html.style.cssText = `position:absolute;left:${-lens.left}px;top:${-lens.top}px;width:${sourceWidth}px;height:${innerHeight}px`;
    root.className = source!.className;
    root.style.cssText = `position:relative;width:${sourceWidth}px;height:${innerHeight}px`;
    dim.hidden = !dimVisible;
    dim.style.opacity = dimOpacity;
    const active = new Set<HTMLElement>();
    for (const { section, rect } of sourceRects) {
      if (rect.bottom < lens.top-52 || rect.top > lens.bottom+52) continue;
      active.add(section);
      let entry = sections.get(section);
      if (!entry) {
        const wrapper = document.createElement("div"), clone = cloneTree(section) as HTMLElement;
        wrapper.append(clone); root.insertBefore(wrapper, dim);
        entry = { wrapper, clone }; sections.set(section, entry);
      }
      entry.wrapper.style.cssText = `position:absolute;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`;
      entry.clone.style.height = `${rect.height}px`;
    }
    for (const [section, entry] of Array.from(sections)) if (!active.has(section)) {
      entry.wrapper.remove(); sections.delete(section);
      forgetTree(section);
    }
    for (const canvas of Array.from(canvases.keys())) copyCanvas(canvas);
  }
  function schedule() { if (!frame && !disposed) frame = requestAnimationFrame(refresh); }
  function refreshNow() { cancelAnimationFrame(frame); refresh(); }
  const mutations = new MutationObserver(records => {
    let receiverMoved = false;
    for (const record of records) {
      const copy = copies.get(record.target);
      if (!copy) {
        if (record.target === receiver || (record.target instanceof Element && record.target.hasAttribute("data-navigation-overlay"))) receiverMoved = true;
        else if (record.target === source) schedule();
        continue;
      }
      if (record.type === "characterData") copy.textContent = record.target.textContent;
      else if (record.type === "attributes" && record.target instanceof Element && copy instanceof Element) {
        const name = record.attributeName!, value = record.target.getAttributeNS(record.attributeNamespace, name);
        if (copy.getAttributeNS(record.attributeNamespace, name) === value) continue;
        if (value === null) copy.removeAttributeNS(record.attributeNamespace, name);
        else copy.setAttributeNS(record.attributeNamespace, name, value);
        if (record.target.tagName === "SECTION") schedule();
      } else if (record.type === "childList") {
        for (const removed of Array.from(record.removedNodes)) {
          const child = copies.get(removed); child?.parentNode?.removeChild(child);
          forgetTree(removed);
        }
        const next = record.nextSibling && copies.get(record.nextSibling);
        for (const added of Array.from(record.addedNodes)) {
          const child = cloneTree(added);
          if (child) copy.insertBefore(child, next?.parentNode === copy ? next : null);
        }
      }
    }
    // Motion writes the receiver transform in the current frame. Compensate
    // before paint, rather than leaving the reflection one animation frame late.
    if (receiverMoved) refreshNow();
  });
  mutations.observe(source, { subtree: true, childList: true, characterData: true, attributes: true });
  const language = new MutationObserver(schedule);
  language.observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "dir", "class"] });
  const resize = new ResizeObserver(entries => {
    if (entries.some(entry => entry.target === receiver)) refreshNow();
    else schedule();
  });
  resize.observe(source);
  if (receiver) resize.observe(receiver, { box: "border-box" });
  for (const section of Array.from(source.children)) if (section.tagName === "SECTION") resize.observe(section);
  const unsubscribe = subscribeGlassFrames(copyCanvas);
  const reflectInput = (event: Event) => {
    const original = event.target, copy = original instanceof Node && copies.get(original);
    if ((original instanceof HTMLInputElement || original instanceof HTMLTextAreaElement || original instanceof HTMLSelectElement) &&
        (copy instanceof HTMLInputElement || copy instanceof HTMLTextAreaElement || copy instanceof HTMLSelectElement)) copy.value = original.value;
  };
  source.addEventListener("input", reflectInput);
  window.addEventListener("scroll", schedule, { passive: true, capture: true });
  window.addEventListener("resize", schedule);
  visualViewport?.addEventListener("resize", schedule);
  visualViewport?.addEventListener("scroll", schedule);
  refresh();
  return () => {
    disposed = true; cancelAnimationFrame(frame); mutations.disconnect(); language.disconnect(); resize.disconnect(); unsubscribe();
    source.removeEventListener("input", reflectInput); window.removeEventListener("scroll", schedule, true); window.removeEventListener("resize", schedule);
    visualViewport?.removeEventListener("resize", schedule); visualViewport?.removeEventListener("scroll", schedule);
    canvases.clear(); sections.clear(); shadow.replaceChildren();
  };
}
