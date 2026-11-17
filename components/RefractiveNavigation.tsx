"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { mountDomRefraction } from "@/lib/dom-refraction";
import { needsDomRefraction } from "@/lib/refractive-glass";

/** Encodes a rounded glass bezel's Snell displacement into R/G channels.
 * The native backdrop filter bends the real page behind the bar. Navigation
 * labels live on a separate plane and remain sharp, selectable and interactive.
 */
type BezelMap = { src: string; width: number; height: number; scale: number };
const bezelCache = new Map<string, BezelMap>();

function makeBezel(width: number, height: number): BezelMap {
  const key=`${width}:${height}`;
  const cached=bezelCache.get(key);
  if(cached)return cached;
  const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext("2d")!;const image=ctx.createImageData(width,height);
  const radius=Math.min(24,height/2),bevel=Math.min(24,height*.35),scale=52;
  // The flat middle and all pixels outside the lens have the same neutral
  // displacement. Fill them once and only calculate the curved edge bands.
  for(let k=0;k<image.data.length;k+=4){image.data[k]=128;image.data[k+1]=128;image.data[k+2]=128;image.data[k+3]=255;}
  const padding=Math.ceil(Math.max(radius,bevel));
  const sdf=(x:number,y:number)=>{
    const qx=Math.abs(x-width/2)-(width/2-radius),qy=Math.abs(y-height/2)-(height/2-radius);
    return Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-radius;
  };
  const profile=(u:number)=>Math.sqrt(Math.max(.000001,1-Math.pow(1-Math.max(0,Math.min(1,u)),2)));
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    if(y>=padding&&y<height-padding&&x>=padding&&x<width-padding){x=width-padding-1;continue;}
    const k=(y*width+x)*4,d=-sdf(x+.5,y+.5);let dx=0,dy=0;
    if(d>0&&d<bevel){
      const u=d/bevel,eps=.002;
      const slope=(profile(u+eps)-profile(u-eps))/(2*eps)*12/bevel;
      let nx=sdf(x+1,y)-sdf(x-1,y),ny=sdf(x,y+1)-sdf(x,y-1);
      const length=Math.hypot(nx,ny)||1;nx/=length;ny/=length;
      const nz=1/Math.sqrt(1+slope*slope),radial=slope*nz,eta=1/1.46;
      const bend=eta*nz-Math.sqrt(1-eta*eta*(1-nz*nz));
      const tz=-eta-bend*nz,depth=30+profile(u)*12;
      dx=bend*nx*radial/Math.max(.12,-tz)*depth;
      dy=bend*ny*radial/Math.max(.12,-tz)*depth;
    }
    image.data[k]=Math.max(0,Math.min(255,Math.round((.5+dx/scale)*255)));
    image.data[k+1]=Math.max(0,Math.min(255,Math.round((.5+dy/scale)*255)));
    image.data[k+2]=128;image.data[k+3]=255;
  }
  ctx.putImageData(image,0,0);
  const map={src:canvas.toDataURL(),width,height,scale};
  if(bezelCache.size>=8)bezelCache.delete(bezelCache.keys().next().value!);
  bezelCache.set(key,map);
  return map;
}

function positionGlassPlane(plane: HTMLDivElement, element: HTMLDivElement) {
  const rect=element.getBoundingClientRect();
  const values={left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,zIndex:element.closest("nav")?"49":"39"};
  for(const property of Object.keys(values) as Array<keyof typeof values>){
    if(plane.style[property]!==values[property])plane.style[property]=values[property];
  }
}

