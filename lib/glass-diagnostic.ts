import { inspectDomRefraction } from "./dom-refraction";
import { needsDomRefraction } from "./refractive-glass";

/** No network, storage or telemetry. Mounted outside the reflected source. */
export function mountGlassDiagnostic() {
  const panel=document.createElement("aside");
  panel.id="glass-device-diagnostic";
  panel.dir="rtl";
  panel.setAttribute("aria-label","אבחון זכוכית במכשיר");
  panel.style.cssText="position:fixed;bottom:12px;left:12px;right:12px;z-index:99999;max-height:42dvh;overflow:auto;padding:12px;border:1px solid #9ca3af;border-radius:12px;background:#fff;color:#17202a;font:14px/1.5 system-ui;box-shadow:0 4px 24px #0003";
  const title=document.createElement("strong");title.textContent="בדיקת זכוכית · נתוני המכשיר";
  const summary=document.createElement("div");
  const details=document.createElement("pre");
  details.dir="ltr";
  details.style.cssText="white-space:pre-wrap;overflow-wrap:anywhere;font:11px/1.4 monospace;margin:8px 0";
  const copy=document.createElement("button");
  copy.type="button";copy.textContent="העתקת הנתונים";
  copy.style.cssText="min-height:44px;padding:6px 12px;border:1px solid #64748b;border-radius:8px;background:#f1f5f9;color:#17202a;font:inherit";
  panel.append(title,summary,copy,details);document.body.append(panel);
  let snapshot="";
  function sample() {
    const receiver=document.querySelector("nav .liquid-navigation");
    const mirror=receiver?.querySelector<HTMLElement>(".liquid-navigation-mirror");
    const filter=receiver?.querySelector("filter");
    const data={
      diagnostic:"ios-glass-check-1",ua:navigator.userAgent,
      compatible:needsDomRefraction(),
      mounted:!!mirror,
      filter:mirror?getComputedStyle(mirror).filter:null,
      resource:filter?.id||null,
      transform:mirror?getComputedStyle(mirror).transform:null,
      lens:mirror?Array.from([mirror.getBoundingClientRect().x,mirror.getBoundingClientRect().y,mirror.clientWidth,mirror.clientHeight]):null,
      scroll:[scrollX,scrollY],
      viewport:visualViewport?{offsetTop:visualViewport.offsetTop,height:visualViewport.height,scale:visualViewport.scale}:null,
      reflection:mirror?inspectDomRefraction(mirror):null,
      menu:!!document.getElementById("mobile-navigation-menu"),
      menuReflection:(()=>{
        const host=document.querySelector<HTMLElement>("#mobile-navigation-menu .liquid-navigation-mirror");
        return host?inspectDomRefraction(host):null;
      })(),
    };
    snapshot=JSON.stringify(data,null,2);
    summary.textContent=`מסלול תאימות: ${data.compatible?"כן":"לא"} · שכבת תוכן: ${data.mounted?"קיימת":"חסרה"} · רכיבים: ${data.reflection?.nodes||0}`;
    details.textContent=snapshot;
  }
  const clicked=async()=>{
    try{await navigator.clipboard.writeText(snapshot);copy.textContent="הועתק — הדבק בשיחה";}
    catch{copy.textContent="אפשר לצלם את הנתונים";}
  };
  copy.addEventListener("click",clicked);
  sample();const timer=setInterval(sample,1500);
  return()=>{clearInterval(timer);copy.removeEventListener("click",clicked);panel.remove();};
}
