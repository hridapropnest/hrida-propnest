import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width  = container.clientWidth;
    const height = container.clientHeight;

    // ─── Scene ────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080604, 0.018);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 300);
    camera.position.set(0, 12, 48);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    container.appendChild(renderer.domElement);

    // ─── Lighting ─────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a1208, 1.0));

    const goldKey = new THREE.DirectionalLight(0xd4a853, 1.8);
    goldKey.position.set(20, 40, 20);
    scene.add(goldKey);

    const rimLight = new THREE.DirectionalLight(0x7c5c2a, 0.6);
    rimLight.position.set(-30, 10, -10);
    scene.add(rimLight);

    // Mouse-following warm orb
    const mouseOrb = new THREE.PointLight(0xcca85f, 3.5, 60);
    mouseOrb.position.set(0, 5, 15);
    scene.add(mouseOrb);

    // Slow breathing ambient orbs (static, just glow)
    const orbPositions = [
      [-20, 4, -10], [18, 3, -14], [0, 6, -25], [-8, 2, 5], [12, 5, 2],
    ] as [number, number, number][];

    orbPositions.forEach(([x, y, z]) => {
      const orb = new THREE.PointLight(0xb38946, 1.2, 35);
      orb.position.set(x, y, z);
      scene.add(orb);
    });

    // ─── Infinite Grid Floor ──────────────────────────────────────────────────
    // Custom shader grid for sharp, editorial look
    const gridMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:      { value: 0 },
        uColor:     { value: new THREE.Color(0xb38946) },
        uFade:      { value: 0.0 },
        uGridSize:  { value: 5.0 },
        uLineWidth: { value: 0.025 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vDist;
        void main() {
          vUv = position.xz;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vDist = -mvPos.z;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3  uColor;
        uniform float uGridSize;
        uniform float uLineWidth;
        varying vec2  vUv;
        varying float vDist;
        void main() {
          vec2 g = abs(fract(vUv / uGridSize - 0.5) - 0.5) / fwidth(vUv / uGridSize);
          float line = min(g.x, g.y);
          float grid = 1.0 - min(line, 1.0);
          // Fade with distance
          float fade = 1.0 - smoothstep(30.0, 90.0, vDist);
          // Pulse along Z axis (shimmer wave)
          float pulse = 0.5 + 0.5 * sin(vUv.y * 0.18 - uTime * 0.6);
          float alpha = grid * fade * (0.08 + 0.06 * pulse);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const gridMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400, 1, 1),
      gridMat
    );
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = -8;
    scene.add(gridMesh);

    // ─── Gold Dust Particles ──────────────────────────────────────────────────
    const PARTICLE_COUNT = 600;

    // Create two layers: fine dust + large glinting flecks
    function makeParticles(count: number, spread: [number, number, number], size: number, opacity: number) {
      const pos = new Float32Array(count * 3);
      const vel = new Float32Array(count * 3);
      const phase = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * spread[0];
        pos[i * 3 + 1] = Math.random() * spread[1];
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
        vel[i * 3]     = (Math.random() - 0.5) * 0.006;  // drift X
        vel[i * 3 + 1] = 0.004 + Math.random() * 0.008;  // rise Y
        vel[i * 3 + 2] = (Math.random() - 0.5) * 0.004;  // drift Z
        phase[i]        = Math.random() * Math.PI * 2;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xd4a853,
        size,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      return { mesh: new THREE.Points(geo, mat), geo, vel, phase, spread };
    }

    const dust  = makeParticles(PARTICLE_COUNT, [120, 40, 80], 0.12, 0.55);
    const fleck = makeParticles(80,             [80,  30, 60], 0.38, 0.35);

    scene.add(dust.mesh);
    scene.add(fleck.mesh);

    // ─── Floating Thin Lines (laser-thin gold threads) ────────────────────────
    const linesGroup = new THREE.Group();
    for (let i = 0; i < 18; i++) {
      const x = (Math.random() - 0.5) * 70;
      const y = Math.random() * 25 - 5;
      const z = (Math.random() - 0.5) * 50;
      const len = 3 + Math.random() * 10;
      const angle = Math.random() * Math.PI;

      const points = [
        new THREE.Vector3(x - Math.cos(angle) * len * 0.5, y, z - Math.sin(angle) * len * 0.5),
        new THREE.Vector3(x + Math.cos(angle) * len * 0.5, y, z + Math.sin(angle) * len * 0.5),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0xb38946,
        transparent: true,
        opacity: 0.06 + Math.random() * 0.1,
        blending: THREE.AdditiveBlending,
      });
      linesGroup.add(new THREE.Line(geo, mat));
    }
    scene.add(linesGroup);

    // ─── Distant silhouette plane (subtle skyline) ────────────────────────────
    const horizonGeo = new THREE.PlaneGeometry(300, 60);
    const horizonMat = new THREE.MeshBasicMaterial({
      color: 0x1a1208,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    horizon.position.set(0, 10, -70);
    scene.add(horizon);

    // ─── Mouse tracking ───────────────────────────────────────────────────────
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const onMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      targetMouse.x =  ((e.clientX - r.left)  / r.width  ) * 2 - 1;
      targetMouse.y = -((e.clientY - r.top)   / r.height ) * 2 + 1;
    };
    container.addEventListener("mousemove", onMouseMove, { passive: true });

    let scrollY = 0;
    let targetScrollY = 0;
    const onScroll = () => { targetScrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // ─── Animation loop ───────────────────────────────────────────────────────
    let raf: number;
    let time = 0;

    function updateParticleLayer(layer: ReturnType<typeof makeParticles>, t: number) {
      const pos = layer.geo.attributes.position.array as Float32Array;
      const [sx, sy, sz] = layer.spread;

      for (let i = 0; i < pos.length / 3; i++) {
        const ii = i * 3;
        // Gentle sine sway
        pos[ii]     += layer.vel[ii]     + Math.sin(t * 0.4 + layer.phase[i]) * 0.003;
        pos[ii + 1] += layer.vel[ii + 1];
        pos[ii + 2] += layer.vel[ii + 2];

        // Loop back when out of bounds
        if (pos[ii + 1] > sy)      pos[ii + 1] = 0;
        if (Math.abs(pos[ii])  > sx / 2) pos[ii]     *= -0.95;
        if (Math.abs(pos[ii + 2]) > sz / 2) pos[ii + 2] *= -0.95;
      }
      layer.geo.attributes.position.needsUpdate = true;
    }

    const animate = () => {
      raf = requestAnimationFrame(animate);
      time += 0.008;

      // Smooth inputs
      mouse.x += (targetMouse.x - mouse.x) * 0.06;
      mouse.y += (targetMouse.y - mouse.y) * 0.06;
      scrollY += (targetScrollY - scrollY) * 0.06;

      // Subtle camera parallax
      camera.position.x += (mouse.x * 8  - camera.position.x) * 0.025;
      camera.position.y += (12 - mouse.y * 4 - camera.position.y) * 0.025;
      camera.position.y -= scrollY * 0.004;
      camera.lookAt(0, 0, 0);

      // Grid shader time
      (gridMat.uniforms.uTime as any).value = time;

      // Mouse orb follows cursor in 3D
      mouseOrb.position.x += (mouse.x * 22 - mouseOrb.position.x) * 0.08;
      mouseOrb.position.y  = 5 + Math.sin(time * 1.8) * 1.2;
      mouseOrb.intensity   = 2.5 + Math.sin(time * 2.2) * 0.8;

      // Drift the lines subtly
      linesGroup.position.y = Math.sin(time * 0.25) * 0.6;
      linesGroup.rotation.y = time * 0.008;

      // Update particles
      updateParticleLayer(dust, time);
      updateParticleLayer(fleck, time);

      // Fleck opacity pulse
      (fleck.mesh.material as THREE.PointsMaterial).opacity =
        0.2 + 0.15 * Math.sin(time * 1.4);

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      dust.geo.dispose();
      fleck.geo.dispose();
      gridMat.dispose();
      horizonGeo.dispose();
      horizonMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}