export function RefractiveNavigation({children,className=""}:{children:ReactNode;className?:string}) {
  const instanceId=`nav-lens-${useId().replace(/[^a-zA-Z0-9]/g,"")}`;
  const root=useRef<HTMLDivElement>(null);
  const mirror=useRef<HTMLDivElement>(null);
  const magnifier=useRef<HTMLDivElement>(null);
  const plane=useRef<HTMLDivElement>(null);
  const [detached,setDetached]=useState(false);
  const [magnify,setMagnify]=useState(false);
  const revision=useRef(0);
  const [compatible,setCompatible]=useState<boolean|null>(null);
  const [map,setMap]=useState<(BezelMap&{revision:number})|null>(null);
  // A filter resource must be immutable for its receiver's lifetime. In WebKit,
  // inserting/replacing a referenced filter while its receiver already exists
  // can leave a permanently unfiltered layer (webkit.org/b/61455).
  const id=map?`${instanceId}-${compatible?"dom":"backdrop"}-${map.revision}`:instanceId;
  const [readyResource,setReadyResource]=useState("");
  const mirrorReady=compatible===true&&map!==null&&readyResource===id;
  useEffect(()=>{
    // These engines parse SVG backdrop URLs but do not paint their refraction.
    setCompatible(needsDomRefraction());
    const params=new URLSearchParams(location.search);
    setDetached(params.get("glass-layer")==="detached");
    setMagnify(params.get("glass-engine")==="magnify");
  },[]);
  useEffect(()=>{
    // Establish non-zero source bounds before attaching the filter receiver.
    if(detached&&plane.current&&root.current)positionGlassPlane(plane.current,root.current);
  },[detached,map,compatible]);
  useEffect(()=>{
    if(!magnify||compatible!==true||!magnifier.current)return;
    // One precisely registered copy, rather than semi-transparent overlapping strips.
    const menu=className.includes("liquid-menu-panel");
    return mountDomRefraction(magnifier.current,{magnify:menu?{x:1.012,y:1.035}:{x:1.022,y:1.075}});
  },[magnify,compatible,className]);
  useEffect(()=>{
    if(magnify||!mirrorReady||!mirror.current)return;
    if(!detached)return mountDomRefraction(mirror.current);
    const element=root.current;
    if(!element)return;
    const receiver=element.closest("nav")||element.closest("#mobile-navigation-menu");
    const align=()=>{
      if(!plane.current)return;
      positionGlassPlane(plane.current,element);
    };
    return mountDomRefraction(mirror.current,{receiver,align});
  },[mirrorReady,map,detached,magnify]);
  useEffect(()=>{
    if(!compatible||!map)return;
    let disposed=false,first=0,second=0;
    const image=new Image();
    const loaded=()=>{
      if(disposed)return;
      // First register the SVG graph, then attach a fresh CSS filter receiver.
      // Do not create the receiver against a pending feImage or the old graph.
      first=requestAnimationFrame(()=>{
        second=requestAnimationFrame(()=>{if(!disposed)setReadyResource(id);});
      });
    };
    image.onload=loaded;
    image.src=map.src;
    return()=>{disposed=true;image.onload=null;cancelAnimationFrame(first);cancelAnimationFrame(second);};
  },[compatible,map,id]);
  useEffect(()=>{
    const element=root.current;if(!element)return;
    let frame=0,last="";
    const update=()=>{
      const {width,height}=element.getBoundingClientRect();
      const key=`${Math.round(width)}:${Math.round(height)}`;
      if(key===last||width<1||height<1)return;last=key;
      setMap({...makeBezel(Math.round(width),Math.round(height)),revision:++revision.current});
    };
    const resize=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);});
    resize.observe(element);update();return()=>{resize.disconnect();cancelAnimationFrame(frame);};
  },[]);
  const definitions=
    <svg key={id} className="liquid-navigation-defs" width="1" height="1" aria-hidden="true" focusable="false">
      <defs>{map&&compatible!==null&&<filter id={id} x="0" y="0" width={compatible?1:"100%"} height={compatible?1:"100%"}
        filterUnits="objectBoundingBox" primitiveUnits={compatible?"objectBoundingBox":"userSpaceOnUse"} colorInterpolationFilters="sRGB">
        <feImage href={map.src} x="0" y="0" width={compatible?1:map.width} height={compatible?1:map.height} preserveAspectRatio="none" result="bezel"/>
        {compatible?<>
          {/* Normalize each axis separately to retain the original map's pixel
              precision on a wide bar. The bounded source stage makes this local
              box independent of document scroll and WebKit platform offsets. */}
          <feColorMatrix in="bezel" type="matrix" values="1 0 0 0 0  0 0 0 0 .5019607843137255  0 0 0 0 .5  0 0 0 0 1" result="horizontal"/>
          <feDisplacementMap in="SourceGraphic" in2="horizontal" scale={map.scale/map.width} xChannelSelector="R" yChannelSelector="G" result="horizontalBend"/>
          <feOffset in="horizontalBend" dx={map.scale/map.width/510} dy={map.scale/map.width/510} result="horizontalAligned"/>
          <feColorMatrix in="bezel" type="matrix" values="0 0 0 0 .5019607843137255  0 1 0 0 0  0 0 0 0 .5  0 0 0 0 1" result="vertical"/>
          <feDisplacementMap in="horizontalAligned" in2="vertical" scale={map.scale/map.height} xChannelSelector="R" yChannelSelector="G" result="verticalBend"/>
          <feOffset in="verticalBend" dx={map.scale/map.height/510} dy={map.scale/map.height/510}/>
        </>:<feDisplacementMap in="SourceGraphic" in2="bezel" scale={map.scale} xChannelSelector="R" yChannelSelector="G"/>}
      </filter>}</defs>
    </svg>;
  const reflection=mirrorReady&&!magnify&&<div className="liquid-navigation-mirror-clip" aria-hidden="true">
    <div key={id} id={`${instanceId}-mirror`} ref={mirror} className="liquid-navigation-mirror" style={{filter:`url("#${id}") saturate(1.12)`}}/>
  </div>;
  const useMagnify=magnify&&compatible===true;
  const usePlane=detached&&compatible===true&&!useMagnify;
  return <div ref={root} data-glass-reflection={`${instanceId}-mirror`} data-glass-layer={usePlane?"detached":"inline"} data-glass-engine={useMagnify?"magnify":compatible?"dom":"backdrop"} className={`liquid-navigation ${mirrorReady&&!useMagnify?"has-dom-refraction":""} ${useMagnify?"glass-magnify-active":""} ${className}`}>
    {usePlane?createPortal(<div ref={plane} className="liquid-navigation-detached" aria-hidden="true">{definitions}{reflection}</div>,document.body):<>{definitions}{reflection}</>}
    {useMagnify&&<div className="glass-magnifier-clip" aria-hidden="true">
      <div ref={magnifier} className="glass-magnifier-source"/>
    </div>}
    <div className="liquid-navigation-material" aria-hidden="true" style={map&&compatible===false?{backdropFilter:`url("#${id}") saturate(1.12)`}:undefined}/>
    {useMagnify&&<div className="glass-magnifier-highlight" aria-hidden="true"/>}
    <div className="liquid-navigation-content">{children}</div>
  </div>;
}
