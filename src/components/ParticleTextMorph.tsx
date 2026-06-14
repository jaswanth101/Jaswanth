import React, { useEffect, useRef } from 'react';

interface ParticleTextMorphProps {
  activeItem: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // Target x
  ty: number; // Target y
  size: number;
  alpha: number;
}

export default function ParticleTextMorph({ activeItem }: ParticleTextMorphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Physics & Particle arrays
  const particlesRef = useRef<Particle[]>([]);
  const targetCoordsRef = useRef<{ x: number; y: number }[]>([]);
  const springStrengthRef = useRef<number>(0.08);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const isTransitioningRef = useRef<boolean>(false);
  const isInViewRef = useRef<boolean>(true);
  const triggerResizeRef = useRef<boolean>(false);

  const maxParticles = 5000;

  // Initialize offscreen canvas once
  useEffect(() => {
    const oCanvas = document.createElement('canvas');
    oCanvas.width = 3000;
    oCanvas.height = 600;
    offscreenCanvasRef.current = oCanvas;
    offscreenCtxRef.current = oCanvas.getContext('2d', { willReadFrequently: true });
  }, []);

  // IntersectionObserver to pause loop when canvas is off-screen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Handle resizing and DPI scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      triggerResizeRef.current = true;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    // Initial resize call
    handleResize();

    return () => resizeObserver.disconnect();
  }, []);

  // Draw vector icon to offscreen context
  const drawIcon = (ctx: CanvasRenderingContext2D, type: string, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    switch (type) {
      case 'VANAPALLI': {
        // Stylized elegant diamond geometric logo
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, 0);
        ctx.lineTo(0, size / 2);
        ctx.lineTo(-size / 2, 0);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, size / 5, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'HOME': {
        // House outline
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size * 0.5, -size * 0.1);
        ctx.lineTo(size * 0.3, -size * 0.1);
        ctx.lineTo(size * 0.3, size * 0.45);
        ctx.lineTo(-size * 0.3, size * 0.45);
        ctx.lineTo(-size * 0.3, -size * 0.1);
        ctx.lineTo(-size * 0.5, -size * 0.1);
        ctx.closePath();
        ctx.stroke();

        // Door
        ctx.beginPath();
        ctx.rect(-size * 0.1, size * 0.15, size * 0.2, size * 0.3);
        ctx.stroke();
        break;
      }
      case 'ABOUT': {
        // Info symbol inside circle
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.stroke();

        // dot
        ctx.beginPath();
        ctx.arc(0, -size / 5, 3, 0, Math.PI * 2);
        ctx.fill();

        // vertical stem
        ctx.beginPath();
        ctx.moveTo(0, -size / 15);
        ctx.lineTo(0, size / 4);
        ctx.lineWidth = 4;
        ctx.stroke();
        break;
      }
      case 'WORKS': {
        // Code tag brackets < >
        ctx.moveTo(-size * 0.15, -size * 0.35);
        ctx.lineTo(-size * 0.45, 0);
        ctx.lineTo(-size * 0.15, size * 0.35);

        ctx.moveTo(size * 0.15, -size * 0.35);
        ctx.lineTo(size * 0.45, 0);
        ctx.lineTo(size * 0.15, size * 0.35);
        ctx.stroke();

        // Slash
        ctx.beginPath();
        ctx.moveTo(size * 0.1, -size * 0.45);
        ctx.lineTo(-size * 0.1, size * 0.45);
        ctx.stroke();
        break;
      }
      case 'LINKEDIN': {
        // Rounded square with 'in' inside
        ctx.roundRect(-size / 2, -size / 2, size, size, 8);
        ctx.fill();

        // Subtract the letters 'in'
        ctx.globalCompositeOperation = 'destination-out';
        ctx.font = `bold ${size * 0.65}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('in', size * 0.03, -size * 0.02);
        break;
      }
      case 'GITHUB': {
        // Github silhouette head and ears
        ctx.arc(0, size * 0.05, size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Left Ear
        ctx.beginPath();
        ctx.moveTo(-size * 0.28, -size * 0.22);
        ctx.lineTo(-size * 0.22, -size * 0.45);
        ctx.lineTo(-size * 0.08, -size * 0.3);
        ctx.closePath();
        ctx.fill();

        // Right Ear
        ctx.beginPath();
        ctx.moveTo(size * 0.28, -size * 0.22);
        ctx.lineTo(size * 0.22, -size * 0.45);
        ctx.lineTo(size * 0.08, -size * 0.3);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'WHATSAPP': {
        // Speech bubble
        ctx.arc(0, -size * 0.05, size * 0.42, 0, Math.PI * 2);
        ctx.stroke();

        // Triangle tail
        ctx.beginPath();
        ctx.moveTo(-size * 0.2, size * 0.25);
        ctx.lineTo(-size * 0.42, size * 0.42);
        ctx.lineTo(-size * 0.32, size * 0.12);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();

        // Phone receiver curve
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.18, Math.PI * 0.95, Math.PI * 1.55);
        ctx.lineWidth = 4;
        ctx.stroke();
        break;
      }
      case 'EMAIL': {
        // Envelope outline
        ctx.rect(-size / 2, -size * 0.35, size, size * 0.7);
        ctx.stroke();

        // Flap folds
        ctx.beginPath();
        ctx.moveTo(-size / 2, -size * 0.35);
        ctx.lineTo(0, size * 0.05);
        ctx.lineTo(size / 2, -size * 0.35);
        ctx.stroke();
        break;
      }
      default:
        break;
    }
    ctx.restore();
  };

  // Generate target coordinate list using the offscreen canvas
  const getTargetCoordinates = (text: string, iconType: string) => {
    const oCtx = offscreenCtxRef.current;
    const oCanvas = offscreenCanvasRef.current;
    if (!oCtx || !oCanvas) return [];

    oCtx.clearRect(0, 0, oCanvas.width, oCanvas.height);
    oCtx.save();

    // Render configuration
    oCtx.font = '900 160px "Cabinet Grotesk", "Syne", "Plus Jakarta Sans", sans-serif';
    (oCtx as any).letterSpacing = '18px'; // Wide letter spacing for distinct character-to-character separation
    oCtx.fillStyle = 'white';
    oCtx.textAlign = 'left';
    oCtx.textBaseline = 'middle';

    const textWidth = oCtx.measureText(text).width;
    const hasIcon = iconType !== 'VANAPALLI';
    const centerY = oCanvas.height / 2;

    if (hasIcon) {
      const iconSize = 125;
      const spacing = 40;
      const totalWidth = iconSize + spacing + textWidth;
      const startX = (oCanvas.width - totalWidth) / 2;

      drawIcon(oCtx, iconType, startX + iconSize / 2, centerY, iconSize);
      oCtx.fillText(text, startX + iconSize + spacing, centerY);
    } else {
      // Center the text alone without any icon offset
      const startX = (oCanvas.width - textWidth) / 2;
      oCtx.fillText(text, startX, centerY);
    }
    oCtx.restore();

    // Scan pixel data
    const imgData = oCtx.getImageData(0, 0, oCanvas.width, oCanvas.height);
    const data = imgData.data;
    const coords: { x: number; y: number }[] = [];

    const step = 6; // Grid step size to arrange dots in a clean vertical/horizontal grid matrix
    for (let y = 0; y < oCanvas.height; y += step) {
      for (let x = 0; x < oCanvas.width; x += step) {
        const idx = (y * oCanvas.width + x) * 4;
        const alpha = data[idx + 3];
        if (alpha > 200) { // Strict alpha threshold to capture only solid grid lines
          coords.push({ x, y });
        }
      }
    }

    // Shuffle coords randomly to create a beautiful intersecting path transition
    for (let i = coords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coords[i], coords[j]] = [coords[j], coords[i]];
    }

    return coords;
  };

  // Trigger disintegration and remap particles to new targets
  const morphTo = (text: string, iconType: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get scanned offscreen target coordinate set
    const rawTargets = getTargetCoordinates(text, iconType);
    if (rawTargets.length === 0) return;

    targetCoordsRef.current = rawTargets;
    isTransitioningRef.current = true;
    springStrengthRef.current = 0.005; // Reset spring force so particles float loosely first

    // Calculate active bounding box of target points
    let minX = 3000;
    let maxX = 0;
    let minY = 600;
    let maxY = 0;

    for (let i = 0; i < rawTargets.length; i++) {
      const pt = rawTargets[i];
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    }

    const boundingWidth = maxX - minX || 1;
    const boundingHeight = maxY - minY || 1;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const width = canvas.width;
    const height = canvas.height;

    // Scale calculation to fit the container dynamically (using 15% padding at sides)
    const paddingX = width * 0.15;
    const paddingY = height * 0.15;

    const scaleX = (width - paddingX) / boundingWidth;
    const scaleY = (height - paddingY) / boundingHeight;

    // Proportionally scale to fit container height/width, capped for short words so they remain neat
    let scale = Math.min(scaleX, scaleY);
    scale = Math.min(scale, 2.5);

    const targetCount = rawTargets.length;
    const particles = particlesRef.current;

    // Reposition targets mapped onto the active canvas bounds
    for (let i = 0; i < maxParticles; i++) {
      const targetPoint = rawTargets[i % targetCount];

      // Translate to main canvas center and round to nearest integer to snap on grid lines
      const tx = Math.round((width / 2) + (targetPoint.x - centerX) * scale);
      const ty = Math.round((height / 2) + (targetPoint.y - centerY) * scale);

      // Assign targets exactly to follow clean horizontal and vertical lines
      const p = particles[i];
      if (p) {
        p.tx = tx;
        p.ty = ty;

        // Apply a disintegration force vector outwards or randomly
        const angle = Math.random() * Math.PI * 2;
        const blastForce = 4 + Math.random() * 10;
        p.vx += Math.cos(angle) * blastForce;
        p.vy += Math.sin(angle) * blastForce;
      }
    }
  };

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles array (uniform size and high opacity for clean grid dots)
    const particles: Particle[] = [];
    for (let i = 0; i < maxParticles; i++) {
      const x = Math.random() * window.innerWidth * window.devicePixelRatio;
      const y = Math.random() * 380 * window.devicePixelRatio;
      particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        tx: x,
        ty: y,
        size: 2.2 + Math.random() * 0.8,
        alpha: 0.95 + Math.random() * 0.05,
      });
    }
    particlesRef.current = particles;

    // Initial morph target configuration
    morphTo('VANAPALLI JASWANTH', 'VANAPALLI');

    let animationFrameId: number;

    const render = () => {
      if (!isInViewRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;

      // Handle delayed canvas resize mapping adjustments
      if (triggerResizeRef.current) {
        triggerResizeRef.current = false;
        morphTo(activeItem, activeItem);
      }

      // Clear the canvas completely every frame for perfectly crisp, sharp particles (no blurry trails)
      ctx.clearRect(0, 0, width, height);

      // Interpolate spring strength back to normal
      springStrengthRef.current = Math.min(0.09, springStrengthRef.current + 0.0018);
      const spring = springStrengthRef.current;
      const friction = 0.84;

      const mouse = mouseRef.current;

      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];

        // 1. Calculate distance to target
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const distSq = dx * dx + dy * dy;

        // Snapping threshold: if close and not being repelled, snap exactly to target
        let snapped = false;
        if (distSq < 0.16 && !mouse.active) {
          p.x = p.tx;
          p.y = p.ty;
          p.vx = 0;
          p.vy = 0;
          snapped = true;
        } else {
          // Spring force to target coordinate
          p.vx += dx * spring;
          p.vy += dy * spring;
        }

        // 2. Mouse deflection repulsion
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;
          const repulsionRadius = 90 * window.devicePixelRatio;
          const repulsionRadiusSq = repulsionRadius * repulsionRadius;

          if (mDistSq < repulsionRadiusSq) {
            const dist = Math.sqrt(mDistSq) || 0.001;
            const force = ((repulsionRadius - dist) / repulsionRadius) * 6;
            p.vx += (mdx / dist) * force;
            p.vy += (mdy / dist) * force;
            snapped = false; // Deflected particles are no longer snapped
          }
        }

        // 3. Physics damping update (only if not snapped)
        if (!snapped) {
          p.vx *= friction;
          p.vy *= friction;
          p.x += p.vx;
          p.y += p.vy;

          // 4. Subtle sand Brownian vibration
          p.x += (Math.random() - 0.5) * 0.08;
          p.y += (Math.random() - 0.5) * 0.08;
        }

        // 5. Drawing crisp circular particle core
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Listen to changes in the active hover menu item
  useEffect(() => {
    // Skip the initial mount morph trigger (handled inside canvas init effect)
    if (particlesRef.current.length > 0) {
      // Clean display values
      let text = activeItem;
      let iconType = activeItem;
      if (activeItem === 'VANAPALLI JASWANTH') iconType = 'VANAPALLI';
      if (activeItem === 'WHATSAPP') text = 'WHATSAPP';
      if (activeItem === 'LINKEDIN') text = 'LINKEDIN';
      if (activeItem === 'GITHUB') text = 'GITHUB';
      morphTo(text, iconType);
    }
  }, [activeItem]);

  // Handle canvas mouse move interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) * window.devicePixelRatio,
      y: (e.clientY - rect.top) * window.devicePixelRatio,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full block cursor-default select-none touch-none"
      style={{ background: 'transparent' }}
    />
  );
}
