import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Orbit } from 'lucide-react';

interface StellarMotion3DProps {
  className?: string;
  initialMode?: 'orbit' | 'constellation';
}

export const StellarMotion3D: React.FC<StellarMotion3DProps> = ({
  className = '',
  initialMode = 'orbit',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeMode, setActiveMode] = useState<'orbit' | 'constellation'>(initialMode);
  const activeModeRef = useRef<'orbit' | 'constellation'>(initialMode);

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = true;
    let animId: number;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Root World Pivot for smooth mouse parallax
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Groups for the two visual phases
    const cosmosGroup = new THREE.Group();
    const constellationGroup = new THREE.Group();
    worldGroup.add(cosmosGroup);
    worldGroup.add(constellationGroup);

    // Constellation starts dimmed/scaled back
    constellationGroup.visible = false;
    constellationGroup.scale.set(0.7, 0.7, 0.7);

    // ═════════════════════════════════════════════════════════════
    // 2. COSMOS PHASE (Pinterest Pin 1093108140813241341 Parity)
    // ═════════════════════════════════════════════════════════════

    // (A) Primary Faceted Low-Poly Planet (Top-Right)
    const primaryPlanetGroup = new THREE.Group();
    primaryPlanetGroup.position.set(4.2, 2.6, -1.5);
    primaryPlanetGroup.rotation.z = 0.35;
    cosmosGroup.add(primaryPlanetGroup);

    // Build low-poly faceted planet with custom vertex colors
    const planetGeo = new THREE.IcosahedronGeometry(2.6, 2);
    // Convert to non-indexed for true flat-faceted shading
    const flatPlanetGeo = planetGeo.toNonIndexed();
    const posAttr = flatPlanetGeo.attributes.position;
    const colors: number[] = [];

    // Facet color palette matching StellarX: neon emerald, cyber cyan, deep indigo, violet
    const palette = [
      new THREE.Color(0x00e575), // Vibrant Emerald
      new THREE.Color(0x06b6d4), // Neon Cyan
      new THREE.Color(0x10b981), // Mint
      new THREE.Color(0x3b82f6), // Royal Blue
      new THREE.Color(0x6366f1), // Indigo
      new THREE.Color(0x8b5cf6), // Violet
      new THREE.Color(0x0d1f1b), // Deep obsidian
    ];

    for (let i = 0; i < posAttr.count; i += 3) {
      // Pick color per triangle face
      const pY = (posAttr.getY(i) + posAttr.getY(i + 1) + posAttr.getY(i + 2)) / 3;
      const pZ = (posAttr.getZ(i) + posAttr.getZ(i + 1) + posAttr.getZ(i + 2)) / 3;

      let colorIndex = Math.floor(Math.abs(Math.sin(pY * 2.5 + pZ * 1.8)) * palette.length);
      colorIndex = Math.min(colorIndex, palette.length - 1);
      const c = palette[colorIndex];

      for (let j = 0; j < 3; j++) {
        colors.push(c.r, c.g, c.b);
      }
    }

    flatPlanetGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    flatPlanetGeo.computeVertexNormals();

    const planetMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.45,
      metalness: 0.15,
    });

    const planetMesh = new THREE.Mesh(flatPlanetGeo, planetMat);
    primaryPlanetGroup.add(planetMesh);

    // Atmospheric Glow Halo around the primary planet
    const haloGeo = new THREE.RingGeometry(2.7, 3.1, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const planetHalo = new THREE.Mesh(haloGeo, haloMat);
    primaryPlanetGroup.add(planetHalo);

    // (B) Secondary Faceted Crystalline Moon (Top-Left)
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-4.5, 2.2, -2.5);
    cosmosGroup.add(moonGroup);

    const moonGeo = new THREE.IcosahedronGeometry(1.2, 1).toNonIndexed();
    const moonPos = moonGeo.attributes.position;
    const moonColors: number[] = [];
    const moonPalette = [
      new THREE.Color(0x06b6d4), // Cyan
      new THREE.Color(0xa7f3d0), // Pale Mint
      new THREE.Color(0x38bdf8), // Sky Blue
      new THREE.Color(0x0e7490), // Dark Teal
    ];

    for (let i = 0; i < moonPos.count; i += 3) {
      const pX = (moonPos.getX(i) + moonPos.getX(i + 1) + moonPos.getX(i + 2)) / 3;
      const idx = Math.floor(Math.abs(Math.cos(pX * 3.0)) * moonPalette.length) % moonPalette.length;
      const c = moonPalette[idx];
      for (let j = 0; j < 3; j++) {
        moonColors.push(c.r, c.g, c.b);
      }
    }
    moonGeo.setAttribute('color', new THREE.Float32BufferAttribute(moonColors, 3));
    moonGeo.computeVertexNormals();

    const moonMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.35,
      metalness: 0.25,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moonMesh);

    // Orbiting micro-satellites / cosmic dust around moon
    const moonOrbitGroup = new THREE.Group();
    moonGroup.add(moonOrbitGroup);

    const satGeo = new THREE.TetrahedronGeometry(0.12, 0);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    for (let i = 0; i < 6; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      const angle = (i / 6) * Math.PI * 2;
      sat.position.set(Math.cos(angle) * 1.8, Math.sin(angle) * 0.9, Math.sin(angle * 2) * 0.4);
      moonOrbitGroup.add(sat);
    }

    // (C) Curved Horizon & Low-Poly Puffy Geometric Cloud Clusters (Bottom)
    const horizonGroup = new THREE.Group();
    horizonGroup.position.set(0, -4.2, 0);
    cosmosGroup.add(horizonGroup);

    // Low-Poly Cloud Formations (clusters of faceted polyhedra)
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xdcfce7,
      roughness: 0.2,
      flatShading: true,
      transparent: true,
      opacity: 0.88,
    });

    const createCloudCluster = (x: number, y: number, z: number, scale = 1.0) => {
      const cluster = new THREE.Group();
      cluster.position.set(x, y, z);
      cluster.scale.set(scale, scale, scale);

      const parts = 5;
      for (let i = 0; i < parts; i++) {
        const radius = 0.28 + Math.random() * 0.22;
        const partGeo = new THREE.IcosahedronGeometry(radius, 1);
        const part = new THREE.Mesh(partGeo, cloudMat);
        part.position.set(
          (i - 2) * 0.35 + (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        );
        part.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        cluster.add(part);
      }
      return cluster;
    };

    const clouds: THREE.Group[] = [];
    const cloudPositions = [
      { x: -5.5, y: -0.6, z: 0.5, s: 1.1 },
      { x: -3.2, y: -0.4, z: 1.2, s: 1.3 },
      { x: -1.0, y: -0.7, z: 0.8, s: 1.0 },
      { x: 1.5, y: -0.5, z: 1.1, s: 1.2 },
      { x: 3.8, y: -0.8, z: 0.6, s: 1.1 },
      { x: 5.8, y: -0.5, z: 0.3, s: 1.0 },
    ];

    cloudPositions.forEach((pos) => {
      const c = createCloudCluster(pos.x, pos.y, pos.z, pos.s);
      clouds.push(c);
      horizonGroup.add(c);
    });

    // (D) Supersonic 3D Spacecraft / Interceptor with Exhaust Plume (StellarX Rocket)
    const shipGroup = new THREE.Group();
    cosmosGroup.add(shipGroup);
    shipGroup.position.set(3.0, -1.2, 2.0);
    shipGroup.rotation.set(-0.2, 0.35, 0.45); // Flying diagonally up-right

    // Spacecraft Body
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.2,
      metalness: 0.5,
      flatShading: true,
    });
    const canopyMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.7,
      transparent: true,
    });
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x00e575,
      emissive: 0x00e575,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.4,
      flatShading: true,
    });

    // Fuselage
    const fuselageGeo = new THREE.ConeGeometry(0.28, 1.4, 6);
    const fuselage = new THREE.Mesh(fuselageGeo, hullMat);
    fuselage.rotation.x = -Math.PI * 0.5;
    shipGroup.add(fuselage);

    // Cockpit Canopy
    const canopyGeo = new THREE.ConeGeometry(0.16, 0.6, 5);
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.rotation.x = -Math.PI * 0.5;
    canopy.position.set(0, 0.12, 0.15);
    shipGroup.add(canopy);

    // Delta Wings
    const wingGeo = new THREE.BoxGeometry(1.2, 0.04, 0.45);
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0, 0, -0.25);
    shipGroup.add(wings);

    // Volumetric Low-Poly Exhaust Smoke Plume
    const plumeGroup = new THREE.Group();
    cosmosGroup.add(plumeGroup);

    const plumePuffs: { mesh: THREE.Mesh; life: number; speed: THREE.Vector3 }[] = [];
    const puffGeo = new THREE.IcosahedronGeometry(0.18, 1);
    const puffMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.5,
      flatShading: true,
      transparent: true,
      opacity: 0.75,
    });

    for (let i = 0; i < 18; i++) {
      const puff = new THREE.Mesh(puffGeo, puffMat.clone());
      puff.visible = false;
      plumeGroup.add(puff);
      plumePuffs.push({
        mesh: puff,
        life: i / 18,
        speed: new THREE.Vector3(-0.02, -0.015, -0.01),
      });
    }

    // (E) Anamorphic Lens Flare Beam & Solar Ray
    const flareGroup = new THREE.Group();
    flareGroup.position.set(1.5, 1.8, -1.0);
    cosmosGroup.add(flareGroup);

    // Horizontal Flare Streak
    const streakGeo = new THREE.PlaneGeometry(10.0, 0.12);
    const streakMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5, // Warm solar amber streak
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const flareStreak = new THREE.Mesh(streakGeo, streakMat);
    flareGroup.add(flareStreak);

    // Core Solar Glow
    const coreGlowGeo = new THREE.CircleGeometry(0.7, 32);
    const coreGlowMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const flareCore = new THREE.Mesh(coreGlowGeo, coreGlowMat);
    flareGroup.add(flareCore);

    // Cyan Secondary Flare Ring
    const ringFlareGeo = new THREE.RingGeometry(0.9, 1.1, 32);
    const ringFlareMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const flareRing = new THREE.Mesh(ringFlareGeo, ringFlareMat);
    flareGroup.add(flareRing);

    // ═════════════════════════════════════════════════════════════
    // 3. CONSTELLATION PHASE (Pinterest Pin Frame 5 Parity)
    // ═════════════════════════════════════════════════════════════
    // Celestial Aegis Constellation (Shield + Sentinel Star Topology)
    const constellationPoints: THREE.Vector3[] = [
      new THREE.Vector3(0, 2.2, 0),    // Top Apex
      new THREE.Vector3(-1.8, 1.2, 0.4), // Upper Left
      new THREE.Vector3(1.8, 1.2, -0.4),  // Upper Right
      new THREE.Vector3(-2.2, -0.6, 0.2),// Mid Left
      new THREE.Vector3(2.2, -0.6, -0.2), // Mid Right
      new THREE.Vector3(-1.2, -2.0, 0.3), // Lower Left
      new THREE.Vector3(1.2, -2.0, -0.3),  // Lower Right
      new THREE.Vector3(0, -2.6, 0),   // Bottom Tip
      new THREE.Vector3(0, 0.3, 0.6),   // Center Core Node
      new THREE.Vector3(0, -0.8, 0.4),  // Lower Core Node
    ];

    // Constellation Connections (Edges)
    const constellationEdges = [
      [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 7],
      [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [8, 9], [5, 9], [6, 9], [7, 9],
    ];

    // Glowing Star Nodes
    const starNodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const starNodeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const starAuraGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const starAuraMat = new THREE.MeshBasicMaterial({
      color: 0x00e575,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    const starNodes: THREE.Group[] = [];
    constellationPoints.forEach((pt) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(pt);
      nodeGroup.add(new THREE.Mesh(starNodeGeo, starNodeMat));
      nodeGroup.add(new THREE.Mesh(starAuraGeo, starAuraMat));
      constellationGroup.add(nodeGroup);
      starNodes.push(nodeGroup);
    });

    // Constellation Laser Filaments (Lines)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      linewidth: 1.5,
    });

    const lineGeos: THREE.BufferGeometry[] = [];
    constellationEdges.forEach(([startIdx, endIdx]) => {
      const edgeGeo = new THREE.BufferGeometry().setFromPoints([
        constellationPoints[startIdx],
        constellationPoints[endIdx],
      ]);
      const line = new THREE.Line(edgeGeo, lineMat);
      constellationGroup.add(line);
      lineGeos.push(edgeGeo);
    });

    // ═════════════════════════════════════════════════════════════
    // 4. COSMIC STARFIELD & SPACE DUST
    // ═════════════════════════════════════════════════════════════
    const starCount = 380;
    const starGeometry = new THREE.BufferGeometry();
    const starCoords = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starCoords[i * 3] = (Math.random() - 0.5) * 45;
      starCoords[i * 3 + 1] = (Math.random() - 0.5) * 35;
      starCoords[i * 3 + 2] = -5 - Math.random() * 25;
      starSizes[i] = 1.0 + Math.random() * 2.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xe0f2fe,
      size: 0.14,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // ═════════════════════════════════════════════════════════════
    // 5. LIGHTING RIG
    // ═════════════════════════════════════════════════════════════
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // Sun / Main Directional Light (Warm Specular Highlights)
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 4.0);
    sunLight.position.set(5, 7, 6);
    scene.add(sunLight);

    // Cyan Cosmic Rim Light
    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 3.5);
    cyanRim.position.set(-6, -4, 4);
    scene.add(cyanRim);

    // Emerald Edge Fill
    const emeraldRim = new THREE.DirectionalLight(0x00e575, 2.5);
    emeraldRim.position.set(0, 6, -5);
    scene.add(emeraldRim);

    // ═════════════════════════════════════════════════════════════
    // 6. MOUSE TRACKING & PARALLAX
    // ═════════════════════════════════════════════════════════════
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetX = x * 0.45;
      targetY = -y * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Intersection Observer for Performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // ═════════════════════════════════════════════════════════════
    // 7. ANIMATION LOOP
    // ═════════════════════════════════════════════════════════════
    let time = 0;
    let transitionProgress = 0; // 0 = cosmos, 1 = constellation

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      time += 0.012;

      // Smooth lerp mouse parallax
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      worldGroup.rotation.y = currentX * 0.35;
      worldGroup.rotation.x = currentY * 0.25;

      // Smooth phase transition between Cosmos and Constellation
      const targetTransition = activeModeRef.current === 'constellation' ? 1 : 0;
      transitionProgress += (targetTransition - transitionProgress) * 0.06;

      // Scale & Opacity blending
      cosmosGroup.scale.setScalar(1 - transitionProgress * 0.4);
      cosmosGroup.position.z = -transitionProgress * 6.0;
      cosmosGroup.visible = transitionProgress < 0.95;

      constellationGroup.scale.setScalar(0.7 + transitionProgress * 0.3);
      constellationGroup.position.z = (1 - transitionProgress) * -8.0;
      constellationGroup.visible = transitionProgress > 0.05;

      // Animate Primary Planet
      planetMesh.rotation.y += 0.0035;
      planetHalo.rotation.z += 0.002;

      // Animate Secondary Moon
      moonMesh.rotation.y += 0.005;
      moonMesh.rotation.x = Math.sin(time * 0.5) * 0.1;
      moonOrbitGroup.rotation.y += 0.015;

      // Animate Floating Clouds (Gentle horizontal drift)
      clouds.forEach((c, idx) => {
        c.position.y += Math.sin(time * 1.2 + idx) * 0.0008;
        c.position.x += Math.cos(time * 0.8 + idx) * 0.0005;
      });

      // Animate Supersonic Spacecraft & Volumetric Plume
      const shipBaseX = 2.8 + Math.cos(time * 0.7) * 0.4 + currentX * 0.8;
      const shipBaseY = -1.2 + Math.sin(time * 0.9) * 0.3 + currentY * 0.6;
      shipGroup.position.x = shipBaseX;
      shipGroup.position.y = shipBaseY;
      shipGroup.rotation.z = 0.45 + (targetX - currentX) * 0.8; // Bank into turn

      // Emit and recycle plume puffs
      plumePuffs.forEach((puffObj) => {
        puffObj.life += 0.018;
        if (puffObj.life >= 1.0) {
          puffObj.life = 0;
          // Spawn at rear of ship
          const rearOffset = new THREE.Vector3(-0.45, -0.3, -0.4).applyEuler(shipGroup.rotation);
          puffObj.mesh.position.copy(shipGroup.position).add(rearOffset);
          puffObj.mesh.visible = true;
        }

        // Expand and fade out along flight vector
        const progress = puffObj.life;
        const scale = 0.15 + progress * 0.55;
        puffObj.mesh.scale.set(scale, scale, scale);
        (puffObj.mesh.material as THREE.MeshStandardMaterial).opacity = (1 - progress) * 0.75;
        puffObj.mesh.position.x -= 0.025;
        puffObj.mesh.position.y -= 0.018;
      });

      // Animate Anamorphic Lens Flare
      flareGroup.position.x = 1.5 + Math.sin(time * 0.6) * 0.25;
      flareStreak.scale.x = 1.0 + Math.sin(time * 1.5) * 0.08;

      // Animate Constellation Star Nodes & Glows
      if (constellationGroup.visible) {
        constellationGroup.rotation.y = time * 0.2 + currentX * 0.4;
        constellationGroup.rotation.x = Math.sin(time * 0.3) * 0.15 + currentY * 0.3;

        starNodes.forEach((node, i) => {
          const pulse = 1.0 + Math.sin(time * 3.0 + i) * 0.25;
          node.children[1].scale.set(pulse, pulse, pulse);
        });
      }

      // Gentle Starfield Twinkle
      starField.rotation.y = time * 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // ═════════════════════════════════════════════════════════════
    // 8. CLEANUP
    // ═════════════════════════════════════════════════════════════
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();

      // Dispose geometries and materials
      flatPlanetGeo.dispose();
      planetMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      cloudMat.dispose();
      hullMat.dispose();
      canopyMat.dispose();
      wingMat.dispose();
      fuselageGeo.dispose();
      canopyGeo.dispose();
      wingGeo.dispose();
      puffGeo.dispose();
      streakGeo.dispose();
      streakMat.dispose();
      coreGlowGeo.dispose();
      coreGlowMat.dispose();
      ringFlareGeo.dispose();
      ringFlareMat.dispose();
      starNodeGeo.dispose();
      starNodeMat.dispose();
      starAuraGeo.dispose();
      starAuraMat.dispose();
      lineMat.dispose();
      lineGeos.forEach((g) => g.dispose());
      starGeometry.dispose();
      starMaterial.dispose();

      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center select-none ${className}`}>
      {/* Interactive 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[460px] sm:h-[520px] md:h-[580px] flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
      />

      {/* Mode Switch Pill matching StellarX Pinterest transition (Cosmic Orbit ⟷ Holographic Constellation) */}
      <div className="relative z-30 -mt-6 sm:-mt-8 flex items-center gap-2 p-1.5 rounded-full bg-black/60 border border-white/[0.12] backdrop-blur-xl shadow-2xl">
        <button
          onClick={() => setActiveMode('orbit')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono-cad tracking-wider transition-all cursor-pointer ${
            activeMode === 'orbit'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_12px_rgba(0,229,117,0.3)]'
              : 'text-neutral-400 hover:text-white border border-transparent'
          }`}
        >
          <Orbit className="w-3.5 h-3.5" />
          <span>COSMIC ORBIT</span>
        </button>

        <button
          onClick={() => setActiveMode('constellation')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono-cad tracking-wider transition-all cursor-pointer ${
            activeMode === 'constellation'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'text-neutral-400 hover:text-white border border-transparent'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AEGIS CONSTELLATION</span>
        </button>
      </div>
    </div>
  );
};
