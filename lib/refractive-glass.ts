/** Decorative lens renderer. Snell refraction samples the rear lens at bent ray
 * coordinates, rather than painting a multiply-blended intersection. No DOM text
 * is rasterised or distorted. See the optical study for a calibration grid.
 */
export const GLASS_FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform vec3 uBubbles[9];
uniform float uStrength;
uniform float uGrid;
const vec3 CYAN=vec3(.20,.537,.635);
const vec3 MAGENTA=vec3(.776,.247,.439);
const vec3 GOLD=vec3(.996,.863,.20);
float sd(vec2 p,vec3 b){return length(p-b.xy)-b.z;}
float coverage(float d){return 1.-smoothstep(-.7,.7,d);}
float smin(float a,float b,float k){float h=max(k-abs(a-b),0.)/k;return min(a,b)-h*h*k*.25;}
vec3 paper(vec2 p){
 vec3 c=vec3(.99216,.98824,.97647);
 c=mix(c,vec3(.92,.96,.96),.19*exp(-dot(p/uResolution-vec2(.01,.2),p/uResolution-vec2(.01,.2))*6.));
 if(uGrid>.5){
  vec2 g=abs(mod(p+12.,24.)-12.);
  float line=1.-smoothstep(.4,1.1,min(g.x,g.y));
  c=mix(vec3(.95,.97,.96),vec3(.38,.52,.54),line*.60);
 }
 return c;
}
vec3 normalAt(vec2 p,vec3 b){
 vec2 v=(p-b.xy)/b.z;float rr=dot(v,v);
 // A shallow convex centre plus a steep bevel: a lens, not an opaque sphere.
 float z=sqrt(max(.003,1.-min(rr,.997)));
 float bevel=pow(smoothstep(.64,1.,sqrt(rr)),3.);
 return normalize(vec3(v*(.38+.42*bevel)/z,1.));
}
vec2 bend(vec2 p,vec3 b,float extra){
 vec3 n=normalAt(p,b);
 vec3 ray=refract(vec3(0.,0.,-1.),n,1./1.46);
 return ray.xy/max(.12,-ray.z)*(b.z*.93+extra)*uStrength;
}
vec3 material(vec3 behind,vec2 p,vec3 b,vec3 tint,float thickness){
 float r=length(p-b.xy)/b.z;
 vec3 n=normalAt(p,b);
 // Beer-Lambert absorption leaves the centre clear. Colour gathers at the edge.
 float opticalDepth=(.055+.14*pow(clamp(r,0.,1.),3.))*thickness;
 vec3 transmitted=behind*exp(-(vec3(1.)-tint)*opticalDepth);
 float fresnel=.035+.965*pow(1.-n.z,5.);
 vec3 reflected=reflect(vec3(0.,0.,-1.),n);
 float strip=pow(max(0.,dot(reflected,normalize(vec3(-.5,-.65,.65)))),90.);
 // Specular energy follows the changing surface normal, not a painted ellipse.
 vec3 c=mix(transmitted,vec3(1.),fresnel*.62)+vec3(strip*.16);
 return clamp(c,0.,1.);
}
vec3 rear(vec2 p,vec3 b,vec3 tint){
 float m=coverage(sd(p,b));
 vec2 q=p+bend(p,b,0.);
 return mix(paper(p),material(paper(q),p,b,tint,1.),m);
}
vec4 pair(vec2 p,vec3 back,vec3 front,vec3 backTint,vec3 frontTint){
 float db=sd(p,back),df=sd(p,front);
 float unionD=smin(db,df,20.);
 float m=coverage(unionD);
 if(m<=0.)return vec4(0.);
 float inBoth=coverage(db)*coverage(df);
 vec2 shift=bend(p,front,back.z*.48*inBoth);
 vec2 q=p+shift;
 // Dispersion separates RGB sampling very slightly at curved edges.
 vec3 refracted=vec3(rear(p+shift*1.015,back,backTint).r,rear(q,back,backTint).g,rear(p+shift*.985,back,backTint).b);
 vec3 c=mix(rear(p,back,backTint),material(refracted,p,front,frontTint,1.+inBoth*.35),coverage(df));
 // Surface reflection and the refracted rear lens define the edge naturally.
 // Do not draw a shared outline around the two overlapping surfaces.
 return vec4(c,m);
}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y);
 vec4 a=pair(p,uBubbles[0],uBubbles[1],CYAN,MAGENTA);
 vec4 b=pair(p,uBubbles[2],uBubbles[3],GOLD,CYAN);
 vec4 glass=a.a>b.a?a:b;
 // Smaller, independent lenses use their own radii and trajectories.
 for(int i=4;i<9;i++){
  vec3 bubble=uBubbles[i];float mask=coverage(sd(p,bubble));
  if(mask>glass.a){
   vec3 tint=i==5||i==8?GOLD:(i==6?MAGENTA:CYAN);
   vec3 c=material(paper(p+bend(p,bubble,0.)),p,bubble,tint,.85);
   glass=vec4(c,mask);
  }
 }
 if(uGrid>.5){gl_FragColor=vec4(mix(paper(p),glass.rgb,glass.a),1.);}
 else{gl_FragColor=vec4(glass.rgb*glass.a,glass.a);}
}`;

const frameListeners = new Set<(canvas: HTMLCanvasElement) => void>();
export function subscribeGlassFrames(listener: (canvas: HTMLCanvasElement) => void) {
  frameListeners.add(listener);
  return () => { frameListeners.delete(listener); };
}
export function publishGlassFrame(canvas: HTMLCanvasElement) { frameListeners.forEach(listener => listener(canvas)); }
export function needsDomRefraction() {
  const ua = navigator.userAgent;
  return (/AppleWebKit/.test(ua) && !/(?:Chrome|Chromium|Edg|OPR)\//.test(ua)) || /Firefox\//.test(ua);
}

export function createGlassRenderer(canvas: HTMLCanvasElement) {
  // Keep transparent edges in the compositor's native premultiplied format.
  const gl = canvas.getContext("webgl", {
    alpha: true, antialias: false, premultipliedAlpha: true, depth: false,
    // A mirrored surface must also sample a stationary/reduced-motion frame.
    preserveDrawingBuffer: needsDomRefraction()
  });
  if (!gl) return null;
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || "Glass shader compilation failed");
    }
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}");
  const fragment = compile(gl.FRAGMENT_SHADER, GLASS_FRAGMENT);
  const program = gl.createProgram()!;
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "Glass program link failed");
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, "p"); gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, "uResolution");
  const bubbles = gl.getUniformLocation(program, "uBubbles[0]");
  const strength = gl.getUniformLocation(program, "uStrength");
  const grid = gl.getUniformLocation(program, "uGrid");
  const scaledPositions = new Float32Array(27);
  const regions = [[0, 1], [2, 3], [4], [5], [6], [7], [8]];
  return {
    draw(width: number, height: number, positions: number[], refraction = 1, diagnostic = false) {
      // CSS-pixel coordinates keep the optical thickness constant across devices.
      const scale = Math.min(1, 1100 / width);
      const rw = Math.round(width * scale), rh = Math.round(height * scale);
      if (canvas.width !== rw || canvas.height !== rh) { canvas.width = rw; canvas.height = rh; }
      gl.viewport(0, 0, rw, rh); gl.useProgram(program);
      // Fragment coordinates are in render pixels; convert the optical scene too.
      gl.uniform2f(resolution, rw, rh);
      for (let i=0; i<scaledPositions.length; i++) scaledPositions[i]=positions[i]*scale;
      gl.uniform3fv(bubbles, scaledPositions);
      gl.uniform1f(strength, refraction); gl.uniform1f(grid, diagnostic ? 1 : 0);
      // Preserve the shader and resolution. Clear the old frame, then shade
      // only conservative lens bounds. The smooth union extends by at most
      // 5 render pixels; 8 also covers its antialiasing at every canvas scale.
      gl.disable(gl.SCISSOR_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (diagnostic) {
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        return;
      }
      gl.enable(gl.SCISSOR_TEST);
      for (const indices of regions) {
        let left=rw, right=0, top=rh, bottom=0;
        for (const i of indices) {
          const x=scaledPositions[i*3], y=scaledPositions[i*3+1], r=scaledPositions[i*3+2];
          left=Math.min(left,Math.floor(x-r-8)); right=Math.max(right,Math.ceil(x+r+8));
          top=Math.min(top,Math.floor(y-r-8)); bottom=Math.max(bottom,Math.ceil(y+r+8));
        }
        left=Math.max(0,left); right=Math.min(rw,right);
        top=Math.max(0,top); bottom=Math.min(rh,bottom);
        if (right<=left || bottom<=top) continue;
        gl.scissor(left,rh-bottom,right-left,bottom-top);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      gl.disable(gl.SCISSOR_TEST);
    },
    dispose() { gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment); }
  };
}

export function glassPositions(width: number, height: number, seconds: number, phase = 0) {
  const mobile = width < 640;
  // At UltraWide resolutions the original fixed-size lenses became too sparse
  // and their independent animation could separate the two refractive pairs.
  // Blend into tighter, slightly larger clusters only on wide desktop screens.
  const ultraWide = mobile ? 0 : Math.max(0, Math.min(1, (width - 1650) / 1450));
  const reach = mobile ? 32 : Math.min(75, width * .052);
  const leftBack = Math.min(150 + ultraWide * 42, width * .105);
  const leftFront = Math.min(112 + ultraWide * 34, width * .079);
  const rightBack = Math.min(135 + ultraWide * 38, width * .095);
  const rightFront = Math.min(105 + ultraWide * 32, width * .075);

  // Keep each glass pair in the same neighbourhood even on a 32:9 monitor.
  const leftX = width * (.025 + ultraWide * .073);
  const rightX = width * (.97 - ultraWide * .075);
  const gapRatio = .60 - ultraWide * .18;
  const leftGap = Math.min(width * .105, (leftBack + leftFront) * gapRatio);
  const rightGap = Math.min(width * .10, (rightBack + rightFront) * gapRatio);
  const leftY = height * .28;
  const rightY = height * .60;
  const bases = mobile
    ? [[-44, height * .08, 115], [10, height * .10, 88],
       [width + 30, height * .72, 100], [width - 8, height * .78, 76]]
    : [[leftX, leftY, leftBack],
       [leftX + leftGap, leftY + Math.min(height * .05, 70) * (1 - .45 * ultraWide), leftFront],
       [rightX, rightY, rightBack],
       [rightX - rightGap, rightY + Math.min(height * .07, 70) * (1 - .45 * ultraWide), rightFront]];

  const random = (i: number) => {
    const n = Math.sin(phase * 19.73 + i * 127.1) * 43758.5453;
    return n - Math.floor(n);
  };

  // Small atmospheric satellites join the larger lenses on 32:9 monitors
  // instead of being scattered across thousands of empty horizontal pixels.
  const regularSingles = [[width * .24, height * .14, 25],
    [width * .80, height * .23, 18],
    [width * .76, height * .88, 35],
    [width * .19, height * .78, 16],
    [width * .60, height * .09, 12]];
  const clusteredSingles = [[leftX + leftBack * .58, leftY - leftBack * .78, 25],
    [rightX - rightBack * .48, rightY - rightBack * .87, 18],
    [rightX - rightBack * .84, rightY + rightBack * .82, 35],
    [leftX + leftBack * .78, leftY + leftBack * .88, 16],
    [width * .60, height * .09, 12]];
  const singles = mobile
    ? [[width * .15, height * .40, 15], [width * .86, height * .28, 12],
       [width * .92, height * .92, 22], [width * .09, height * .86, 10],
       [width * .75, height * .045, 8]]
    : regularSingles.map(([x, y, size], i) => [
        x + (clusteredSingles[i][0] - x) * ultraWide,
        y + (clusteredSingles[i][1] - y) * ultraWide,
        size
      ]);

  return [...bases, ...singles].flatMap(([x, y, size], i) => {
    const seed = random(i + 1), offset = random(i + 21) * Math.PI * 2;
    const a = seconds * (.36 + seed * .43) + offset;
    const travel = i < 4 ? reach : (mobile ? 12 : 22);
    let dx = travel * (.72 * Math.cos(a) + .28 * Math.sin(a * .47 + offset));
    let dy = (i < 4 ? 38 : 17) * (.7 * Math.sin(a * .81 + offset) + .3 * Math.cos(a * 1.31));

    // Coupled pair drift guarantees the two large lenses keep overlapping,
    // while their small independent relative motion remains lively.
    if (i < 4 && ultraWide > 0) {
      const leader = i - (i % 2);
      const pairSeed = random(leader + 1);
      const pairOffset = random(leader + 21) * Math.PI * 2;
      const pairAngle = seconds * (.36 + pairSeed * .43) + pairOffset;
      const groupDx = travel * (.72 * Math.cos(pairAngle) + .28 * Math.sin(pairAngle * .47 + pairOffset));
      const groupDy = 38 * (.7 * Math.sin(pairAngle * .81 + pairOffset) + .3 * Math.cos(pairAngle * 1.31));
      dx = dx * (1 - ultraWide) + groupDx * ultraWide;
      dy = dy * (1 - ultraWide) + groupDy * ultraWide;
      if (i % 2) {
        dx += ultraWide * 9 * Math.sin(seconds * .42 + pairOffset);
        dy += ultraWide * 7 * Math.cos(seconds * .37 + pairOffset);
      }
    }
    return [x + dx, y + dy, size * (i < 4 ? 1 : .78 + random(i + 41) * .44)];
  });
}
