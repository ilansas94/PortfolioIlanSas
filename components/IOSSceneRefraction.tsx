"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

type MapData = { src: string; width: number; height: number };
const cache = new Map<string, MapData>();
const SCALE = 36;

function isIOSWebKit() {
  const ua = navigator.userAgent;
  return /AppleWebKit/i.test(ua) &&
    (/(iPhone|iPad|iPod)/i.test(ua) ||
     (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
}

/** Displacement is limited to the rounded glass bezel. Everywhere else the
 * map is neutral (R=128,G=128), so the site remains visually unchanged.
 */
function makeMap(width: number, height: number): MapData {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const key = w + ":" + h;
  const cached = cache.get(key);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  const pixels = ctx.createImageData(w, h);
  const r = Math.min(24, h * 0.47);
  const edge = Math.min(21, h * 0.33);
  const sdf = (x: number, y: number) => {
    const qx = Math.abs(x - w/2) - (w/2 - r);
    const qy = Math.abs(y - h/2) - (h/2 - r);
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
      Math.min(Math.max(qx, qy), 0) - r;
  };
  for (let y=0;y<h;y++)for(let x=0;x<w;x++) {
    const i=(y*w+x)*4;
    const inside=-sdf(x+.5,y+.5);
    let dx=0,dy=0;
    if (inside>=0 && inside<edge) {
      let nx=sdf(x+1.5,y+.5)-sdf(x-.5,y+.5);
      let ny=sdf(x+.5,y+1.5)-sdf(x+.5,y-.5);
      const length=Math.hypot(nx,ny)||1;
      nx/=length;ny/=length;
      const amount=15*Math.pow(1-inside/edge,1.75);
      dx=nx*amount;dy=ny*amount;
    }
    pixels.data[i]=Math.max(0,Math.min(255,Math.round(128+dx/SCALE*255)));
    pixels.data[i+1]=Math.max(0,Math.min(255,Math.round(128+dy/SCALE*255)));
    pixels.data[i+2]=128;
    pixels.data[i+3]=255;
  }
  ctx.putImageData(pixels,0,0);
  const result={src:canvas.toDataURL("image/png"),width:w,height:h};
  if(cache.size>=5)cache.delete(cache.keys().next().value!);
  cache.set(key,result);
  return result;
}

/** Opt-in WebKit experiment: refract the actual painted scene with a normal
 * SVG CSS filter (which Safari supports), not a backdrop-filter SVG reference
 * (which Safari ignores). No DOM cloning, screenshots, or GPU readbacks.
 */
export function IOSSceneRefraction({children}:{children:ReactNode}) {
  const id="ios-scene-lens-"+useId().replace(/[^a-zA-Z0-9]/g,"");
  const sceneRef=useRef<HTMLDivElement>(null);
  const feImageRef=useRef<SVGFEImageElement>(null);
  const [enabled,setEnabled]=useState(false);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    setEnabled(isIOSWebKit() &&
      params.get("glass-pixels")==="1" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  },[]);

  useEffect(()=>{
    const scene=sceneRef.current, image=feImageRef.current;
    if(!enabled||!scene||!image)return;
    let disposed=false,raf=0,entranceFrame=0,version=0,lastSize="",lastPosition="";
    const navigation=()=>document.querySelector<HTMLElement>(
      "nav .liquid-navigation:not(.liquid-menu-panel)"
    );
    const sync=()=>{
      if(disposed)return;
      const nav=navigation();
      if(!nav)return;
      const bar=nav.getBoundingClientRect();
      const stage=scene.getBoundingClientRect();
      if(bar.width<20||bar.height<20||stage.width<20)return;
      const w=Math.round(bar.width),h=Math.round(bar.height);
      const size=w+":"+h;
      const x=Math.round((bar.left-stage.left)*100)/100;
      const y=Math.round((bar.top-stage.top)*100)/100;
      const position=x+":"+y;
      if(position!==lastPosition){
        lastPosition=position;
        image.setAttribute("x",String(x));
        image.setAttribute("y",String(y));
      }
      if(size===lastSize)return;
      lastSize=size;
      const current=++version;
      try{
        const map=makeMap(w,h);
        const preload=new Image();
        preload.onload=()=>{
          if(disposed||version!==current)return;
          image.setAttribute("width",String(map.width));
          image.setAttribute("height",String(map.height));
          image.setAttribute("href",map.src);
          requestAnimationFrame(()=>requestAnimationFrame(()=>{
            if(disposed||version!==current)return;
            scene.style.filter='url("#'+id+'")';
            scene.setAttribute("data-ios-filter-enabled","on");
            document.body.setAttribute("data-ios-pixel-refraction","on");
          }));
        };
        preload.onerror=()=>{if(!disposed)scene.style.filter="";};
        preload.src=map.src;
      }catch{
        scene.style.filter="";
      }
    };
    const schedule=()=>{
      if(raf)return;
      raf=requestAnimationFrame(()=>{raf=0;sync();});
    };
    const observer=new ResizeObserver(schedule);
    observer.observe(scene);
    const nav=navigation();
    if(nav)observer.observe(nav);
    window.addEventListener("scroll",schedule,{passive:true});
    window.addEventListener("resize",schedule);
    window.addEventListener("orientationchange",schedule);
    const vp=window.visualViewport;
    vp?.addEventListener("scroll",schedule,{passive:true});
    vp?.addEventListener("resize",schedule);
    const started=performance.now();
    const entrance=()=>{
      sync();
      if(performance.now()-started<850)entranceFrame=requestAnimationFrame(entrance);
    };
    entrance();
    return()=>{
      disposed=true;
      version++;
      observer.disconnect();
      window.removeEventListener("scroll",schedule);
      window.removeEventListener("resize",schedule);
      window.removeEventListener("orientationchange",schedule);
      vp?.removeEventListener("scroll",schedule);
      vp?.removeEventListener("resize",schedule);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(entranceFrame);
      scene.style.filter="";
      document.body.removeAttribute("data-ios-pixel-refraction");
    };
  },[enabled,id]);

  return <>
    {enabled&&<svg width="0" height="0" aria-hidden="true" focusable="false"
      style={{position:"absolute",pointerEvents:"none"}}>
      <defs>
        <filter id={id} filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse"
          x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
          <feFlood floodColor="#808080" floodOpacity="1" result="neutral"/>
          <feImage ref={feImageRef} x="0" y="0" width="1" height="1"
            preserveAspectRatio="none" result="lens"/>
          <feComposite in="lens" in2="neutral" operator="over" result="map"/>
          <feDisplacementMap in="SourceGraphic" in2="map" scale={SCALE}
            xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    </svg>}
    <div ref={sceneRef} id="ios-scene-surface" data-ios-filter-enabled="off">{children}</div>
  </>;
}
