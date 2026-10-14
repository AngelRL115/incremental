import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
}

interface ParticleFieldProps {
  readonly reducedEffects: boolean;
  readonly milestonePulse: number;
  readonly onError: (message: string) => void;
}

const PALETTE = ["#5ce1d0", "#f8be75", "#bd9aff", "#85c9ff"] as const;

function makeParticles(count: number, width: number, height: number): Particle[] {
  return Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 16,
    vy: (Math.random() - 0.5) * 16,
    radius: 0.8 + Math.random() * 1.8,
    phase: index % PALETTE.length,
  }));
}

export function ParticleField({ reducedEffects, milestonePulse, onError }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulseRef = useRef(milestonePulse);
  const errorRef = useRef(onError);
  pulseRef.current = milestonePulse;
  errorRef.current = onError;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas) {
      errorRef.current("No se pudo iniciar el campo visual. Recarga para volver a intentarlo.");
      return;
    }
    if (!context) {
      errorRef.current("Este navegador no puede representar Canvas 2D. La economía sigue disponible.");
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let particles: Particle[] = [];
    let frame = 0;
    let previousTime = 0;
    let elapsed = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const nextRatio = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.max(1, bounds.width);
      const nextHeight = Math.max(1, bounds.height);
      if (nextWidth === width && nextHeight === height && nextRatio === pixelRatio) return;
      width = nextWidth;
      height = nextHeight;
      pixelRatio = nextRatio;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = makeParticles(reducedEffects ? 42 : 86, width, height);
    };

    const draw = (time: number) => {
      resize();
      const dt = previousTime === 0 ? 0 : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      if (!media.matches && !reducedEffects) elapsed += dt;

      context.fillStyle = "#08171a";
      context.fillRect(0, 0, width, height);
      const pulse = Math.exp(-Math.max(0, (time - pulseRef.current) / 850));
      const centerX = width * 0.5;
      const centerY = height * 0.52;
      const reach = Math.min(width, height) * (0.22 + pulse * 0.24);

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index]!;
        if (!media.matches && !reducedEffects) {
          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        }

        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < reach) {
          context.strokeStyle = `rgba(92, 225, 208, ${0.13 * (1 - distance / reach)})`;
          context.lineWidth = 0.6;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(centerX, centerY);
          context.stroke();
        }

        const shimmer = media.matches || reducedEffects ? 1 : 0.72 + Math.sin(elapsed * 1.4 + index) * 0.16;
        context.fillStyle = PALETTE[particle.phase]!;
        context.globalAlpha = shimmer;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius + pulse * 0.7, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      if (!media.matches && !reducedEffects) frame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    draw(0);
    if (!media.matches && !reducedEffects) frame = window.requestAnimationFrame(draw);
    const motionChange = () => {
      window.cancelAnimationFrame(frame);
      previousTime = 0;
      draw(performance.now());
    };
    media.addEventListener("change", motionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("change", motionChange);
      observer.disconnect();
    };
  }, [reducedEffects]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-field"
      aria-hidden="true"
      data-milestone={milestonePulse}
    />
  );
}
