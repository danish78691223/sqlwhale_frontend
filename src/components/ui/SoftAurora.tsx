"use client";

import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import styles from "./SoftAurora.module.css";

type SoftAuroraProps = {
  speed?: number;
  scale?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  noiseFrequency?: number;
  noiseAmplitude?: number;
  bandHeight?: number;
  bandSpread?: number;
  octaveDecay?: number;
  layerOffset?: number;
  colorSpeed?: number;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
};

function hexToVec3(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ];
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform float uSpeed;
uniform float uScale;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uBandHeight;
uniform float uBandSpread;
uniform float uOctaveDecay;
uniform float uLayerOffset;
uniform float uColorSpeed;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = uNoiseAmp;
  float frequency = uNoiseFreq;
  for (int i = 0; i < 4; i++) {
    total += (noise(p * frequency) - 0.5) * amplitude;
    frequency *= 2.0;
    amplitude *= uOctaveDecay;
  }
  return total;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  if (uEnableMouse) p += (uMouse - 0.5) * uMouseInfluence;
  float time = uTime * uSpeed;
  float flow1 = fbm(vec2(p.x * uScale + time * 0.12, p.y * uScale * 0.7 - time * 0.08));
  float flow2 = fbm(vec2(p.x * uScale * 0.8 - time * 0.09 + uLayerOffset, p.y * uScale + time * 0.06));
  float wave1 = p.y - (uBandHeight - 0.5) + sin(p.x * 2.3 + time * 0.6) * 0.12 + flow1 * 0.42;
  float wave2 = p.y - (uBandHeight - 0.42) + sin(p.x * 1.7 - time * 0.45) * 0.16 + flow2 * 0.45;
  float glow1 = exp(-abs(wave1) * (4.0 / max(uBandSpread, 0.05)));
  float glow2 = exp(-abs(wave2) * (5.0 / max(uBandSpread, 0.05)));
  glow1 *= smoothstep(-0.8, 0.1, p.y + flow1);
  glow2 *= smoothstep(-0.7, 0.2, p.y + flow2) * 0.8;
  vec3 c1 = mix(uColor1, vec3(0.55, 0.72, 1.0), 0.28 + 0.2 * sin(time * uColorSpeed + uv.x * 4.0));
  vec3 c2 = mix(uColor2, vec3(0.9, 0.68, 1.0), 0.25 + 0.2 * cos(time * uColorSpeed * 0.7 + uv.x * 3.0));
  vec3 color = c1 * glow1 + c2 * glow2;
  color *= uBrightness;
  float alpha = clamp(max(glow1, glow2) * 0.58 * uBrightness, 0.0, 0.78);
  gl_FragColor = vec4(color, alpha);
}
`;

export default function SoftAurora({
  speed = 0.6,
  scale = 1.5,
  brightness = 1.25,
  color1 = "#1862FD",
  color2 = "#B44CFF",
  noiseFrequency = 2.5,
  noiseAmplitude = 1.0,
  bandHeight = 0.5,
  bandSpread = 1.0,
  octaveDecay = 0.35,
  layerOffset = 1.4,
  colorSpeed = 1.0,
  enableMouseInteraction = true,
  mouseInfluence = 0.25,
}: SoftAuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let animationFrameId = 0;

    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(window.devicePixelRatio || 1, 1.75) });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      const geometry = new Triangle(gl);
      const mouse = new Float32Array([0.5, 0.5]);
      let targetMouse: [number, number] = [0.5, 0.5];

      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [1, 1] },
          uSpeed: { value: speed },
          uScale: { value: scale },
          uBrightness: { value: brightness },
          uColor1: { value: hexToVec3(color1) },
          uColor2: { value: hexToVec3(color2) },
          uNoiseFreq: { value: noiseFrequency },
          uNoiseAmp: { value: noiseAmplitude },
          uBandHeight: { value: bandHeight },
          uBandSpread: { value: bandSpread },
          uOctaveDecay: { value: octaveDecay },
          uLayerOffset: { value: layerOffset },
          uColorSpeed: { value: colorSpeed },
          uMouse: { value: mouse },
          uMouseInfluence: { value: mouseInfluence },
          uEnableMouse: { value: enableMouseInteraction },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });
      container.appendChild(gl.canvas);

      const resize = () => {
        const width = Math.max(1, container.clientWidth);
        const height = Math.max(1, container.clientHeight);
        renderer?.setSize(width, height);
        program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
      };
      const handlePointerMove = (event: PointerEvent) => {
        const rect = gl.canvas.getBoundingClientRect();
        targetMouse = [
          (event.clientX - rect.left) / Math.max(rect.width, 1),
          1 - (event.clientY - rect.top) / Math.max(rect.height, 1),
        ];
      };
      const resetPointer = () => { targetMouse = [0.5, 0.5]; };
      resize();
      window.addEventListener("resize", resize);
      if (enableMouseInteraction) {
        gl.canvas.addEventListener("pointermove", handlePointerMove);
        gl.canvas.addEventListener("pointerleave", resetPointer);
      }

      const update = (time: number) => {
        animationFrameId = window.requestAnimationFrame(update);
        program.uniforms.uTime.value = time * 0.001;
        mouse[0] += 0.045 * (targetMouse[0] - mouse[0]);
        mouse[1] += 0.045 * (targetMouse[1] - mouse[1]);
        renderer?.render({ scene: mesh });
      };
      animationFrameId = window.requestAnimationFrame(update);

      return () => {
        window.cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", resize);
        if (enableMouseInteraction) {
          gl.canvas.removeEventListener("pointermove", handlePointerMove);
          gl.canvas.removeEventListener("pointerleave", resetPointer);
        }
        if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    } catch (error) {
      console.error("SoftAurora could not initialize WebGL.", error);
    }
  }, [
    speed, scale, brightness, color1, color2, noiseFrequency, noiseAmplitude,
    bandHeight, bandSpread, octaveDecay, layerOffset, colorSpeed,
    enableMouseInteraction, mouseInfluence,
  ]);

  return <div ref={containerRef} className={styles.container} aria-hidden="true" />;
}
