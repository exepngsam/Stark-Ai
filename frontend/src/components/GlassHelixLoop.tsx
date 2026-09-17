import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const GlassHelixLoop: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = true;
    let animId: number;

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 520;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

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

    // Translucent Glass Material with Emerald Tint
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a2e22,
      emissive: 0x051a0e,
      emissiveIntensity: 0.4,
      metalness: 0.1,
      roughness: 0.08,
      transmission: 0.92,
      thickness: 1.5,
      ior: 1.52,
      reflectivity: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.88,
    });

    const tubeMesh = new THREE.Mesh(tubeGeometry, glassMaterial);
    scene.add(tubeMesh);

    // Glowing Emerald Spheres Orbiting the Loop
    const sphereGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x00e575,
      emissive: 0x00e575,
      emissiveIntensity: 3.5,
      roughness: 0.2,
      metalness: 0.5,
    });

    const orb1 = new THREE.Mesh(sphereGeo, sphereMat);
    const orb2 = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(orb1);
    scene.add(orb2);

    // Point lights attached to spheres for volumetric cast light
    const light1 = new THREE.PointLight(0x00e575, 4, 6);
    const light2 = new THREE.PointLight(0x00e575, 4, 6);
    orb1.add(light1);
    orb2.add(light2);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x88ffbb, 2.5);
    directionalLight.position.set(5, 8, 6);
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x00e575, 3.0);
    rimLight.position.set(-6, -6, -4);
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

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 420;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
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

      // Smooth lerp mouse parallax
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
      className={`relative w-full h-[450px] md:h-[550px] flex items-center justify-center select-none pointer-events-auto ${className}`}
      aria-hidden="true"
    />
  );
};
