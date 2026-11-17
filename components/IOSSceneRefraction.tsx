"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

type MapData={src:string;width:number;height:number};
const mapCache=new Map<string,MapData>();
const SCALE=36;
const SLOTS=8;
const MAX_HEIGHT=2300;

function isIOSWebKit(){
 const ua=navigator.userAgent;
 return /AppleWebKit/i.test(ua)&&(/iPhone|iPad|iPod/i.test(ua)||
  (navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1));
}

function makeMap(width:number,height:number):MapData{
 const w=Math.max(1,Math.round(width)),h=Math.max(1,Math.round(height));
 const key=w+":"+h;
 const cached=mapCache.get(key);if(cached)return cached;
 const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas 2D unavailable");
 const pixels=ctx.createImageData(w,h);
 const radius=Math.min(24,h*.47),bevel=Math.min(21,h*.33);
 const sdf=(x:number,y:number)=>{
  const qx=Math.abs(x-w/2)-(w/2-radius),qy=Math.abs(y-h/2)-(h/2-radius);
  return Math.hypot(Math.max(qx,0),Math.max(qy,0))+
   Math.min(Math.max(qx,qy),0)-radius;
 };
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const index=(y*w+x)*4,inside=-sdf(x+.5,y+.5);
  let dx=0,dy=0;
  if(inside>=0&&inside<bevel){
   let nx=sdf(x+1.5,y+.5)-sdf(x-.5,y+.5);
   let ny=sdf(x+.5,y+1.5)-sdf(x+.5,y-.5);
   const norm=Math.hypot(nx,ny)||1;nx/=norm;ny/=norm;
   const amount=15*Math.pow(1-inside/bevel,1.75);
   dx=nx*amount;dy=ny*amount;
  }
  pixels.data[index]=Math.max(0,Math.min(255,Math.round(128+dx/SCALE*255)));
  pixels.data[index+1]=Math.max(0,Math.min(255,Math.round(128+dy/SCALE*255)));
  pixels.data[index+2]=128;pixels.data[index+3]=255;
 }
 ctx.putImageData(pixels,0,0);
 const result={src:canvas.toDataURL("image/png"),width:w,height:h};
 if(mapCache.size>=5)mapCache.delete(mapCache.keys().next().value!);
 mapCache.set(key,result);return result;
}

/** Preview-only native-content refraction.
 * Safari supports normal SVG filters on original DOM content, even though
 * SVG *backdrop* filters are unsupported. Rather than filtering a 15,000px
 * page into one enormous WebKit layer (blank / OOM), filter only short,
 * currently intersecting visual subtrees, each with its own coordinate map.
 * The actual page is never cloned, screen-captured, or uploaded to WebGL.
 */
