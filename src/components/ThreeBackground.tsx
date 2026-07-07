import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface FloatingPhotoCard {
  group: THREE.Group;
  mesh: THREE.Mesh;
  border: THREE.LineSegments;
  borderMaterial: THREE.LineBasicMaterial;
  baseX: number;
  baseY: number;
  baseZ: number;
  targetY: number;
  currentY: number;
  targetScale: number;
  currentScale: number;
  targetRotationY: number;
  currentRotationY: number;
  cardId: string;
}

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, and Light-themed Fog
    const scene = new THREE.Scene();
    
    // Alabaster-white warm luxury fog
    scene.fog = new THREE.FogExp2(0xfaf6ef, 0.012);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    // Dramatic perspective facing the floating gallery
    camera.position.set(0, 10, 42);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. High-end warm lighting (white, beige, bronze accents)
    // Warm alabaster ambient fill
    const ambientLight = new THREE.AmbientLight(0xfffbf4, 0.85);
    scene.add(ambientLight);

    // Luxurious gold directional light
    const keyLight = new THREE.DirectionalLight(0xbf9f53, 1.8);
    keyLight.position.set(30, 45, 25);
    scene.add(keyLight);

    // Rich bronze soft light from the left
    const fillLight = new THREE.PointLight(0xaa814c, 1.2, 100);
    fillLight.position.set(-30, 10, 15);
    scene.add(fillLight);

    // Dynamic mouse spotlight beacon
    const mouseLight = new THREE.PointLight(0xd4bc7b, 4, 40);
    mouseLight.position.set(0, 5, 15);
    scene.add(mouseLight);

    // 3. Luxurious Bronze Ground Grid
    const gridHelper = new THREE.GridHelper(180, 45, 0xbf9f53, 0xe3dac9);
    gridHelper.position.y = -6;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.28;
    scene.add(gridHelper);

    // 4. Photographic Architectural Panels
    const cards: FloatingPhotoCard[] = [];
    const galleryGroup = new THREE.Group();

    // High-resolution architectural image URLs from Unsplash (Premium Estates)
    const photoUrls = [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80", // Modern Luxury Penthouse
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80", // Alibaug Pavilion Villa
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80", // Heritage Estate Manor
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", // Duplex Sky Sanctuary
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80", // Atrium Contemporary Villa
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"  // Cliff-side Manor
    ];

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";

    // Layout configuration for 6 floating photographic structures
    const cardLayouts = [
      { x: -16, y: 5, z: -10, id: "card_altamount", rotY: 0.3 },
      { x: -7, y: -1, z: -5, id: "card_amara", rotY: 0.1 },
      { x: 15, y: 6, z: -12, id: "card_lutyens", rotY: -0.3 },
      { x: 6, y: -2, z: -3, id: "card_magnolias", rotY: -0.15 },
      { x: -12, y: -4, z: 2, id: "card_indiranagar", rotY: 0.2 },
      { x: 11, y: -3, z: 3, id: "card_jubilee", rotY: -0.2 }
    ];

    cardLayouts.forEach((layout, index) => {
      const group = new THREE.Group();

      // Main image plane geometry (Widescreen luxury layout aspect ratio 1.6:1)
      const planeGeom = new THREE.PlaneGeometry(9.6, 6);
      
      // Fallback Material while texture loads
      const fallbackMaterial = new THREE.MeshBasicMaterial({
        color: 0xeeded1,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(planeGeom, fallbackMaterial);
      mesh.name = layout.id;
      group.add(mesh);

      // Load photographic texture dynamically
      textureLoader.load(
        photoUrls[index],
        (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          
          const photoMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.88,
            toneMapped: false
          });
          mesh.material = photoMaterial;
        },
        undefined,
        (err) => {
          console.warn("Failed to load texture, using fallback beige gradient material.", err);
        }
      );

      // Create a gorgeous double-wireframe floating glass frame border in Gold/Beige
      const frameGeom = new THREE.BoxGeometry(9.8, 6.2, 0.15);
      const edges = new THREE.EdgesGeometry(frameGeom);
      const borderMaterial = new THREE.LineBasicMaterial({
        color: 0xbf9f53, // Antique gold
        transparent: true,
        opacity: 0.38
      });
      const border = new THREE.LineSegments(edges, borderMaterial);
      group.add(border);

      // Soft backplate for glass-like depth and shadow receipt
      const backplateGeom = new THREE.PlaneGeometry(10.0, 6.4);
      const backplateMaterial = new THREE.MeshBasicMaterial({
        color: 0xfffbf4,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide
      });
      const backplate = new THREE.Mesh(backplateGeom, backplateMaterial);
      backplate.position.z = -0.1;
      group.add(backplate);

      // Position the cards staggered in 3D Space
      group.position.set(layout.x, layout.y, layout.z);
      group.rotation.y = layout.rotY;

      galleryGroup.add(group);

      cards.push({
        group,
        mesh,
        border,
        borderMaterial,
        baseX: layout.x,
        baseY: layout.y,
        baseZ: layout.z,
        targetY: layout.y,
        currentY: layout.y,
        targetScale: 1.0,
        currentScale: 1.0,
        targetRotationY: layout.rotY,
        currentRotationY: layout.rotY,
        cardId: layout.id
      });
    });

    scene.add(galleryGroup);

    // 5. Floating amber/golden star embers to decorate the atmosphere
    const particlesCount = 180;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 85;     // X
      posArray[i + 1] = Math.random() * 28;         // Y
      posArray[i + 2] = (Math.random() - 0.5) * 50; // Z
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.18,
      color: 0xd4bc7b, // Soft warm amber-gold stars
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 6. Interactive Mouse Tracking & Raycasting
    const mouse = new THREE.Vector2(-999, -999);
    const targetMouse = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetMouse.set(x, y);
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Track scroll
    let currentScrollY = 0;
    let targetScrollY = 0;
    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 7. Render Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.005;

      // Smooth mouse damping
      mouse.x += (targetMouse.x - mouse.x) * 0.1;
      mouse.y += (targetMouse.y - mouse.y) * 0.1;

      // Smooth scroll interpolation
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;

      // Rotate whole exhibition ring/gallery group based on scroll and time
      galleryGroup.rotation.y = time * 0.03 + currentScrollY * 0.0002;
      galleryGroup.position.y = currentScrollY * 0.008;

      // Soft architectural camera tilt response to mouse
      camera.position.x += (mouse.x * 10 - camera.position.x) * 0.035;
      camera.position.y += ((10 - mouse.y * 5) - camera.position.y) * 0.035;
      camera.lookAt(0, 2 - currentScrollY * 0.003, 0);

      // Raycasting to find hovered photographic panels
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(galleryGroup.children, true);

      let hoveredCardId: string | null = null;
      if (intersects.length > 0) {
        let parent = intersects[0].object;
        while (parent && parent !== scene) {
          if (parent.name) {
            hoveredCardId = parent.name;
            break;
          }
          parent = parent.parent as any;
        }
      }

      // Project mouse spotlight into 3D scene space
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.y / dir.y; 
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));

      if (Math.abs(mouse.x) < 2) {
        mouseLight.position.x += (pos.x - mouseLight.position.x) * 0.15;
        mouseLight.position.z += (pos.z - mouseLight.position.z) * 0.15;
        mouseLight.position.y = 3.5 + Math.sin(time * 2.5) * 0.3; // Hovering wave
      }

      // Update estate panels dynamically based on hover status
      cards.forEach((card, idx) => {
        const isHovered = card.cardId === hoveredCardId;

        if (isHovered) {
          // Glow, expand, and rotate flush to the camera
          card.targetY = card.baseY + 1.8;
          card.targetScale = 1.08;
          card.targetRotationY = -galleryGroup.rotation.y; // Rotate flush to camera
          card.borderMaterial.color.setHex(0xbf9f53); // Deep gold
          card.borderMaterial.opacity = 0.95;
          if (card.mesh.material instanceof THREE.MeshBasicMaterial) {
            card.mesh.material.opacity = 0.98;
          }
        } else {
          // Float naturally at original stance
          card.targetY = card.baseY + Math.sin(time * 1.5 + idx) * 0.22;
          card.targetScale = 1.0;
          card.targetRotationY = cardLayouts[idx].rotY;
          card.borderMaterial.color.setHex(0xe3dac9); // Soft beige
          card.borderMaterial.opacity = 0.38;
          if (card.mesh.material instanceof THREE.MeshBasicMaterial) {
            card.mesh.material.opacity = 0.85;
          }
        }

        // Apply smooth interpolations
        card.currentY += (card.targetY - card.currentY) * 0.1;
        card.currentScale += (card.targetScale - card.currentScale) * 0.1;
        card.currentRotationY += (card.targetRotationY - card.currentRotationY) * 0.08;

        card.group.position.y = card.currentY;
        card.group.scale.setScalar(card.currentScale);
        card.group.rotation.y = card.currentRotationY;
      });

      // Gently drift the golden particles upwards
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.015; // Float upwards
        if (positions[i] > 28) {
          positions[i] = 0; // Loop back
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Release memory
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#faf6ef]"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}
