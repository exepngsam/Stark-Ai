import React, { useEffect, useRef } from 'react';

export const AuroraRibbon: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;
    let isVisible = true;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 450;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      step += 0.008;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw 3 layered flowing sinusoidal ribbon paths
      const layers = [
        { yBase: height * 0.48, amplitude: 35, frequency: 0.0025, speed: step, opacity: 0.18, color1: '#00e575', color2: '#10b981', lineWidth: 40 },
        { yBase: height * 0.52, amplitude: 50, frequency: 0.002, speed: step * 0.85 + 1.2, opacity: 0.22, color1: '#10b981', color2: '#059669', lineWidth: 65 },
        { yBase: height * 0.50, amplitude: 28, frequency: 0.003, speed: step * 1.15 + 2.4, opacity: 0.12, color1: '#34d399', color2: '#00e575', lineWidth: 25 },
      ];

      layers.forEach((layer) => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 6) {
          const y =
            layer.yBase +
            Math.sin(x * layer.frequency + layer.speed) * layer.amplitude +
            Math.cos(x * layer.frequency * 0.5 + layer.speed * 0.7) * (layer.amplitude * 0.4);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(0, 229, 117, 0)');
        gradient.addColorStop(0.25, `rgba(0, 229, 117, ${layer.opacity})`);
        gradient.addColorStop(0.5, `rgba(16, 185, 129, ${layer.opacity * 1.3})`);
        gradient.addColorStop(0.75, `rgba(52, 211, 153, ${layer.opacity})`);
        gradient.addColorStop(1, 'rgba(0, 229, 117, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = layer.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.filter = 'blur(16px)';
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className={`relative w-full overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full block opacity-75" />
    </div>
  );
};
