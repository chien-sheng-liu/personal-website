"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ParticlesBackground from "@/components/ParticlesBackground";
import { motion } from "framer-motion";
import { FaArrowRight, FaRobot, FaShieldAlt, FaFeather, FaQuoteLeft } from "react-icons/fa";
import { highlights, experiences, education, languages, pageText } from "@/app/yue/about/aboutData";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const heroTags = ["前端工程師", "流程設計師", "AI / Data"];
const heroSignals = [
  { label: "8+", desc: "AI 專案" },
  { label: "120+", desc: "人才 Coaching" },
  { label: "3", desc: "市場經驗" },
];
const pillars = [
  { icon: <FaRobot />, title: "ROI 先行", desc: "所有假設要綁營收或效率" },
  { icon: <FaShieldAlt />, title: "策略即產品", desc: "將 C‑level 決策同 backlog 對齊" },
  { icon: <FaFeather />, title: "教練式合作", desc: "交付同時賦能團隊複製" },
];
const services = {
  primary: {
    title: "AI 產品與數據策略",
    desc: "12 週內走完策略、PoC、治理，令 AI 直接對齊 KPI。",
    tags: ["LLM / RAG", "產品藍圖", "ROI 守門"],
    cta: { label: "啟動藍圖", href: "/yue/service" },
  },
  secondary: [
    {
      title: "商業洞察與決策優化",
      desc: "儀表板 + 實驗解鎖管理層決策。",
      tags: ["KPI 框架", "Insight Ops", "A/B"],
      cta: { label: "規劃洞察", href: "/yue/service" },
    },
    {
      title: "人才賦能與職涯教練",
      desc: "敘事、履歷、面試節奏一次到位。",
      tags: ["1:1 Coaching", "Pitch / CV", "Team"],
      cta: { label: "預約諮詢", href: "/yue/contact" },
    },
  ],
};
const stats = [
  { value: "2x", label: "上市速度" },
  { value: "10+", label: "國際講座" },
  { value: "MSc", label: "DE Intl Mgmt" },
  { value: "92", label: "NPS" },
];

const Pill = ({ children, tone = "default" }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-tight ${
      tone === "primary"
        ? "border-sky-200 bg-sky-50 text-sky-600"
        : "border-slate-200 bg-slate-100 text-slate-600"
    }`}
  >
    {children}
  </span>
);

export default function HomeYue() {
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    fetch('/api/content/projects?locale=yue').then(r=>r.json()).then(d=>setProjects((d.items||[]).slice(0,3))).catch(()=>{});
    fetch('/api/content/articles?locale=yue').then(r=>r.json()).then(d=>setArticles((d.items||[]).slice(0,3))).catch(()=>{});
  }, []);
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-800">
      <ParticlesBackground />

      <main className="relative z-10 space-y-16 pb-16">
        {/* HERO */}
        <section className="px-4 sm:px-6 lg:px-8 pt-16">
          <div className="mx-auto max-w-6xl">
            {/* Left: Textual hero */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="rounded-[40px] border border-slate-200 bg-white p-9 shadow-xl">
              <div className="grid gap-8 lg:grid-cols-2 items-center">
                <div className="space-y-5">
                <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-[0.4em] text-slate-600">Hello，我係 Morris</motion.p>
                <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-semibold leading-tight text-slate-900">將 AI 變成作品同故事</motion.h1>
                <motion.p variants={fadeUp} className="text-sm md:text-base text-slate-600 max-w-xl">{pageText?.subtitle}</motion.p>
                <motion.div variants={fadeUp} className="flex flex-wrap gap-2">{heroTags.map((t) => (<Pill key={t}>{t}</Pill>))}</motion.div>
                <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-1">
                  <Link href="/yue/contact" className="group inline-flex items-center rounded-full border border-sky-300 bg-sky-500 px-6 py-3 text-sm font-semibold text-white">打個招呼<FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" /></Link>
                </motion.div>
                <motion.p variants={fadeUp} className="mt-6 text-sm md:text-base text-slate-600 max-w-2xl border-t border-slate-200 pt-6">{pageText?.subtitle}</motion.p>
              </div>
              <motion.div variants={fadeUp} className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64">
                <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-slate-200 shadow-xl">
                  <Image src="/profile.png" alt="Morris portrait" fill sizes="256px" className="object-cover" />
                </div>
              </motion.div>
              </div>
            </motion.div>


          </div>
        </section>

        {/* 重點 */}
        <section id="about" className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4"><h2 className="text-sm uppercase tracking-[0.35em] text-slate-500">重點</h2></div>
            <div className="grid gap-5 md:grid-cols-3">
              {highlights.slice(0,3).map((h, idx) => (
                <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-500">{h.icon}</div>
                    <h3 className="text-base font-semibold text-slate-900">{h.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{h.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 經歷 */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4"><h2 className="text-sm uppercase tracking-[0.35em] text-slate-500">經歷</h2></div>
            <div className="space-y-4">
              {experiences.slice(0,5).map((exp, idx) => (
                <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{exp.title}</h3>
                    <span className="text-xs text-slate-400">{exp.date}</span>
                  </div>
                  <div className="text-sm text-slate-600">{exp.company}</div>
                  <ul className="mt-2 space-y-1">
                    {(exp.bullets||[]).slice(0,3).map((b,i)=>(<li key={i} className="text-sm text-slate-600">• {b}</li>))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 教育 / 語言 */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4"><h2 className="text-sm uppercase tracking-[0.35em] text-slate-500">教育 / 語言</h2></div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {education.slice(0,3).map((ed, idx)=>(
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold text-slate-900">{ed.title}</h3>
                      <span className="text-xs text-slate-400">{ed.date}</span>
                    </div>
                    <p className="text-sm text-slate-600">{ed.company}</p>
                    {ed.description && <p className="text-xs text-slate-400 mt-1">{ed.description}</p>}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {languages.map((l,idx)=>(
                  <div key={idx} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <span className="text-sm text-slate-900">{l.title}</span>
                    <span className="text-xs text-sky-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-[20px] border border-slate-200 bg-slate-50 px-6 py-8 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45 }}>
              <h3 className="text-2xl font-semibold text-slate-900">想一齊打造更好嘅作品？</h3>
              <p className="mt-2 text-sm text-slate-500">畀我個訊息，或者直接約時間傾吓。</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link href="/yue/contact" className="group inline-flex items-center rounded-full border border-sky-300 bg-sky-500 px-6 py-3 text-sm font-semibold text-white">打個招呼<FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" /></Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
