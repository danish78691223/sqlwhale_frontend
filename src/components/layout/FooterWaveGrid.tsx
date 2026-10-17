"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FooterWaveGrid() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: any;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(host.clientWidth || 1, host.clientHeight || 1);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, (host.clientWidth || 1) / (host.clientHeight || 1), 0.1, 500);
    camera.position.set(0, 18, 30);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 1.7));
    const light = new THREE.DirectionalLight(0xffffff, 2.5);
    light.position.set(-8, 15, 8);
    scene.add(light);

    const size = 40;
    const geometry = new THREE.BoxGeometry(0.72, 0.18, 0.72);
    const material = new THREE.MeshStandardMaterial({ color: "#d8e4ff", metalness: 0.2, roughness: 0.45 });
    const mesh = new THREE.InstancedMesh(geometry, material, size * size);
    const dummy = new THREE.Object3D();
    const positions: Array<{ x: number; z: number }> = [];
    const span = (size - 1) * 0.9;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const px = x * 0.9 - span / 2;
        const pz = z * 0.9 - span / 2;
        positions.push(new THREE.Vector3(px, 0, pz));
        dummy.position.set(px, 0, pz);
        dummy.updateMatrix();
        mesh.setMatrixAt(x * size + z, dummy.matrix);
      }
    }
    scene.add(mesh);
    const pointer = new THREE.Vector2(999, 999);
    const onMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width - 0.5) * span, ((event.clientY - rect.top) / rect.height - 0.5) * span);
    };
    host.addEventListener("pointermove", onMove);
    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const t = clock.getElapsedTime();
      positions.forEach((p, i) => {
        const distance = Math.hypot(p.x - pointer.x, p.z - pointer.y);
        const ripple = Math.sin(distance * 0.7 - t * 2.2) * Math.exp(-distance * 0.055) * 0.65;
        const idle = Math.sin(p.x * 0.22 + t * 0.7) * Math.cos(p.z * 0.18 - t * 0.5) * 0.18;
        dummy.position.set(p.x, ripple + idle, p.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1 + Math.max(0, ripple) * 1.5, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    });
    const resize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    return () => {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      host.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="sqlwhale-footer-wave-grid" aria-hidden="true" />;
}