export function IOSSceneRefraction({children}:{children:ReactNode}){
 const id="ios-source-lens-"+useId().replace(/[^a-zA-Z0-9]/g,"");
 const rootRef=useRef<HTMLDivElement>(null);
 const imagesRef=useRef<Array<SVGFEImageElement|null>>([]);
 const [enabled,setEnabled]=useState(false);
 const [map,setMap]=useState<MapData|null>(null);

 useEffect(()=>{
  const params=new URLSearchParams(location.search);
  setEnabled(isIOSWebKit()&&params.get("glass-pixels")==="1"&&
   !matchMedia("(prefers-reduced-motion: reduce)").matches);
 },[]);

 useEffect(()=>{
  if(!enabled)return;
  let frame=0;
  const nav=()=>document.querySelector<HTMLElement>(
   "nav .liquid-navigation:not(.liquid-menu-panel)"
  );
  const measure=()=>{
   frame=0;
   const r=nav()?.getBoundingClientRect();
   if(r&&r.width>=40&&r.height>=20)try{
    const next=makeMap(r.width,r.height);
    setMap(old=>old?.width===next.width&&old.height===next.height?old:next);
   }catch{}
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  const resize=new ResizeObserver(schedule);
  const n=nav();if(n)resize.observe(n);
  window.addEventListener("resize",schedule);
  window.addEventListener("orientationchange",schedule);
  measure();
  return()=>{
   resize.disconnect();window.removeEventListener("resize",schedule);
   window.removeEventListener("orientationchange",schedule);
   cancelAnimationFrame(frame);
  };
 },[enabled]);

 useEffect(()=>{
  if(!enabled||!map||!rootRef.current)return;
  const root=rootRef.current;
  let disposed=false,frame=0,enterFrame=0,ready=false;
  const assigned=new Map<HTMLElement,number>();
  const original=new Map<HTMLElement,string>();

  const nav=()=>document.querySelector<HTMLElement>(
   "nav .liquid-navigation:not(.liquid-menu-panel)"
  );
  const restore=(element:HTMLElement)=>{
   element.style.filter=original.get(element)||"";
   element.removeAttribute("data-ios-refraction-slot");
   original.delete(element);assigned.delete(element);
  };
  const update=()=>{
   if(disposed||!ready)return;
   const bar=nav()?.getBoundingClientRect();
   if(!bar||bar.width<20||bar.height<20)return;
   const candidates:HTMLElement[]=[];
   const top=bar.top-18,bottom=bar.bottom+18;
   const descend=(element:HTMLElement,depth:number)=>{
    if(candidates.length>=SLOTS)return;
    const r=element.getBoundingClientRect();
    if(r.width<1||r.height<1||r.bottom<top||r.top>bottom)return;
    const children=Array.from(element.children)
      .filter((child):child is HTMLElement=>child instanceof HTMLElement);
    if(r.height<=MAX_HEIGHT||depth>=10||children.length===0){
     candidates.push(element);return;
    }
    for(const child of children)descend(child,depth+1);
   };
   for(const child of Array.from(root.children))
    if(child instanceof HTMLElement)descend(child,0);

   const next=new Set(candidates);
   for(const element of Array.from(assigned.keys()))
    if(!next.has(element))restore(element);
   const occupied=new Set(Array.from(assigned.values()));
   for(const element of candidates){
    let slot=assigned.get(element);
    if(slot===undefined){
     slot=Array.from({length:SLOTS},(_,i)=>i).find(i=>!occupied.has(i));
     if(slot===undefined)break;
     occupied.add(slot);
     original.set(element,element.style.filter);
     assigned.set(element,slot);
    }
    const image=imagesRef.current[slot];
    if(!image)continue;
    const bounds=element.getBoundingClientRect();
    const x=Math.round((bar.left-bounds.left)*100)/100;
    const y=Math.round((bar.top-bounds.top)*100)/100;
    if(image.getAttribute("x")!==String(x))image.setAttribute("x",String(x));
    if(image.getAttribute("y")!==String(y))image.setAttribute("y",String(y));
    element.style.filter='url("#'+id+"-"+slot+'")';
    element.setAttribute("data-ios-refraction-slot",String(slot));
   }
   if(assigned.size){
    document.body.setAttribute("data-ios-pixel-refraction","on");
    root.dataset.iosFilterEnabled="on";
   }else{
    document.body.removeAttribute("data-ios-pixel-refraction");
    root.dataset.iosFilterEnabled="off";
   }
  };
  const schedule=()=>{
   if(frame)return;
   frame=requestAnimationFrame(()=>{frame=0;update();});
  };
  const preload=new Image();
  preload.onload=()=>{
   if(disposed)return;
   requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(disposed)return;
    ready=true;update();
   }));
  };
  preload.src=map.src;

  const resize=new ResizeObserver(schedule);
  resize.observe(root);
  const n=nav();if(n)resize.observe(n);
  window.addEventListener("scroll",schedule,{passive:true});
  window.addEventListener("resize",schedule);
  window.addEventListener("orientationchange",schedule);
  const vp=window.visualViewport;
  vp?.addEventListener("scroll",schedule,{passive:true});
  vp?.addEventListener("resize",schedule);

  const start=performance.now();
  const followEntrance=()=>{
   update();
   if(performance.now()-start<850)enterFrame=requestAnimationFrame(followEntrance);
  };
  enterFrame=requestAnimationFrame(followEntrance);

  return()=>{
   disposed=true;
   resize.disconnect();
   window.removeEventListener("scroll",schedule);
   window.removeEventListener("resize",schedule);
   window.removeEventListener("orientationchange",schedule);
   vp?.removeEventListener("scroll",schedule);
   vp?.removeEventListener("resize",schedule);
   cancelAnimationFrame(frame);cancelAnimationFrame(enterFrame);
   for(const element of Array.from(assigned.keys()))restore(element);
   document.body.removeAttribute("data-ios-pixel-refraction");
   root.dataset.iosFilterEnabled="off";
  };
 },[enabled,map,id]);

 return <>
  {enabled&&map&&<svg width="0" height="0" aria-hidden="true"
   style={{position:"absolute",pointerEvents:"none"}}>
   <defs>{Array.from({length:SLOTS},(_,i)=><filter key={i}
    id={id+"-"+i} filterUnits="objectBoundingBox"
    primitiveUnits="userSpaceOnUse" x="0" y="0" width="1" height="1"
    colorInterpolationFilters="sRGB">
    <feFlood floodColor="#808080" floodOpacity="1" result="neutral"/>
    <feImage ref={el=>{imagesRef.current[i]=el;}}
     href={map.src} x="0" y="0" width={map.width} height={map.height}
     preserveAspectRatio="none" result="lens"/>
    <feComposite in="lens" in2="neutral" operator="over" result="map"/>
    <feDisplacementMap in="SourceGraphic" in2="map" scale={SCALE}
     xChannelSelector="R" yChannelSelector="G"/>
   </filter>)}</defs>
  </svg>}
  <div ref={rootRef} id="ios-scene-surface"
   data-ios-filter-enabled="off">{children}</div>
 </>;
}
