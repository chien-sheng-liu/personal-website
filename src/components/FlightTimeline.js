"use client";
import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlane, FaTimes } from "react-icons/fa";
import dynamic from "next/dynamic";
import FlightArc from "./FlightArc";

/* ── Lazy-load Globe (no SSR — Three.js needs browser) ── */
const GlobeBackground = dynamic(() => import("./GlobeBackground"), {
  ssr: false,
  loading: () => null,
});

/* ── DATA ── */
const events = [
  {
    year: "2026", title: "Lead, BI", org: "Lalamove", flag: "🇭🇰", type: "work",
    detail: [
      "帶領 BI 團隊，建立數據驅動決策文化",
      "設計與落地核心營運儀表板",
      "推動 AI 自動化分析流程",
    ],
  },
  {
    year: "2024", title: "Manager · Data & AI", org: "Datarget 創代科技", flag: "🇹🇼", type: "work",
    detail: [
      "管理數據與 AI 產品團隊",
      "主導客戶 AI 解決方案的規劃與交付",
      "建立 MLOps 標準化流程",
    ],
  },
  {
    year: "2023", title: "ML Engineer", org: "OneAD AdTech", flag: "🇹🇼", type: "work",
    detail: [
      "開發廣告推薦模型，提升 CTR",
      "建置即時特徵工程 pipeline",
      "A/B 測試框架設計與分析",
    ],
  },
  {
    year: "2023", title: "資料科學講師", org: "DeepCoding", flag: "🇹🇼", type: "work",
    detail: [
      "設計並教授資料科學課程",
      "涵蓋 Python、機器學習、資料視覺化",
      "指導學員完成實戰專案",
    ],
  },
  {
    year: "2022", title: "Marketing DA", org: "HelloFresh SE", flag: "🇩🇪", type: "work",
    detail: [
      "負責行銷數據分析與歸因模型",
      "建立自動化報表系統",
      "跨部門數據需求溝通與交付",
    ],
  },
  {
    year: "2021", title: "Research Assistant", org: "ZEW 經濟研究中心", flag: "🇩🇪", type: "work",
    detail: [
      "協助經濟學研究的資料蒐集與分析",
      "使用計量經濟學方法進行實證研究",
      "撰寫研究報告與文獻回顧",
    ],
  },
  {
    year: "2020", title: "MSc 經濟資訊學", org: "曼海姆大學", flag: "🇩🇪", type: "education",
    detail: [
      "主修經濟資訊學（Wirtschaftsinformatik）",
      "研究方向：機器學習應用於經濟預測",
      "碩士論文：深度學習在金融時序資料的應用",
    ],
  },
  {
    year: "2019", title: "交換生", org: "拜羅伊特大學", flag: "🇩🇪", type: "education",
    detail: [
      "赴德國拜羅伊特大學交換一學期",
      "修習資訊管理與商業分析課程",
      "跨文化學習與語言能力提升",
    ],
  },
  {
    year: "2017", title: "Software Eng. Intern", org: "Getec · Mitac", flag: "🇨🇳", type: "work",
    detail: [
      "參與企業軟體開發專案",
      "負責後端 API 開發與測試",
      "學習敏捷開發流程與團隊協作",
    ],
  },
  {
    year: "2015", title: "學士 · 資訊管理", org: "中原大學", flag: "🇹🇼", type: "education",
    detail: [
      "主修資訊管理學系",
      "學習程式設計、資料庫、系統分析",
      "參與多項實務專題與競賽",
    ],
  },
];

/* ── Type-based styling ── */
const typeStyle = {
  work: {
    border: "border-sky-200",
    text: "text-sky-600",
    glow: "shadow-sm",
    badge: "bg-sky-50 text-sky-600",
    dot: "bg-sky-500",
    hex: "#0ea5e9",
  },
  education: {
    border: "border-indigo-200",
    text: "text-indigo-600",
    glow: "shadow-sm",
    badge: "bg-indigo-50 text-indigo-600",
    dot: "bg-indigo-500",
    hex: "#6366f1",
  },
};

/* ── SVG GEOMETRY — wide spread, compact height ── */
const VB_W = 1100;
const VB_H = 680;

const nodes = [
  { x: 960,  y: 20  },
  { x: 140,  y: 93  },
  { x: 930,  y: 166 },
  { x: 170,  y: 239 },
  { x: 960,  y: 312 },
  { x: 140,  y: 385 },
  { x: 930,  y: 458 },
  { x: 170,  y: 531 },
  { x: 960,  y: 604 },
  { x: 140,  y: 665 },
];

