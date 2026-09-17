import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Sentinel3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let isVisible = true;
    let animId: number;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    // Root Sentinel Pivot Group
    const sentinelGroup = new THREE.Group();
    scene.add(sentinelGroup);
    sentinelGroup.position.set(0, -1.1, 0);

    // -------------------------------------------------------------
    // 1. Torso & Aerospace Armor Assembly
    // -------------------------------------------------------------
    const torsoGroup = new THREE.Group();
    sentinelGroup.add(torsoGroup);

    // Armor Material
    const armorMaterial = new THREE.MeshStandardMaterial({
      color: 0xecf0f3,
      roughness: 0.28,
      metalness: 0.22,
    });

    const darkTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x11161d,
      roughness: 0.5,
      metalness: 0.4,
    });

    const cyanGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });

    const emeraldGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00e575,
      emissive: 0x00e575,
      emissiveIntensity: 2.8,
      roughness: 0.2,
    });

    // Chest Plate
    const chestGeo = new THREE.CylinderGeometry(0.95, 0.75, 1.1, 32);
    const chest = new THREE.Mesh(chestGeo, armorMaterial);
    chest.position.set(0, 0.35, 0);
    chest.scale.set(1.1, 1, 0.75);
    torsoGroup.add(chest);

    // Chest Accent Shield / Collar Trim
    const collarTrimGeo = new THREE.TorusGeometry(0.85, 0.08, 16, 48, Math.PI);
    const collarTrim = new THREE.Mesh(collarTrimGeo, cyanGlowMaterial);
    collarTrim.rotation.x = Math.PI * 0.5;
    collarTrim.position.set(0, 0.85, 0.1);
    torsoGroup.add(collarTrim);

    // Cyber Reactor Core Badge (Illuminated Center)
    const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 32);
    const coreMesh = new THREE.Mesh(coreGeo, emeraldGlowMaterial);
    coreMesh.rotation.x = Math.PI * 0.5;
    coreMesh.position.set(0, 0.52, 0.45);
    torsoGroup.add(coreMesh);

    // Outer Core Ring
    const coreRingGeo = new THREE.TorusGeometry(0.24, 0.03, 16, 32);
    const coreRing = new THREE.Mesh(coreRingGeo, darkTrimMaterial);
    coreRing.position.set(0, 0.52, 0.48);
    torsoGroup.add(coreRing);

    // Shoulders
    const shoulderGeo = new THREE.SphereGeometry(0.42, 32, 24);
    const shoulderL = new THREE.Mesh(shoulderGeo, armorMaterial);
    shoulderL.position.set(-1.15, 0.65, 0);
    shoulderL.scale.set(1, 0.9, 0.85);
    torsoGroup.add(shoulderL);

    const shoulderR = new THREE.Mesh(shoulderGeo, armorMaterial);
    shoulderR.position.set(1.15, 0.65, 0);
    shoulderR.scale.set(1, 0.9, 0.85);
    torsoGroup.add(shoulderR);

    // Shoulder Neon Accent Rings
    const shoulderRingGeo = new THREE.TorusGeometry(0.38, 0.035, 16, 32);
    const shoulderRingL = new THREE.Mesh(shoulderRingGeo, emeraldGlowMaterial);
    shoulderRingL.position.set(-1.15, 0.65, 0);
    shoulderRingL.rotation.y = Math.PI * 0.5;
    torsoGroup.add(shoulderRingL);

    const shoulderRingR = new THREE.Mesh(shoulderRingGeo, emeraldGlowMaterial);
    shoulderRingR.position.set(1.15, 0.65, 0);
    shoulderRingR.rotation.y = Math.PI * 0.5;
    torsoGroup.add(shoulderRingR);

    // -------------------------------------------------------------
    // 2. Neck & Head Assembly (Tracks Cursor Kinematics)
    // -------------------------------------------------------------
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 1.15, 0.05);
    sentinelGroup.add(headPivot);

    // Neck Collar
    const neckGeo = new THREE.CylinderGeometry(0.38, 0.45, 0.35, 32);
    const neck = new THREE.Mesh(neckGeo, darkTrimMaterial);
    neck.position.set(0, -0.1, 0);
    headPivot.add(neck);

    // Inner Cyber Face / Head
    const headInnerGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const headInnerMat = new THREE.MeshStandardMaterial({
      color: 0x1e2733,
      roughness: 0.4,
      metalness: 0.6,
    });
    const headInner = new THREE.Mesh(headInnerGeo, headInnerMat);
    headInner.position.set(0, 0.4, 0);
    headInner.scale.set(0.9, 1.05, 0.95);
    headPivot.add(headInner);

    // Sleek Cyber Visor / HUD Eye Bar
    const visorGeo = new THREE.BoxGeometry(0.68, 0.16, 0.3);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x00e575,
      emissive: 0x00e575,
      emissiveIntensity: 3.5,
      roughness: 0.1,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.46, 0.42);
    headPivot.add(visor);

    // Outer Space Helmet Dome (High-Transmission Curved Glass with Specular Highlights)
    const helmetGeo = new THREE.SphereGeometry(0.72, 48, 48);
    const glassHelmetMat = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      emissive: 0x083344,
      emissiveIntensity: 0.2,
      transmission: 0.88,
      thickness: 1.2,
      roughness: 0.05,
      ior: 1.5,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.75,
    });
    const helmet = new THREE.Mesh(helmetGeo, glassHelmetMat);
    helmet.position.set(0, 0.42, 0);
    helmet.scale.set(1.02, 1.05, 1.02);
    headPivot.add(helmet);

    // Helmet Base Ring
    const helmetRingGeo = new THREE.TorusGeometry(0.65, 0.045, 16, 48);
    const helmetRing = new THREE.Mesh(helmetRingGeo, cyanGlowMaterial);
    helmetRing.position.set(0, 0.08, 0);
    helmetRing.rotation.x = Math.PI * 0.5;
    headPivot.add(helmetRing);

    // -------------------------------------------------------------
    // 3. Lighting & Celestial Environment
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x06b6d4, 4.0);
    cyanRimLight.position.set(-5, 3, -4);
    scene.add(cyanRimLight);

    const emeraldRimLight = new THREE.DirectionalLight(0x00e575, 4.5);
    emeraldRimLight.position.set(5, -2, -3);
    scene.add(emeraldRimLight);

    // Core point light illuminating suit from within
    const coreLight = new THREE.PointLight(0x00e575, 3, 4);
    coreLight.position.set(0, 0.55, 0.6);
    torsoGroup.add(coreLight);

    // -------------------------------------------------------------
    // 4. Mouse Tracking Kinematics
    // -------------------------------------------------------------
    let targetYaw = 0;
    let targetPitch = 0;
    let curYaw = 0;
    let curPitch = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      // Clamped rotation targets (yaw ±38deg, pitch ±24deg)
      targetYaw = normX * 0.65;
      targetPitch = normY * 0.42;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Visibility Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    observer.observe(mount);

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 500;
      const h = mount.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // -------------------------------------------------------------
    // 5. Kinematic Animation Loop with Breathing Physics
    // -------------------------------------------------------------
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return;

      clock += 0.025;

      // Smooth damped lerp for physical head tracking
      curYaw += (targetYaw - curYaw) * 0.07;
      curPitch += (targetPitch - curPitch) * 0.07;

      // Idle breathing offset
      const breathing = Math.sin(clock * 1.4) * 0.025;
      sentinelGroup.position.y = -1.1 + breathing;

      // Head tracks cursor directly
      headPivot.rotation.y = curYaw;
      headPivot.rotation.x = curPitch;
      headPivot.rotation.z = -curYaw * 0.15; // subtle tilt roll

      // Torso follows with 40% damped offset
      torsoGroup.rotation.y = curYaw * 0.4;
      torsoGroup.rotation.x = curPitch * 0.25;
      torsoGroup.rotation.z = -curYaw * 0.06;

      // Pulsing chest core
      const corePulse = 2.5 + Math.sin(clock * 3) * 0.8;
      emeraldGlowMaterial.emissiveIntensity = corePulse;
      coreLight.intensity = corePulse;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();

      // Dispose Three.js memory cleanly
      chestGeo.dispose();
      collarTrimGeo.dispose();
      coreGeo.dispose();
      coreRingGeo.dispose();
      shoulderGeo.dispose();
      shoulderRingGeo.dispose();
      neckGeo.dispose();
      headInnerGeo.dispose();
      visorGeo.dispose();
      helmetGeo.dispose();
      helmetRingGeo.dispose();

      armorMaterial.dispose();
      darkTrimMaterial.dispose();
      cyanGlowMaterial.dispose();
      emeraldGlowMaterial.dispose();
      headInnerMat.dispose();
      visorMat.dispose();
      glassHelmetMat.dispose();

      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-[380px] sm:h-[450px] md:h-[500px] flex items-center justify-center select-none pointer-events-auto ${className}`}
      aria-label="Interactive 3D Sentinel model"
    />
  );
};
