"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import TypewriterText from "../components/TypewriterText";
import { FaChevronDown, FaArrowRight } from "react-icons/fa";

/* ─── Grain SVG data URL ─── */
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E";

/* ─── Stats data ─── */
const stats = [
  { to: 5,   prefix: "",  suffix: "+", label: "年數據與 AI 經驗" },
  { to: 4,   prefix: "",  suffix: "",  label: "個國家與地區跨市場" },
  { to: 300, prefix: "$", suffix: "M", label: "USD AI 驅動營收" },
  { to: 25,  prefix: "",  suffix: "",  label: "端到端專案交付" },
];

const roles = [
  "AI Strategy", "Data Science", "NLP & LLM", "Product Thinking",
  "Business Intelligence", "ML Engineering", "RAG / LoRA", "Cloud & BigQuery",
];

const typewriterTexts = ["變成清楚的敘事", "落地為商業價值", "串聯成完整故事"];

/* ─── Animated counter ─── */
function Counter({ to, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1600;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(to * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView, to]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ─── Text mask reveal line ─── */
function MaskLine({ children, delay = 0, className = "" }) {
  return (
    <div className={`overflow-hidden leading-[1.0] pb-3 ${className}`}>
      <motion.div
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [mouse, setMouse] = useState({ x: -999, y: -999 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">

      {/* ── Grain texture overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed select-none z-[200]"
        style={{
          inset: "-150%",
          width: "400%",
          height: "400%",
          backgroundImage: `url("${GRAIN}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "260px 260px",
          opacity: 0.042,
          animation: "grain 0.7s steps(1) infinite",
        }}
      />

      {/* ── Cursor spotlight ── */}
      {mounted && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30"
          style={{
            background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(99,102,241,0.07), transparent 50%)`,
            transition: "background 0.1s",
          }}
        />
      )}

      {/* ══════════════════════════════════ HERO ══════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Profile photo — right half, desktop */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-[48%] hidden lg:block pointer-events-none select-none"
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src="/profile.png" alt="Morris Liu" fill className="object-cover object-top" priority />
          {/* Left fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          {/* Top + bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/25" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 pt-28 pb-20">

          {/* Mobile: circular photo */}
          <motion.div
            className="lg:hidden relative w-32 h-32 mx-auto mb-10 rounded-full overflow-hidden ring-1 ring-white/10 shadow-2xl"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src="/profile.png" alt="Morris Liu" fill className="object-cover object-top" priority />
          </motion.div>

          {/* Eyebrow */}
          <div className="overflow-hidden mb-9">
            <motion.p
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.65 }}
              className="text-[11px] tracking-[0.45em] uppercase text-white/30 font-medium"
            >
              Morris Liu · AI + Strategy
            </motion.p>
          </div>

          {/* Headline — mask reveal */}
          <div className="mb-8">
            <MaskLine
              delay={0.22}
              className="text-[clamp(3rem,9.5vw,8.5rem)] font-bold tracking-tight text-white"
            >
              我把 AI 作品
            </MaskLine>
            <MaskLine
              delay={0.40}
              className="text-[clamp(3rem,9.5vw,8.5rem)] font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                <TypewriterText texts={typewriterTexts} speed={80} pause={2500} />
              </span>
            </MaskLine>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.6 }}
            className="text-base sm:text-lg text-white/38 max-w-[22rem] mb-10"
          >
            策略、資料與產品節奏放進一條故事線
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.82, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/about"
              className="group flex items-center gap-2 px-6 py-3 bg-white text-[#0a0a0a] text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              個人經歷
              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/contact" className="text-sm text-white/38 hover:text-white/75 transition-colors">
              聯絡我 →
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20"
          style={{ animation: "scroll-bounce 2s ease-in-out infinite" }}
        >
          <FaChevronDown className="text-xs" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════ STATS ══════════════════════════════════ */}
      <section className="border-t border-white/[0.07] py-20 px-6 sm:px-8 lg:px-16 xl:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.65, ease: "easeOut" }}
            >
              <div className="text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-none tracking-tight mb-2">
                <Counter to={stat.to} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-white/28 leading-snug">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════ MARQUEE ══════════════════════════════════ */}
      <section className="border-y border-white/[0.07] py-5 overflow-hidden">
        <div
          className="flex gap-10 whitespace-nowrap w-max"
          style={{ animation: "marquee 28s linear infinite" }}
        >
          {[...roles, ...roles].map((role, i) => (
            <span key={`${role}-${i}`} className="text-xl font-semibold text-white/[0.12] shrink-0">
              {role} <span className="text-white/[0.07] mx-2">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════ CTA ══════════════════════════════════ */}
      <section className="py-32 px-6 sm:px-8 lg:px-16 xl:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-white leading-[0.92] tracking-tight mb-6">
              想讓 AI 作品<br />說得更好？
            </h2>
            <p className="text-white/32 text-lg mb-10">30 分鐘對談，把目標轉成敘事</p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a0a0a] font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
            >
              安排對談
              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
