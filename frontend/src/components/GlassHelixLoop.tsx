import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const GlassHelixLoop: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = true;
    let animId: number;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 460;

    const getCameraZ = (w: number) => {
      if (w < 440) return 10.5;
      if (w < 640) return 9.8;
      if (w < 1024) return 9.0;
      return 8.5;
    };

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, getCameraZ(width));

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Curve: Figure-8 / Lemniscate 3D Curve
    class FigureEightCurve extends THREE.Curve<THREE.Vector3> {
      scale: number;
      constructor(scale = 2.2) {
        super();
        this.scale = scale;
      }
      getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const point = optionalTarget;
        const u = t * Math.PI * 2;
        // Lemniscate of Gerono with 3D Z oscillation
        const x = this.scale * Math.sin(u) * 0.95;
        const y = this.scale * Math.sin(u) * Math.cos(u) * 1.85;
        const z = this.scale * Math.cos(u) * 0.45;
        return point.set(x, y, z);
      }
    }

    const curve = new FigureEightCurve(1.6);
    const tubeGeometry = new THREE.TubeGeometry(curve, 120, 0.28, 24, true);

    // Translucent Glass Material with Emerald Tint and Glossy Clearcoat
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0c3320,
      emissive: 0x062816,
      emissiveIntensity: 0.6,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 1.2,
      ior: 1.48,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.92,
    });

    const tubeMesh = new THREE.Mesh(tubeGeometry, glassMaterial);
    scene.add(tubeMesh);

    // Glowing Emerald Spheres Orbiting the Loop
    const sphereGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x00e575,
      emissive: 0x00e575,
      emissiveIntensity: 4.5,
      roughness: 0.15,
      metalness: 0.3,
    });

    const orb1 = new THREE.Mesh(sphereGeo, sphereMat);
    const orb2 = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(orb1);
    scene.add(orb2);

    // Point lights attached to spheres for volumetric cast light
    const light1 = new THREE.PointLight(0x00e575, 4.5, 7);
    const light2 = new THREE.PointLight(0x00e575, 4.5, 7);
    orb1.add(light1);
    orb2.add(light2);

    // Dynamic studio lighting for glass refraction & specular glints
    const ambientLight = new THREE.AmbientLight(0x133824, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(2, 6, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6ee7b7, 2.8);
    fillLight.position.set(6, 4, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00e575, 3.8);
    rimLight.position.set(-6, -5, -3);
    scene.add(rimLight);

    // Mouse Tracking Parallax
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = x * 0.45;
      targetRotX = -y * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0] || !container) return;
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = Math.max(-0.45, Math.min(0.45, x * 0.45));
      targetRotX = Math.max(-0.35, Math.min(0.35, -y * 0.35));
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Visibility and Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    observer.observe(container);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Resize Handler with Dynamic Mobile Aspect and Distance
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.position.z = getCameraZ(w);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Animation Loop
    let time = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return;

      time += 0.008;

      // Smooth lerp mouse/touch parallax
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      tubeMesh.rotation.x = currentRotX + Math.sin(time * 0.5) * 0.08;
      tubeMesh.rotation.y = currentRotY + Math.cos(time * 0.6) * 0.12;
      tubeMesh.rotation.z = Math.sin(time * 0.3) * 0.05;

      // Move orbs along the curve
      const t1 = (time * 0.22) % 1;
      const t2 = (time * 0.22 + 0.5) % 1;

      const p1 = curve.getPoint(t1);
      const p2 = curve.getPoint(t2);

      orb1.position.copy(p1);
      orb2.position.copy(p2);

      // Rotate orbs along with tubeMesh rotation
      orb1.position.applyEuler(tubeMesh.rotation);
      orb2.position.applyEuler(tubeMesh.rotation);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();

      tubeGeometry.dispose();
      glassMaterial.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[440px] sm:h-[520px] md:h-[620px] lg:h-[680px] flex items-center justify-center select-none pointer-events-auto ${className}`}
      aria-hidden="true"
    />
  );
};
