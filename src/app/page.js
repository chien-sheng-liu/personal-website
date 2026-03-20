"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import FlightTimeline from "../components/FlightTimeline";
import AnimatedGradientBg from "../components/AnimatedGradientBg";
import TypewriterText from "../components/TypewriterText";
import Card3D from "../components/Card3D";
import CtaSection from "../components/sections/CtaSection";
import { FaChevronDown } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const heroStats = [
  { value: "5+ 年", label: "數據與 AI 經驗", icon: "📊" },
  { value: "3 國", label: "跨市場經歷", icon: "🌏" },
  { value: "NT$8,000 萬", label: "AI 驅動營收", icon: "💰" },
  { value: "25+ 專案", label: "端到端客製戶交付", icon: "🚀" },
];

const skillTags = [
  { name: "Python", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { name: "Machine Learning", color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  { name: "NLP & LLM", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
  { name: "SQL", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { name: "GCP", color: "bg-sky-50 text-sky-600 border-sky-200" },
  { name: "BigQuery", color: "bg-sky-50 text-sky-600 border-sky-200" },
  { name: "RAG / LoRA", color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200" },
  { name: "Tableau", color: "bg-amber-50 text-amber-600 border-amber-200" },
  { name: "Deep Learning", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
  { name: "Docker", color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  { name: "dbt / LookML", color: "bg-lime-50 text-lime-600 border-lime-200" },
  { name: "Pandas", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
];

const typewriterTexts = ["變成清楚的敘事", "落地為商業價值", "串聯成完整故事"];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-[#1d1d1f]">
      {/* Single unified background for the entire page */}
      <AnimatedGradientBg variant="hero" />

      <main className="relative z-10 pb-12">

        {/* ═══ HERO ═══ */}
        <section className="relative min-h-[calc(100vh-5rem)] flex items-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative z-10 mx-auto max-w-7xl w-full">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <div className="grid gap-10 lg:gap-16 lg:grid-cols-[auto_1fr] items-center">
                <motion.div variants={fadeUp} className="relative mx-auto lg:mx-0">
                  <Card3D intensity={6}>
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72" style={{ animation: "hero-float 6s ease-in-out infinite" }}>
                      <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-white/60 shadow-2xl shadow-indigo-200/40">
                        <Image src="/profile.png" alt="Morris Liu" fill sizes="288px" className="object-cover" priority />
                      </div>
                    </div>
                  </Card3D>
                </motion.div>

                <div className="text-center lg:text-left space-y-6">
                  <motion.div variants={fadeUp}>
                    <p className="text-xs uppercase tracking-[0.35em] text-indigo-500/70 font-medium mb-3">Morris Liu / AI + Strategy</p>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.92] tracking-tight text-[#1d1d1f] mb-5">
                      我把 AI 作品
                      <br />
                      <span className="bg-gradient-to-r from-violet-500 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                        <TypewriterText texts={typewriterTexts} speed={80} pause={2500} />
                      </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-500 max-w-lg">策略、資料與產品節奏放進一條故事線</p>
                  </motion.div>

                  <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mx-auto lg:mx-0">
                    {heroStats.map((stat) => (
                      <Card3D key={stat.label} intensity={6}>
                        <div className="rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm shadow-sm px-4 py-4 hover:shadow-md hover:border-indigo-200/60 transition-all duration-300 text-center lg:text-left">
                          <span className="text-base mb-1 block">{stat.icon}</span>
                          <span className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] block">{stat.value}</span>
                          <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                        </div>
                      </Card3D>
                    ))}
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mx-auto lg:mx-0">
                    {skillTags.map((tag, i) => (
                      <motion.span key={tag.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }} className={`rounded-full border px-3 py-1 text-[11px] font-medium ${tag.color} hover:shadow-sm transition-all duration-200`}>
                        {tag.name}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-400" style={{ animation: "scroll-bounce 2s ease-in-out infinite" }}>
            <FaChevronDown className="text-xs" />
          </motion.div>
        </section>

        {/* ═══ Flight Timeline ═══ */}
        <FlightTimeline />

        {/* ═══ CTA ═══ */}
        <CtaSection
          title="想讓 AI 作品說得更好？"
          description="30 分鐘對談，把目標轉成敘事"
          buttonLabel="安排對談"
          buttonHref="/contact"
        />
      </main>
    </div>
  );
}
