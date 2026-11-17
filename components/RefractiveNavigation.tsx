"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { mountDomRefraction } from "@/lib/dom-refraction";
import { needsDomRefraction } from "@/lib/refractive-glass";

/** Encodes a rounded glass bezel's Snell displacement into R/G channels.
 * The native backdrop filter bends the real page behind the bar. Navigation
 * labels live on a separate plane and remain sharp, selectable and interactive.
 */
function makeBezel(width: number, height: number) {
  const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext("2d")!;const image=ctx.createImageData(width,height);
  const radius=Math.min(24,height/2),bevel=Math.min(24,height*.35),scale=52;
  const sdf=(x:number,y:number)=>{
    const qx=Math.abs(x-width/2)-(width/2-radius),qy=Math.abs(y-height/2)-(height/2-radius);
    return Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-radius;
  };
  const profile=(u:number)=>Math.sqrt(Math.max(.000001,1-Math.pow(1-Math.max(0,Math.min(1,u)),2)));
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
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
  ctx.putImageData(image,0,0);return {src:canvas.toDataURL(),width,height,scale};
}

export function RefractiveNavigation({children,className=""}:{children:ReactNode;className?:string}) {
  const id=`nav-lens-${useId().replace(/[^a-zA-Z0-9]/g,"")}`;
  const root=useRef<HTMLDivElement>(null);
  const mirror=useRef<HTMLDivElement>(null);
  const [compatible,setCompatible]=useState(false);
  const [map,setMap]=useState<ReturnType<typeof makeBezel>|null>(null);
  useEffect(()=>{
    // These engines parse SVG backdrop URLs but do not paint their refraction.
    setCompatible(needsDomRefraction());
  },[]);
  useEffect(()=>{
    if(compatible&&mirror.current)return mountDomRefraction(mirror.current);
  },[compatible,map]);
  useEffect(()=>{
    const element=root.current;if(!element)return;
    let frame=0,last="";
    const update=()=>{
      const {width,height}=element.getBoundingClientRect();
      const key=`${Math.round(width)}:${Math.round(height)}`;
      if(key===last||width<1||height<1)return;last=key;
      setMap(makeBezel(Math.round(width),Math.round(height)));
    };
    const resize=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);});
    resize.observe(element);update();return()=>{resize.disconnect();cancelAnimationFrame(frame);};
  },[]);
  return <div ref={root} className={`liquid-navigation ${compatible?"has-dom-refraction":""} ${className}`}>
    <svg className="liquid-navigation-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>{map&&<filter id={id} x="0" y="0" width={compatible?map.width:"100%"} height={compatible?map.height:"100%"}
        filterUnits={compatible?"userSpaceOnUse":"objectBoundingBox"} colorInterpolationFilters="sRGB">
        <feImage href={map.src} x="0" y="0" width={map.width} height={map.height} preserveAspectRatio="none" result="bezel"/>
        <feDisplacementMap in="SourceGraphic" in2="bezel" scale={map.scale} xChannelSelector="R" yChannelSelector="G"/>
      </filter>}</defs>
    </svg>
    {compatible&&map&&<div className="liquid-navigation-mirror-clip" aria-hidden="true">
      <div key={map.src} ref={mirror} className="liquid-navigation-mirror" style={{filter:`url("#${id}") saturate(1.12)`}}/>
    </div>}
    <div className="liquid-navigation-material" aria-hidden="true" style={map&&!compatible?{backdropFilter:`url("#${id}") saturate(1.12)`}:undefined}/>
    <div className="liquid-navigation-content">{children}</div>
  </div>;
}
