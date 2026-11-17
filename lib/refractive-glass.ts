/** Decorative lens renderer. Snell refraction samples the rear lens at bent ray
 * coordinates, rather than painting a multiply-blended intersection. No DOM text
 * is rasterised or distorted. See the optical study for a calibration grid.
 */
export const GLASS_FRAGMENT = `
precision highp float;
uniform vec2 uResolution;
uniform vec3 uBubbles[4];
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
 // Only the outer, smoothly joined contour has an outline. The inner boundary
 // is the actually refracted rear lens and can grow wider than the raw overlap.
 vec3 active= df<db ? front:back;
 vec3 n=normalAt(p,active);
 float rim=exp(-max(0.,-unionD)*.62);
 float light=dot(normalize(n.xy+vec2(.0001)),normalize(vec2(-.6,-.8)));
 c=mix(c,mix(vec3(.28,.40,.43),vec3(1.),smoothstep(-.2,.8,light)),rim*.30);
 return vec4(c,m);
}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y);
 vec4 a=pair(p,uBubbles[0],uBubbles[1],CYAN,MAGENTA);
 vec4 b=pair(p,uBubbles[2],uBubbles[3],GOLD,CYAN);
 vec4 glass=a.a>b.a?a:b;
 if(uGrid>.5){gl_FragColor=vec4(mix(paper(p),glass.rgb,glass.a),1.);}
 else{gl_FragColor=glass;}
}`;

export function createGlassRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false, depth: false });
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
  return {
    draw(width: number, height: number, positions: number[], refraction = 1, diagnostic = false) {
      // CSS-pixel coordinates keep the optical thickness constant across devices.
      const scale = Math.min(1, 1100 / width);
      const rw = Math.round(width * scale), rh = Math.round(height * scale);
      if (canvas.width !== rw || canvas.height !== rh) { canvas.width = rw; canvas.height = rh; }
      gl.viewport(0, 0, rw, rh); gl.useProgram(program);
      // Fragment coordinates are in render pixels; convert the optical scene too.
      gl.uniform2f(resolution, rw, rh);
      gl.uniform3fv(bubbles, positions.map(v => v * scale));
      gl.uniform1f(strength, refraction); gl.uniform1f(grid, diagnostic ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    dispose() { gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment); }
  };
}

export function glassPositions(width: number, height: number, seconds: number, phase = 0) {
  const mobile = width < 640;
  const reach = mobile ? 32 : Math.min(75, width * .052);
  const bases = mobile
    ? [[-44,height*.08,115],[10,height*.10,88],[width+30,height*.72,100],[width-8,height*.78,76]]
    : [[width*.025,height*.28,Math.min(150,width*.105)],[width*.13,height*.33,Math.min(112,width*.079)],[width*.97,height*.60,Math.min(135,width*.095)],[width*.87,height*.67,Math.min(105,width*.075)]];
  return bases.flatMap(([x,y,size],i)=>{
    const a=seconds*(.63+i*.07)+phase+i*1.9;
    return [x+Math.cos(a)*reach,y+Math.sin(a*.83+i)*38,size];
  });
}
