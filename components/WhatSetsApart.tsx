"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Slide Data ─── */
const slides = [
  {
    label: "Execution",
    heading: "I don't just learn — I apply fast",
    description:
      "I turn concepts into real, working projects quickly instead of staying stuck in tutorials, accelerating both my skills and portfolio.",
  },
  {
    label: "Systems Thinking",
    heading: "I think in systems, not just code",
    description:
      "I focus on how everything connects—UI, logic, user experience, and performance—not just isolated features.",
  },
  {
    label: "Iteration",
    heading: "I value execution over perfection",
    description:
      "I ship, test, and refine continuously, improving through iteration instead of chasing perfect code.",
  },
  {
    label: "Intent",
    heading: "I build with purpose, not noise",
    description:
      "Every project I create solves a real problem, improves a workflow, or demonstrates a clear skill.",
  },
];

/* ════════════════════════════════════════════════
   3D Multi-Shape Particle Morph Canvas
   ════════════════════════════════════════════════ */

const NEON = "#CCFF00";
const N_TOTAL = 160;
const CUBE_SIZE = 145;

/* ─── Math Helpers ─── */
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface Vec3 { x: number; y: number; z: number; }
interface EdgePair { a: number; b: number; }

/* ─── Ambient Particles ─── */
function getAmbient(i: number, time: number): Vec3 {
  const seed = i * 1337;
  const r = 250 + (seed % 100);
  const theta = (seed % 314) / 50 + time * 0.005 * (seed % 3 === 0 ? 1 : -1);
  const phi = (seed % 314) / 100 + time * 0.003;
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
}

/* ─── SHAPE 1: 4x4x4 Cube (64 nodes) ─── */
const shape1Edges: EdgePair[] = [];
for (let gz = 0; gz < 4; gz++) {
  for (let gy = 0; gy < 4; gy++) {
    for (let gx = 0; gx < 4; gx++) {
      const idx = gz * 16 + gy * 4 + gx;
      if (gx < 3) shape1Edges.push({ a: idx, b: idx + 1 });
      if (gy < 3) shape1Edges.push({ a: idx, b: idx + 4 });
      if (gz < 3) shape1Edges.push({ a: idx, b: idx + 16 });
    }
  }
}
const getShape1Pos = (i: number, time: number): Vec3 => {
  if (i < 64) {
    const gx = i % 4;
    const gy = Math.floor(i / 4) % 4;
    const gz = Math.floor(i / 16);
    return {
      x: (gx / 3 - 0.5) * CUBE_SIZE * 2,
      y: (gy / 3 - 0.5) * CUBE_SIZE * 2,
      z: (gz / 3 - 0.5) * CUBE_SIZE * 2,
    };
  }
  return getAmbient(i, time);
};

/* ─── SHAPE 2: Iteration / Infinity Loop (100 nodes) ─── */
const shape2Edges: EdgePair[] = [];
for (let i = 0; i < 100; i++) shape2Edges.push({ a: i, b: i === 99 ? 0 : i + 1 });
const getShape2Pos = (i: number, time: number): Vec3 => {
  if (i < 100) {
    const t = (i / 100) * Math.PI * 2 + time * 0.015;
    const a = CUBE_SIZE * 1.4;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    return {
      x: (a * Math.cos(t)) / denom,
      y: (a * Math.sin(t) * Math.cos(t)) / denom,
      z: Math.sin(i * 0.2 + time * 0.04) * 40,
    };
  }
  return getAmbient(i, time);
};

