import { useEffect, useRef } from 'react';

/**
 * Interactive2DCanvas — 2D Architectural Particle Grid & Interactive Nodes
 * Creates subtle vector nodes, connecting grid lines, and cursor-reactive floating objects
 * for editorial agency hero sections and storytelling backgrounds.
 */
export function Interactive2DCanvas({ opacity = 0.6, density = 35 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let mouse = { x: width / 2, y: height / 2, active: false };

    // Generate architectural points
    const points = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.3 ? '#121212' : '#AF994D',
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background architectural grid lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw Points
      points.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction push
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            p.x -= (dx / dist) * 0.8;
            p.y -= (dy / dist) * 0.8;
          }
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby points with delicate hairline vectors
        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.strokeStyle = `rgba(18, 18, 18, ${(1 - dist / 110) * 0.08})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity }}
    />
  );
}

/**
 * ScrollProgressBar — 21st.dev Top Scroll Progress Indicator
 */
export function ScrollProgressBar() {
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
      ref.current.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] bg-transparent z-[100] pointer-events-none">
      <div
        ref={ref}
        className="h-full bg-gradient-to-r from-black via-[#AF994D] to-black origin-left transition-transform duration-75 ease-out"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

/**
 * AnimatedSVGObject — Interactive Floating 2D Vector Geometry
 */
export function AnimatedSVGObject({ type = 'ring', className = '' }) {
  if (type === 'ring') {
    return (
      <svg className={`animate-spin-slow ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="#121212" strokeWidth="1" strokeDasharray="4 6" opacity="0.25" />
        <circle cx="50" cy="50" r="32" stroke="#AF994D" strokeWidth="1.5" opacity="0.4" />
        <circle cx="82" cy="50" r="4" fill="#AF994D" />
      </svg>
    );
  }

  if (type === 'grid-nodes') {
    return (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10H110V110H10V10Z" stroke="#121212" strokeWidth="1" strokeDasharray="2 4" opacity="0.2" />
        <path d="M10 60H110M60 10V110" stroke="#AF994D" strokeWidth="1" opacity="0.3" />
        <circle cx="60" cy="60" r="3" fill="#121212" />
        <circle cx="10" cy="10" r="2" fill="#AF994D" />
        <circle cx="110" cy="110" r="2" fill="#AF994D" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 0L80 40L40 80L0 40L40 0Z" stroke="#121212" strokeWidth="1" opacity="0.2" />
      <path d="M40 15L65 40L40 65L15 40L40 15Z" stroke="#AF994D" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}
