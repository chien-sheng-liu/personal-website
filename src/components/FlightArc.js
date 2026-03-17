"use client";
import { useEffect, useRef } from "react";

/*
  Animated flight arcs with traveling light dots.
  Renders SVG arcs between node positions with a cyan→purple gradient
  and small glowing dots that travel along each arc.
*/
export default function FlightArc({ nodes, vbW, vbH }) {
  const dotsRef = useRef([]);

  /* Build smooth quadratic arcs between consecutive nodes */
  const arcs = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    /* Control point: midpoint offset upward for arc effect */
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2 - 40;
    arcs.push({
      id: i,
      d: `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`,
    });
  }

  /* Animate dots along paths */
  useEffect(() => {
    let rafId;
    const speed = 0.0004; // controls dot travel speed

    const animate = (time) => {
      dotsRef.current.forEach((dot, i) => {
        if (!dot?.path) return;
        const len = dot.path.getTotalLength();
        const t = ((time * speed + i * 0.12) % 1);
        const pt = dot.path.getPointAtLength(t * len);
        if (dot.el) {
          dot.el.setAttribute("cx", pt.x);
          dot.el.setAttribute("cy", pt.y);
        }
        if (dot.glowEl) {
          dot.glowEl.setAttribute("cx", pt.x);
          dot.glowEl.setAttribute("cy", pt.y);
        }
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <svg
      className="absolute inset-0 w-full h-full z-[5]"
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="arcGradGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
        </linearGradient>
        <filter id="dotGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
      </defs>

      {/* Arc paths */}
      {arcs.map((arc) => (
        <g key={arc.id}>
          {/* Glow layer */}
          <path
            d={arc.d}
            stroke="url(#arcGradGlow)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Main arc */}
          <path
            d={arc.d}
            stroke="url(#arcGrad)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="6 8"
          />
        </g>
      ))}

      {/* Traveling light dots */}
      {arcs.map((arc) => (
        <g key={`dot-${arc.id}`}>
          {/* Hidden path for getPointAtLength */}
          <path
            d={arc.d}
            fill="none"
            stroke="none"
            ref={(el) => {
              if (!dotsRef.current[arc.id]) dotsRef.current[arc.id] = {};
              dotsRef.current[arc.id].path = el;
            }}
          />
          {/* Glow circle */}
          <circle
            r="8"
            fill="#0ea5e9"
            opacity="0.25"
            filter="url(#dotGlow)"
            ref={(el) => {
              if (!dotsRef.current[arc.id]) dotsRef.current[arc.id] = {};
              dotsRef.current[arc.id].glowEl = el;
            }}
          />
          {/* Bright dot */}
          <circle
            r="2.5"
            fill="#0ea5e9"
            opacity="0.9"
            ref={(el) => {
              if (!dotsRef.current[arc.id]) dotsRef.current[arc.id] = {};
              dotsRef.current[arc.id].el = el;
            }}
          />
        </g>
      ))}
    </svg>
  );
}