/* ─── SHAPE 3: Intent / Cube inside 2 Circles (132 nodes) ─── */
const shape3Edges: EdgePair[] = [];
// Inner Cube (0..26)
for (let gz = 0; gz < 3; gz++) {
  for (let gy = 0; gy < 3; gy++) {
    for (let gx = 0; gx < 3; gx++) {
      const idx = gz * 9 + gy * 3 + gx;
      if (gx < 2) shape3Edges.push({ a: idx, b: idx + 1 });
      if (gy < 2) shape3Edges.push({ a: idx, b: idx + 3 });
      if (gz < 2) shape3Edges.push({ a: idx, b: idx + 9 });
    }
  }
}
// Circle 1 (27..71)
for (let i = 27; i < 72; i++) shape3Edges.push({ a: i, b: i === 71 ? 27 : i + 1 });
// Circle 2 (72..131)
for (let i = 72; i < 132; i++) shape3Edges.push({ a: i, b: i === 131 ? 72 : i + 1 });

const getShape3Pos = (i: number, time: number): Vec3 => {
  if (i < 27) {
    const gx = i % 3;
    const gy = Math.floor(i / 3) % 3;
    const gz = Math.floor(i / 9);
    const size = CUBE_SIZE * 0.45;
    const aY = -time * 0.015;
    const aX = time * 0.01;
    const x0 = (gx / 2 - 0.5) * size * 2;
    const y0 = (gy / 2 - 0.5) * size * 2;
    const z0 = (gz / 2 - 0.5) * size * 2;
    const y1 = y0 * Math.cos(aX) - z0 * Math.sin(aX);
    const z1 = y0 * Math.sin(aX) + z0 * Math.cos(aX);
    const x2 = x0 * Math.cos(aY) + z1 * Math.sin(aY);
    const z2 = -x0 * Math.sin(aY) + z1 * Math.cos(aY);
    return { x: x2, y: y1, z: z2 };
  } else if (i < 72) {
    const t = ((i - 27) / 45) * Math.PI * 2 + time * 0.02;
    const r = CUBE_SIZE * 1.1;
    const cx = r * Math.cos(t);
    const cy = r * Math.sin(t);
    const tiltX = 0.6;
    const tiltY = -0.4;
    return {
      x: cx * Math.cos(tiltY),
      y: cx * Math.sin(tiltY) + cy * Math.cos(tiltX),
      z: cy * Math.sin(tiltX),
    };
  } else if (i < 132) {
    const t = ((i - 72) / 60) * Math.PI * 2 - time * 0.015;
    const r = CUBE_SIZE * 1.45;
    const cx = r * Math.cos(t);
    const cy = r * Math.sin(t);
    const tiltX = -0.5;
    const tiltY = 0.5;
    return {
      x: cx * Math.cos(tiltY),
      y: cx * Math.sin(tiltY) + cy * Math.cos(tiltX),
      z: cy * Math.sin(tiltX),
    };
  }
  return getAmbient(i, time);
};

interface ShapeDef {
  getPos: (i: number, time: number) => Vec3;
  edges: EdgePair[];
  isNode: (i: number) => boolean;
}
const SHAPES: ShapeDef[] = [
  { getPos: getShape1Pos, edges: shape1Edges, isNode: (i) => i < 64 },
  { getPos: getShape2Pos, edges: shape2Edges, isNode: (i) => i < 100 },
  { getPos: getShape3Pos, edges: shape3Edges, isNode: (i) => i < 132 },
];

/* ─── 3D to 2D Projection ─── */
interface Projected2D { px: number; py: number; depth: number; scale: number; }
function project(
  v: Vec3,
  angleY: number,
  angleX: number,
  cx: number,
  cy: number,
  fov = 500
): Projected2D {
  const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
  const x1 = v.x * cosY + v.z * sinY;
  const z1 = -v.x * sinY + v.z * cosY;
  const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
  const y1 = v.y * cosX - z1 * sinX;
  const z2 = v.y * sinX + z1 * cosX;
  const s = fov / (fov + z2 + 250);
  return { px: cx + x1 * s, py: cy + y1 * s, depth: z2, scale: s };
}

