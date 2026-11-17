"use client";
import { useEffect, useRef, useState } from "react";
import { createGlassRenderer, glassPositions } from "@/lib/refractive-glass";

export function BrandAtmosphere() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let renderer: ReturnType<typeof createGlassRenderer> = null;
    try { renderer = createGlassRenderer(element); } catch { return; }
    if (!renderer) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const phase = Math.random()*Math.PI*2;
    const start = performance.now();
    let frame = 0, visible = true;
    let width=element.clientWidth,height=element.clientHeight;
    const draw = (now: number) => {
      renderer!.draw(width,height,glassPositions(width,height,motion.matches?2:(now-start)/1000,phase));
      frame = !motion.matches && visible && !document.hidden ? requestAnimationFrame(draw) : 0;
    };
    const resume=()=>{cancelAnimationFrame(frame);draw(performance.now());};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume();});
    const resize=new ResizeObserver(()=>{
      width=element.clientWidth;height=element.clientHeight;resume();
    });
    observer.observe(element);resize.observe(element);
    motion.addEventListener("change",resume);document.addEventListener("visibilitychange",resume);
    const lost=(event:Event)=>{event.preventDefault();cancelAnimationFrame(frame);setReady(false);};
    element.addEventListener("webglcontextlost",lost);
    resume();setReady(true);
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();motion.removeEventListener("change",resume);document.removeEventListener("visibilitychange",resume);element.removeEventListener("webglcontextlost",lost);renderer?.dispose();};
  },[]);
  return <div className="brand-atmosphere" aria-hidden="true">
    <div className="brand-wash brand-wash-cyan"/><div className="brand-wash brand-wash-gold"/>
    {!ready && <><div className="brand-orbit brand-orbit-cyan"><div className="brand-lens"/></div><div className="brand-orbit brand-orbit-magenta"><div className="brand-lens"/></div></>}
    <canvas ref={canvas} className="refractive-glass-canvas" style={{opacity:ready?1:0}}/>
  </div>;
}
