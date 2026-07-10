"use client";

import React, { useEffect, useRef, useState } from "react";

type Destination = "work" | "about" | "contact";

type LiquidNavProps = {
  visible: boolean;
  interactive: boolean;
  onSelect: (destination: Destination) => void;
};

const BASE = [
  [0.265, 0.595],
  [0.735, 0.365],
  [0.74, 0.67],
] as const;

const labels: Array<{ id: Destination; label: string; note: string; className: string }> = [
  { id: "work", label: "Work", note: "Selected worlds", className: "liquid-label--work" },
  { id: "about", label: "About", note: "Profile", className: "liquid-label--about" },
  { id: "contact", label: "Contact", note: "Begin a project", className: "liquid-label--contact" },
];

export function LiquidNav({ visible, interactive, onSelect }: LiquidNavProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: 0 });
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl || reduced) return;

    const vertex = `
      attribute vec2 aPosition;
      void main(){ gl_Position = vec4(aPosition, 0.0, 1.0); }
    `;

    const fragment = `
      precision highp float;
      uniform vec2 uResolution;
      uniform vec2 uCenters[4];
      uniform float uRadii[4];
      uniform vec3 uColors[4];
      uniform float uTime;
      uniform float uPointerActive;

      float influence(vec2 uv, int index){
        vec2 d = uv - uCenters[index];
        d.x *= uResolution.x / uResolution.y;
        float angle = atan(d.y, d.x);
        float wobble = 1.0 + 0.045 * sin(angle * 3.0 + uTime * 0.72 + float(index) * 1.7)
                           + 0.025 * sin(angle * 5.0 - uTime * 0.44 + float(index));
        float radius = uRadii[index] * wobble;
        return radius * radius / max(dot(d, d), 0.00008);
      }

      float fieldAt(vec2 uv){
        float value = 0.0;
        for(int i = 0; i < 4; i++) value += influence(uv, i);
        return value;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / uResolution;
        uv.y = 1.0 - uv.y;
        float field = fieldAt(uv);
        float alpha = smoothstep(0.92, 1.06, field);

        vec2 px = vec2(1.8 / uResolution.x, 1.8 / uResolution.y);
        float gx = fieldAt(uv + vec2(px.x, 0.0)) - fieldAt(uv - vec2(px.x, 0.0));
        float gy = fieldAt(uv + vec2(0.0, px.y)) - fieldAt(uv - vec2(0.0, px.y));
        vec3 normal = normalize(vec3(-gx * 15.0, -gy * 15.0, 1.0));
        vec3 light = normalize(vec3(-0.42, -0.58, 1.0));
        float diffuse = 0.55 + 0.45 * max(dot(normal, light), 0.0);
        float specular = pow(max(dot(reflect(-light, normal), vec3(0.0, 0.0, 1.0)), 0.0), 32.0);
        float rim = pow(1.0 - max(normal.z, 0.0), 2.0);

        float weights[4];
        float total = 0.0;
        for(int i = 0; i < 4; i++){
          weights[i] = influence(uv, i);
          total += weights[i];
        }
        vec3 color = vec3(0.0);
        for(int i = 0; i < 4; i++) color += uColors[i] * weights[i] / max(total, 0.001);
        color *= diffuse;
        color += specular * 0.9 + rim * 0.16;
        color = mix(color, vec3(0.05, 0.06, 0.075), 0.08);

        float halo = smoothstep(0.25, 0.95, field) * (1.0 - alpha) * 0.13;
        gl_FragColor = vec4(color + color * halo, alpha * 0.96 + halo);
      }
    `;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const v = compile(gl.VERTEX_SHADER, vertex);
    const f = compile(gl.FRAGMENT_SHADER, fragment);
    if (!v || !f) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, v);
    gl.attachShader(program, f);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "uResolution");
    const centersLoc = gl.getUniformLocation(program, "uCenters[0]");
    const radiiLoc = gl.getUniformLocation(program, "uRadii[0]");
    const colorsLoc = gl.getUniformLocation(program, "uColors[0]");
    const timeLoc = gl.getUniformLocation(program, "uTime");
    const pointerActiveLoc = gl.getUniformLocation(program, "uPointerActive");

    const colors = new Float32Array([
      0.79, 0.02, 0.38,
      1.0, 0.64, 0.02,
      0.0, 0.65, 0.79,
      0.92, 0.92, 0.96,
    ]);

    let raf = 0;
    let last = performance.now();
    let smoothPointer = { x: 0.5, y: 0.5, active: 0 };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.65);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = (now: number) => {
      resize();
      const dt = Math.min(32, now - last) / 16.666;
      last = now;
      const target = pointerRef.current;
      const ease = 1 - Math.pow(0.82, dt);
      smoothPointer.x += (target.x - smoothPointer.x) * ease;
      smoothPointer.y += (target.y - smoothPointer.y) * ease;
      smoothPointer.active += (target.active - smoothPointer.active) * ease;

      const centers = new Float32Array(8);
      for (let i = 0; i < 3; i += 1) {
        const bx = BASE[i][0];
        const by = BASE[i][1];
        const dx = smoothPointer.x - bx;
        const dy = smoothPointer.y - by;
        const dist = Math.hypot(dx * 1.78, dy);
        const pull = Math.max(0, 1 - dist / 0.34) * 0.105 * smoothPointer.active;
        centers[i * 2] = bx + dx * pull;
        centers[i * 2 + 1] = by + dy * pull;
      }
      centers[6] = smoothPointer.x;
      centers[7] = smoothPointer.y;

      const radii = new Float32Array([
        0.102,
        0.102,
        0.102,
        0.057 * smoothPointer.active,
      ]);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform2fv(centersLoc, centers);
      gl.uniform1fv(radiiLoc, radii);
      gl.uniform3fv(colorsLoc, colors);
      gl.uniform1f(timeLoc, now / 1000);
      gl.uniform1f(pointerActiveLoc, smoothPointer.active);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };

    setWebglReady(true);
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      gl.deleteProgram(program);
      gl.deleteShader(v);
      gl.deleteShader(f);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, []);

  const updatePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
      active: interactive ? 1 : 0,
    };
  };

  return (
    <div
      ref={hostRef}
      className={`liquid-nav ${visible ? "is-visible" : ""} ${webglReady ? "has-webgl" : ""}`}
      onPointerMove={updatePointer}
      onPointerDown={updatePointer}
      onPointerLeave={() => {
        pointerRef.current = { ...pointerRef.current, active: 0 };
      }}
      aria-hidden={!visible}
    >
      <canvas ref={canvasRef} className="liquid-nav__canvas" />
      <div className="liquid-thread liquid-thread--work" />
      <div className="liquid-thread liquid-thread--about" />
      <div className="liquid-thread liquid-thread--contact" />
      <div className="liquid-fallback liquid-fallback--work" />
      <div className="liquid-fallback liquid-fallback--about" />
      <div className="liquid-fallback liquid-fallback--contact" />
      {labels.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`liquid-label ${item.className}`}
          onClick={() => onSelect(item.id)}
          tabIndex={visible && interactive ? 0 : -1}
          disabled={!interactive}
        >
          <span>{item.label}</span>
          <small>{item.note}</small>
        </button>
      ))}
    </div>
  );
}