/* ─── Particle Structure ─── */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  ambientR: number; nodeR: number;
  ambientBright: number; nodeBright: number;
  r: number; bright: number; phase: number; delay: number;
  sx: number; sy: number;
  depth: number;
  trail: { x: number; y: number }[];
  isNode: boolean; pulse: number;
}
function makeParticle(W: number, H: number): Particle {
  const m = W * 0.13;
  const x = m + Math.random() * (W - 2 * m);
  const y = m + Math.random() * (H - 2 * m);
  return {
    x, y,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    ambientR: 0.5 + Math.random() * 1.0,
    nodeR: 2.0 + Math.random() * 1.5,
    ambientBright: 0.22 + Math.random() * 0.38,
    nodeBright: 0.85 + Math.random() * 0.15,
    r: 1, bright: 1,
    phase: Math.random() * Math.PI * 2,
    delay: Math.random() * 0.35,
    sx: x, sy: y, depth: 0,
    trail: [], isNode: false, pulse: 1,
  };
}

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */
export default function WhatSetsApart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const mainHeadingRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  /* ─── Canvas Refs ─── */
  const morphProgRef = useRef(0);
  const simStateRef = useRef<"chaos" | "structured">("chaos");
  const particlesRef = useRef<Particle[]>([]);
  const angleYRef = useRef(0.4);
  const angleXRef = useRef(0.25);
  const globalFrameRef = useRef(0);

  /* ─── Canvas Engine ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const W = parent.clientWidth;
      const H = parent.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        const ps: Particle[] = [];
        for (let i = 0; i < N_TOTAL; i++) ps.push(makeParticle(W, H));
        particlesRef.current = ps;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const isVisibleRef = { current: false }; // Local ref to avoid rerenders
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const drawChaosLines = (W: number, H: number, alpha: number) => {
      const thr = W * 0.135;
      const pts = particlesRef.current;
      ctx.lineWidth = 0.4;
      for (let i = 0; i < pts.length; i++) {
        let conns = 0;
        for (let j = i + 1; j < pts.length; j++) {
          if (conns >= 3) break;
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < thr * thr) {
            const a = (1 - Math.sqrt(d2) / thr) * 0.3 * alpha;
            ctx.strokeStyle = `rgba(204,255,0,${a})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
            conns++;
          }
        }
      }
    };

    const drawShapeEdges = (shapeIdx: number, alpha: number) => {
      const edges = SHAPES[shapeIdx].edges;
      const pts = particlesRef.current;
      ctx.shadowBlur = 4; ctx.shadowColor = NEON;
      for (const e of edges) {
        const pa = pts[e.a], pb = pts[e.b];
        const depthFade = clamp(((pa.depth + pb.depth) / 2 + 200) / 400, 0.15, 1);
        ctx.strokeStyle = `rgba(204,255,0,${alpha * 0.55 * depthFade})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    };

    let raf: number;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!isVisibleRef.current) return; // Skip all heavy rendering if not on screen

      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      globalFrameRef.current++;
      const gf = globalFrameRef.current;
      const st = simStateRef.current;
      const P = morphProgRef.current;
      const pts = particlesRef.current;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      angleYRef.current += 0.005;
      const aY = angleYRef.current;
      const aX = angleXRef.current;
      const cx = W / 2, cy = H / 2;

      let seg = 0, localP = 0;
      if (st === "structured") {
        seg = Math.floor(P);
        localP = P - seg;
        if (seg >= 3) { seg = 2; localP = 1; }
      }

      /* ─── Physics & Interpolation ─── */
      for (let i = 0; i < N_TOTAL; i++) {
        const p = pts[i];

        if (st === "chaos") {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 14) { p.x = 14; p.vx = Math.abs(p.vx); }
          if (p.x > W - 14) { p.x = W - 14; p.vx = -Math.abs(p.vx); }
          if (p.y < 14) { p.y = 14; p.vy = Math.abs(p.vy); }
          if (p.y > H - 14) { p.y = H - 14; p.vy = -Math.abs(p.vy); }
          if (p.trail.length > 0) p.trail.shift();
          
          p.isNode = false;
          p.pulse = 1;
          p.bright = p.ambientBright;
          p.r = p.ambientR;
          p.depth = 0;
        } else {
          const localT = clamp((localP - p.delay) / (1 - p.delay), 0, 1);
          const t = ease(localT);

          let px: number, py: number, depth: number;
          let isNodeFrom = false, isNodeTo = false;

          if (seg === 0) {
            const v1 = SHAPES[0].getPos(i, gf);
            const proj1 = project(v1, aY, aX, cx, cy);
            px = lerp(p.sx, proj1.px, t);
            py = lerp(p.sy, proj1.py, t);
            depth = lerp(0, proj1.depth, t);
            isNodeTo = SHAPES[0].isNode(i);
          } else {
            const shapeFrom = SHAPES[seg - 1];
            const shapeTo = SHAPES[seg];
            const vFrom = shapeFrom.getPos(i, gf);
            const vTo = shapeTo.getPos(i, gf);
            const projFrom = project(vFrom, aY, aX, cx, cy);
            const projTo = project(vTo, aY, aX, cx, cy);
            px = lerp(projFrom.px, projTo.px, t);
            py = lerp(projFrom.py, projTo.py, t);
            depth = lerp(projFrom.depth, projTo.depth, t);
            isNodeFrom = shapeFrom.isNode(i);
            isNodeTo = shapeTo.isNode(i);
          }

          const distSq = (px - p.x) * (px - p.x) + (py - p.y) * (py - p.y);
          if (distSq > 2.0) {
            p.trail.push({ x: px, y: py });
            if (p.trail.length > 10) p.trail.shift();
          } else {
            if (p.trail.length > 0) p.trail.shift();
          }

          p.x = px; p.y = py; p.depth = depth;

          const weight = lerp(isNodeFrom ? 1 : 0, isNodeTo ? 1 : 0, t);
          if (weight > 0.05) {
            p.isNode = true;
            p.pulse = 0.7 + 0.3 * Math.sin(gf * 0.045 + p.phase);
            p.bright = lerp(p.ambientBright, p.nodeBright, weight);
            p.r = lerp(p.ambientR, p.nodeR, weight);
          } else {
            p.isNode = false;
            p.pulse = 1;
            p.bright = p.ambientBright;
            p.r = p.ambientR;
          }
        }
      }

      /* ─── Lines Layer ─── */
      if (st === "chaos") {
        drawChaosLines(W, H, 1);
      } else {
        const mp = ease(localP);
        if (seg === 0) {
          if (1 - mp > 0.05) drawChaosLines(W, H, 1 - mp);
          if (mp > 0.05) drawShapeEdges(0, mp);
        } else {
          if (1 - mp > 0.05) drawShapeEdges(seg - 1, 1 - mp);
          if (mp > 0.05) drawShapeEdges(seg, mp);
        }
      }

      /* ─── Particles Layer ─── */
      for (let i = 0; i < N_TOTAL; i++) {
        const p = pts[i];
        const alpha = p.bright * (p.isNode ? p.pulse : 1);

        if (p.trail.length > 1) {
          for (let k = 1; k < p.trail.length; k++) {
            const ta = (k / p.trail.length) * 0.35 * alpha;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(204,255,0,${ta})`;
            ctx.lineWidth = p.r * 0.5;
            ctx.moveTo(p.trail[k - 1].x, p.trail[k - 1].y);
            ctx.lineTo(p.trail[k].x, p.trail[k].y);
            ctx.stroke();
          }
        }

        if (p.isNode && st !== "chaos") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.5 * p.pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(204,255,0,${alpha * 0.08})`;
          ctx.fill();
        }

        ctx.shadowBlur = p.isNode ? (st === "structured" ? 16 * p.pulse : 10) : 3;
        ctx.shadowColor = NEON;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (p.isNode ? p.pulse : 1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(204,255,0,${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      } // end for-loop
    }; // end draw function

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  /* ─── ScrollTrigger ─── */
  useEffect(() => {
    const container = containerRef.current;
    const pinned = pinnedRef.current;
    if (!container || !pinned) return;

    const slideEls = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    if (slideEls.length === 0) return;

    const ctx = gsap.context(() => {
      const totalSlides = slideEls.length;
      const tl = gsap.timeline();

      for (let i = 0; i < totalSlides; i++) {
        tl.to(slideEls[i], { duration: 2.5 });
        if (i < totalSlides - 1) {
          tl.to(slideEls[i], {
            autoAlpha: 0, y: -40,
            duration: 0.8, ease: "power2.in",
          });
          tl.to(slideEls[i + 1], {
            autoAlpha: 1, y: 0,
            duration: 0.8, ease: "power2.out",
          });
        }
      }

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: `+=${totalSlides * 100}%`,
        pin: pinned,
        pinSpacing: true,
        scrub: 1,
        animation: tl,
        snap: {
          snapTo: 1 / (totalSlides - 1),
          duration: { min: 0.4, max: 1.0 },
          delay: 0.1,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const progress = self.progress;
          const idx = Math.min(Math.floor(progress * totalSlides), totalSlides - 1);
          setActiveSlide(idx);

          // P goes 0.0 to 3.0 across the whole scrub
          const P = progress * (totalSlides - 1);
          const rawMorph = clamp(P, 0, 3);
          const prevState = simStateRef.current;

          if (rawMorph <= 0) {
            if (prevState !== "chaos") {
              simStateRef.current = "chaos";
              morphProgRef.current = 0;
              const W = canvasRef.current?.clientWidth ?? 600;
              const H = canvasRef.current?.clientHeight ?? 600;
              const m = W * 0.13;
              for (const p of particlesRef.current) {
                p.x = m + Math.random() * (W - 2 * m);
                p.y = m + Math.random() * (H - 2 * m);
                p.vx = (Math.random() - 0.5) * 1.5;
                p.vy = (Math.random() - 0.5) * 1.5;
                p.trail = [];
                p.delay = Math.random() * 0.35;
              }
            }
          } else {
            if (prevState === "chaos") {
              simStateRef.current = "structured";
              for (const p of particlesRef.current) {
                p.sx = p.x;
                p.sy = p.y;
              }
            }
            morphProgRef.current = rawMorph;
          }
        },
      });

      const words = mainHeadingRef.current?.querySelectorAll(".wsa-word");
      if (words) {
        gsap.fromTo(
          words,
          { y: 80, opacity: 0, rotateX: 30 },
          {
            y: 0, opacity: 1, rotateX: 0,
            stagger: 0.1, duration: 0.8, ease: "power4.out",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  const setSlideRef = useCallback((el: HTMLDivElement | null, i: number) => {
    slideRefs.current[i] = el;
  }, []);

  return (
    <div ref={containerRef} className="wsa-container" id="what-sets-apart">
      <div ref={pinnedRef} className="wsa-pinned">
        <div className="wsa-left">
          <h2 className="wsa-main-heading" ref={mainHeadingRef}>
            <span className="wsa-word lime">WHAT</span>{" "}
            <span className="wsa-word">SETS</span>{" "}
            <span className="wsa-word">ME</span>{" "}
            <span className="wsa-word">APART</span>
          </h2>
          <div className="wsa-slides-stack">
            {slides.map((slide, i) => (
              <div
                key={i}
                ref={(el) => setSlideRef(el, i)}
                className={`wsa-slide ${i === activeSlide ? "wsa-slide--active" : ""}`}
              >
                <span className="wsa-slide-label">{slide.label}</span>
                <h3 className="wsa-slide-heading">{slide.heading}</h3>
                <p className="wsa-slide-desc">{slide.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="wsa-right">
          <canvas ref={canvasRef} className="wsa-canvas" />
        </div>
      </div>
    </div>
  );
}
