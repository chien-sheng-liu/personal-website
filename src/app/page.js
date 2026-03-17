"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ParticlesBackground from "../components/ParticlesBackground";
import FlightTimeline from "../components/FlightTimeline";
import { FaArrowRight, FaChevronDown } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const heroStats = [
  { value: "8+", label: "年數據與 AI 經驗", icon: "📊" },
  { value: "3", label: "國跨市場經歷", icon: "🌏" },
  { value: "NT$8,000萬", label: "AI 驅動營收", icon: "💰" },
  { value: "15+", label: "端到端專案交付", icon: "🚀" },
];

const skillTags = [
  { name: "Python", color: "border-sky-200 text-sky-600 bg-sky-50" },
  { name: "Machine Learning", color: "border-indigo-200 text-indigo-600 bg-indigo-50" },
  { name: "NLP & LLM", color: "border-indigo-200 text-indigo-600 bg-indigo-50" },
  { name: "SQL", color: "border-sky-200 text-sky-600 bg-sky-50" },
  { name: "GCP", color: "border-blue-200 text-blue-600 bg-blue-50" },
  { name: "BigQuery", color: "border-blue-200 text-blue-600 bg-blue-50" },
  { name: "RAG / LoRA", color: "border-indigo-200 text-indigo-600 bg-indigo-50" },
  { name: "Tableau", color: "border-orange-200 text-orange-600 bg-orange-50" },
  { name: "Deep Learning", color: "border-indigo-200 text-indigo-600 bg-indigo-50" },
  { name: "Docker", color: "border-sky-200 text-sky-600 bg-sky-50" },
  { name: "dbt / LookML", color: "border-emerald-200 text-emerald-600 bg-emerald-50" },
  { name: "Pandas", color: "border-sky-200 text-sky-600 bg-sky-50" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-slate-800">
      <ParticlesBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.06),transparent_55%),radial-gradient(circle_at_70%_25%,rgba(99,102,241,0.05),transparent_50%)]" />

      <main className="relative z-10 pb-12">

        {/* ═══ HERO — Side-by-side layout ═══ */}
        <section className="min-h-[calc(100vh-5rem)] flex items-center px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="mx-auto max-w-6xl w-full">
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <div className="grid gap-10 lg:gap-16 lg:grid-cols-[auto_1fr] items-center">

                {/* Left — Profile photo */}
                <motion.div variants={fadeUp} className="relative mx-auto lg:mx-0">
                  {/* Photo */}
                  <div
                    className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72"
                    style={{ animation: "hero-float 6s ease-in-out infinite" }}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-slate-200 shadow-xl">
                      <Image src="/profile.png" alt="Morris Liu" fill sizes="288px" className="object-cover" priority />
                    </div>
                  </div>
                </motion.div>

                {/* Right — Text content */}
                <div className="text-center lg:text-left space-y-6">
                  <motion.div variants={fadeUp}>
                    <p className="text-[11px] uppercase tracking-[0.4em] text-slate-500 mb-3">
                      Morris Liu / AI + Strategy
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold leading-[0.95] text-slate-900 mb-4">
                      我把 AI 作品
                      <br />
                      <span
                        className="bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500 bg-clip-text text-transparent bg-[length:200%_auto]"
                        style={{ animation: "text-shimmer 8s linear infinite" }}
                      >
                        變成清楚的敘事
                      </span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600">
                      策略、資料與產品節奏放進一條故事線
                    </p>
                  </motion.div>

                  {/* KPI Stats — 2x2 grid */}
                  <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mx-auto lg:mx-0">
                    {heroStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-slate-200 bg-white shadow-sm px-4 py-3"
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs">{stat.icon}</span>
                          <span className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </motion.div>

                  {/* Skill tags */}
                  <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mx-auto lg:mx-0">
                    {skillTags.map((tag, i) => (
                      <motion.span
                        key={tag.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
                        className={`rounded-full border px-3 py-1 text-[11px] font-medium ${tag.color}`}
                      >
                        {tag.name}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>

              </div>
            </motion.div>
          </div>

          {/* Scroll indicator — pinned to bottom with enough spacing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400"
            style={{ animation: "scroll-bounce 2s ease-in-out infinite" }}
          >
            <FaChevronDown className="text-[10px]" />
          </motion.div>
        </section>

        {/* ═══ Flight Timeline ═══ */}
        <FlightTimeline />

        {/* ═══ CTA — frosted glass ═══ */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-slate-200 bg-white shadow-md px-8 py-10 text-center"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
                想讓 AI 作品說得更好？
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                30 分鐘對談，把目標轉成敘事
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center rounded-full border border-sky-300 bg-sky-500 px-7 py-3 text-base font-semibold text-white hover:bg-sky-600 transition-all duration-300"
              >
                安排對談
                <FaArrowRight className="ml-2 text-sm transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