/* ── COMPONENT ── */
export default function FlightTimeline() {
  const sectionRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const openModal = useCallback((ev) => setSelected(ev), []);
  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 py-10 overflow-hidden">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-10">
          <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[10px] uppercase tracking-[0.5em] text-slate-400 mb-3">
            Flight Log
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-2">
            人生航線
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="text-xs text-slate-500">
            台灣 → 中國 → 德國 → 香港
          </motion.p>
        </div>

        {/* ═══ DESKTOP ═══ */}
        <div className="hidden md:block relative" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>

          {/* 3D Globe background */}
          <GlobeBackground />

          {/* Flight arcs with animated dots */}
          <FlightArc nodes={nodes} vbW={VB_W} vbH={VB_H} />

          {/* Node dots on SVG layer */}
          <svg className="absolute inset-0 w-full h-full z-[8]" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {nodes.map((n, i) => {
              const s = typeStyle[events[i].type];
              return (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r="14" fill={s.hex} opacity="0.08" />
                  <circle cx={n.x} cy={n.y} r="5"  fill={s.hex} opacity="0.9" />
                  <circle cx={n.x} cy={n.y} r="5"  fill={s.hex} opacity="0.3">
                    <animate attributeName="r" values="5;14;5" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Cards — wrapper div handles positioning, motion.div handles animation */}
          {events.map((ev, idx) => {
            const n = nodes[idx];
            const toRight = n.x < VB_W / 2;
            const s = typeStyle[ev.type];
            return (
              <div
                key={idx}
                className="absolute z-[15]"
                style={{
                  left: `${(n.x / VB_W) * 100}%`,
                  top: `${(n.y / VB_H) * 100}%`,
                  transform: `translate(${toRight ? "20px" : "calc(-100% - 20px)"}, -50%)`,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <FlightCard ev={ev} s={s} align={toRight ? "left" : "right"} onClick={() => openModal(ev)} />
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ═══ MOBILE ═══ */}
        <div className="md:hidden relative">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <GlobeBackground />
          </div>

          <div className="space-y-3 relative z-10">
            {events.map((ev, idx) => {
              const s = typeStyle[ev.type];
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: isEven ? -16 : 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4 }}
                  className={`flex ${isEven ? "justify-start" : "justify-end"}`}
                >
                  <MobileFlightCard ev={ev} s={s} isEven={isEven} onClick={() => openModal(ev)} />
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ═══ MODAL ═══ */}
      <AnimatePresence>
        {selected && <DetailModal ev={selected} s={typeStyle[selected.type]} onClose={closeModal} />}
      </AnimatePresence>
    </section>
  );
}

/* ── Desktop card: fixed height, clickable ── */
function FlightCard({ ev, s, align, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-[280px] h-[80px] rounded-xl border ${s.border} bg-white px-4 py-2.5 ${s.glow} transition-all duration-200 hover:bg-slate-50 hover:shadow-md cursor-pointer text-left`}
    >
      <div className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider mb-1 ${s.badge}`}>
        {ev.type === "work" ? "Work" : "Education"}
      </div>

      <div className={`flex items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
        <span className="text-sm leading-none shrink-0">{ev.flag}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-800 leading-tight truncate">{ev.title}</h3>
          <p className={`text-[11px] ${s.text} opacity-80 leading-tight truncate`}>{ev.org}</p>
        </div>
        <span className="text-[10px] text-slate-400 font-mono shrink-0">{ev.year}</span>
      </div>
    </button>
  );
}

/* ── Mobile card: clickable ── */
function MobileFlightCard({ ev, s, isEven, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-[85%] h-[72px] rounded-xl border ${s.border} bg-white px-4 py-2 ${s.glow} relative text-left cursor-pointer`}
    >
      <div className={`absolute top-4 ${isEven ? "-right-2" : "-left-2"} w-3.5 h-3.5 rounded-full ${s.dot} ring-2 ring-white`} />

      <div className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider mb-1 ${s.badge}`}>
        {ev.type === "work" ? "Work" : "Education"}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-base leading-none shrink-0">{ev.flag}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-800 leading-tight truncate">{ev.title}</h3>
          <p className={`text-sm ${s.text} opacity-80 leading-tight truncate`}>{ev.org}</p>
        </div>
        <span className="text-[11px] text-slate-400 font-mono shrink-0">{ev.year}</span>
      </div>
    </button>
  );
}

/* ── Detail Modal (popup overlay) ── */
function DetailModal({ ev, s, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full max-w-md rounded-2xl border ${s.border} bg-white shadow-2xl p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <FaTimes className="text-sm" />
        </button>

        {/* Type badge */}
        <div className={`inline-block rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider mb-4 ${s.badge}`}>
          {ev.type === "work" ? "Work" : "Education"}
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <span className="text-2xl leading-none shrink-0 mt-0.5">{ev.flag}</span>
          <div>
            <h3 className="text-xl font-bold text-slate-800 leading-snug">{ev.title}</h3>
            <p className={`text-sm ${s.text} opacity-90`}>{ev.org}</p>
            <p className="text-xs text-slate-400 font-mono mt-1">{ev.year}</p>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-px mb-4 ${ev.type === "work" ? "bg-sky-200" : "bg-indigo-200"}`} />

        {/* Detail list */}
        <ul className="space-y-2.5">
          {ev.detail.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${ev.type === "work" ? "bg-sky-400" : "bg-indigo-400"}`} />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
