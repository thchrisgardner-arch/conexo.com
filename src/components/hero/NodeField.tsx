"use client";

import { useEffect, useRef } from "react";
import { MQ } from "@/lib/gsap";

type Node = { x: number; y: number; vx: number; vy: number; r: number; c: string | null };

const ACCENTS = ["#b7ff3c", "#5b5bff", "#ff6b9d", "#ffd84d"];

/**
 * Red de nodos en canvas 2D: se conectan por proximidad y el cursor
 * actúa como un nodo más que atrae suavemente a los cercanos.
 * Se pausa fuera de viewport / pestaña oculta. Estática con reduced motion.
 */
export default function NodeField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia(MQ.reduce).matches;
    let w = 0,
      h = 0,
      dpr = 1,
      nodes: Node[] = [],
      raf = 0,
      running = false,
      linkDist = 160;
    const mouse = { x: -9999, y: -9999, active: false };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = w < 768;
      const count = Math.min(mobile ? 26 : 64, Math.round((w * h) / (mobile ? 16000 : 21000)));
      linkDist = mobile ? 110 : Math.min(180, w / 9);
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() < 0.12 ? 3.2 : 1.6,
        c: i % 9 === 0 ? ACCENTS[(i / 9) % ACCENTS.length] : null,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!reduce) {
          // atracción leve al cursor
          if (mouse.active) {
            const dx = mouse.x - n.x;
            const dy = mouse.y - n.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 240 * 240) {
              n.vx += dx * 0.00004;
              n.vy += dy * 0.00004;
            }
          }
          n.vx *= 0.995;
          n.vy *= 0.995;
          // velocidad mínima para que nunca se quede quieto
          const sp = Math.hypot(n.vx, n.vy);
          if (sp < 0.08) {
            n.vx += (Math.random() - 0.5) * 0.02;
            n.vy += (Math.random() - 0.5) * 0.02;
          }
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20;
          if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          if (n.y > h + 20) n.y = -20;
        }
      }

      // aristas
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            ctx.strokeStyle = `rgba(247,245,239,${(1 - d / linkDist) * 0.16})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (mouse.active) {
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (d < linkDist * 1.4) {
            ctx.strokeStyle = `rgba(183,255,60,${(1 - d / (linkDist * 1.4)) * 0.7})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // nodos
      for (const n of nodes) {
        ctx.fillStyle = n.c ?? "rgba(247,245,239,0.55)";
        if (n.c && n.r > 2) {
          ctx.fillRect(n.x - 3.5, n.y - 3.5, 7, 7);
        } else {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.c ? 3 : n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    build();
    draw();

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.y > 0 && mouse.y < rect.height;
    };
    const onLeave = () => (mouse.active = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => {
        build();
        draw();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
