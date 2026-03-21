"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import FlightTimeline from "../../components/FlightTimeline";
import CtaSection from "../../components/sections/CtaSection";
import { FaMicrophone, FaUsers } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const languages = [
  { name: "中文", level: "母語" },
  { name: "English", level: "C2" },
  { name: "Deutsch", level: "B2" },
];

const skillCategories = [
  {
    title: "程式與 BI",
    tag: "bg-emerald-900/30 text-emerald-300 border-emerald-700/30",
    label: "text-emerald-400",
    skills: ["Python", "SQL", "Tableau", "Power BI", "Metabase", "Google Analytics 4", "CRM"],
  },
  {
    title: "資料科學 / AI",
    tag: "bg-violet-900/30 text-violet-300 border-violet-700/30",
    label: "text-violet-400",
    skills: ["Machine Learning", "Deep Learning", "NLP & LLM", "RAG / LoRA", "Computer Vision"],
  },
  {
    title: "雲端與工程",
    tag: "bg-sky-900/30 text-sky-300 border-sky-700/30",
    label: "text-sky-400",
    skills: ["GCP", "Azure", "BigQuery", "dbt", "LookML", "Docker", "Snowflake", "Databricks", "Airflow"],
  },
  {
    title: "軟實力",
    tag: "bg-amber-900/30 text-amber-300 border-amber-700/30",
    label: "text-amber-400",
    skills: ["Leadership", "Agile / Scrum", "Pre-sales", "Stakeholder Management"],
  },
];

const speeches = [
  { date: "2025/07/20", title: "GenAI and LLM Application", org: "DeepCoding" },
  { date: "2025/05/24", title: "Build Your Own Academic ChatGPT with Streamlit & OpenAI", org: "National Yang Ming University" },
  { date: "2025/05/22", title: "Deep Dive into AI/Data in Data Consultancy", org: "Google GDG @ National Taipei University" },
  { date: "2025/05/20", title: "Foundation of LLM and Gen AI Application", org: "National Chiao Tung University" },
  { date: "2024/12/01", title: "Python Data Analysis for LLM", org: "National Chiao Tung University" },
  { date: "2024/03/15", title: "Data Analysis for Tableau, Python in Various Industries", org: "National Chiao Tung University" },
];

const volunteers = [
  { date: "2025/09/06", title: "PyCon Taiwan 2025", org: "Python Foundation" },
  { date: "2025/05/22", title: "Taiwan Women in Data Science (TWiDS)", org: "Stanford Data Science in Taiwan" },
];

export default function About() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">

      <main className="relative z-10 pb-12">

        {/* ═══ INTRO ═══ */}
        <section className="px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-8 items-start sm:items-center"
            >
              {/* Photo */}
              <motion.div variants={fadeUp} className="shrink-0 mx-auto sm:mx-0">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-2 ring-white/10 shadow-xl shadow-black/60">
                  <Image src="/profile.png" alt="Morris Liu" fill className="object-cover object-top" priority />
                </div>
              </motion.div>

              {/* Text */}
              <div className="text-center sm:text-left space-y-3 flex-1">
                <motion.div variants={fadeUp}>
                  <p className="text-xs uppercase tracking-[0.35em] text-indigo-400/70 font-medium mb-1">個人經歷</p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">Morris Liu</h1>
                  <p className="text-base text-white/40 mt-1">Lead, Business Intelligence @ Lalamove · 香港</p>
                </motion.div>

                <motion.p variants={fadeUp} className="text-sm sm:text-base text-white/50 max-w-xl leading-relaxed">
                  三語（中、英、德）資料與洞察領導者，帶領 8 人 AI & Data 團隊，於台灣、德國、香港三地執行 15+ 分析專案，累計交付 NT$80M 價值。專注銷售預測、BI 儀表板與 LLM 自動化，連結資料策略與可量化業務成果。
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {languages.map((lang) => (
                    <span
                      key={lang.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-medium"
                    >
                      <span className="text-white font-semibold">{lang.name}</span>
                      <span className="text-white/40">{lang.level}</span>
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ 人生航線 ═══ */}
        <FlightTimeline />

        {/* ═══ 技術能力 ═══ */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-white mb-8"
            >
              技術能力
            </motion.h2>
            <div className="space-y-7">
              {skillCategories.map((cat, ci) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ci * 0.07, duration: 0.45 }}
                >
                  <p className={`text-[11px] font-semibold uppercase tracking-widest mb-3 ${cat.label}`}>
                    {cat.title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`px-3 py-1 rounded-full border text-xs font-medium ${cat.tag}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 演講紀錄 ═══ */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.06]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <FaMicrophone className="text-indigo-400 text-xl" />
                演講紀錄
              </h2>

              <div className="divide-y divide-white/[0.06]">
                {speeches.map((s, i) => (
                  <motion.div
                    key={s.date}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className="py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 group rounded-xl px-3 -mx-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-xs font-mono text-white/30 shrink-0 w-24">{s.date}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white/80 group-hover:text-sky-400 transition-colors leading-snug">
                        {s.title}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">{s.org}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Volunteers */}
              <div className="mt-10">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                  <FaUsers className="text-base" />
                  志工參與
                </h3>
                <div className="divide-y divide-white/[0.06]">
                  {volunteers.map((v, i) => (
                    <div
                      key={`vol-${i}`}
                      className="py-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6"
                    >
                      <span className="text-xs font-mono text-white/30 shrink-0 w-24">{v.date}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white/80 leading-snug">{v.title}</p>
                        <p className="text-xs text-white/30 mt-0.5">{v.org}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

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
