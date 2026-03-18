"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { FaPlane, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import WorldMapBackground from "./WorldMapBackground";

/* ── DATA (newest → oldest, 倒敘) ── */
const events = [
  {
    year: "2026", title: "Lead - Business Intelligence", org: "Lalamove", flag: "🇭🇰", type: "work",
    loc: "九龍塘", locFull: "香港", duration: "2025.12 – Present",
    detail: [
      "跨市場建置 KPI、供需監控與漏斗儀表板，讓決策即時化",
      "與 DE/DA 共建 dbt・LookML 治理與資料規格，加速交付",
      "規劃數據產品 Roadmap，導入自助分析與 AI 自動化",
      "連結營運/商務與資料團隊，確保儀表板貢獻可量化",
    ],
  },
  {
    year: "2024", title: "Deputy Manager - Data & AI", org: "Datarget 創代科技", flag: "🇹🇼", type: "work",
    loc: "台北", locFull: "台灣", duration: "2024.01 – 2025.11",
    detail: [
      "Built & led 8 人 AI/Data 團隊，包辦需求、KPI 設計到上線",
      "交付 15+ analytics/AI 專案，為各產業創造 NT$8,000 萬",
      "以 Python/SQL 打造 forecasting、segmentation、Text-to-SQL LLM",
      "建 Tableau/Power BI/Metabase funnel dashboard 與 SQL・dbt 管線",
      "自動化 CRM 數據與報表，提升資料準確度與交付效率",
    ],
  },
  {
    year: "2023", title: "Machine Learning Engineer", org: "OneAD", flag: "🇹🇼", type: "work",
    loc: "台北", locFull: "台灣", duration: "2023.02 – 2023.12",
    detail: [
      "設計/部署多格式 ML・DL targeting 模型，CTR +20%、停留 +30%",
      "重構 cross-device 系統，推論 +40%、GCP 成本 -30%",
      "打造 LLM+RAG 受眾平台並整合 Meta/Google Ads API",
      "營運 1 億+ 日誌資料處理鏈，導入 Spark/Hadoop/Airflow/MLflow",
    ],
  },
  {
    year: "2023", title: "資料科學講師", org: "DeepCoding", flag: "🇹🇼", type: "work",
    loc: "台北", locFull: "台灣", duration: "2022.06 – 2023.12",
    detail: [
      "Delivered custom data/AI workshops，累積 100+ 學員",
      "與大學/企業合辦 LLM、資料分析課程，聚焦實作",
      "提供 1 對 1 coaching，協助學員轉職或升遷",
      "維持教材更新，涵蓋 Python、視覺化與商業案例",
    ],
  },
  {
    year: "2022", title: "Marketing Analyst", org: "HelloFresh SE", flag: "🇩🇪", type: "work",
    loc: "柏林", locFull: "德國", duration: "2021.10 – 2022.10",
    detail: [
      "為 18 市場部署 conversion/CTR/Revenue 預測，準確度約 85%",
      "打造 CTR/CVR funnel 與 penetration dashboard 支援行銷決策",
      "自動化 ETL 匯入 BigQuery 與 CRM，優化高流量 log 處理",
      "整合 Google/Meta/DV360/YouTube 多渠道資料並執行 A/B 測試",
    ],
  },
  {
    year: "2021", title: "Research Assistant", org: "ZEW 經濟研究中心", flag: "🇩🇪", type: "work",
    loc: "Mannheim", locFull: "德國", duration: "2020.10 – 2021.09",
    detail: [
      "建立 OCR + text-mining pipeline 處理中文社會信用資料",
      "設計自動化爬蟲，日更經濟/財政/政策資訊",
      "清理並結構化資料，提供研究模型即時引用",
    ],
  },
  {
    year: "2020", title: "Master - Business Informatics", org: "Universität Mannheim", flag: "🇩🇪", type: "education",
    loc: "Mannheim", locFull: "德國", duration: "2019.09 – 2022.03",
    detail: [
      "Business Informatics (Data Science Track) 連結資訊與商業",
      "Thesis：Handling Covid-disrupted forecasting in MarTech",
      "研究：以 AI/NN 解決 Newsvendor 需求預測",
      "養成跨國協作、研究與資料驅動解題能力",
    ],
  },
  {
    year: "2019", title: "交換生", org: "Universität Bayreuth", flag: "🇩🇪", type: "education",
    loc: "Bayreuth", locFull: "德國", duration: "2018.10 – 2019.07",
    detail: [
      "Business Engineering 交換，修習供應鏈/製造/管理課程",
      "以英文與德文完成專題與簡報，提升溝通力",
      "拓展跨文化合作與歐洲產業視野",
    ],
  },
  {
    year: "2017", title: "Software Engineer Intern", org: "Mitac", flag: "🇨🇳", type: "work",
    loc: "昆山", locFull: "China", duration: "2017.07 – 2017.09",
    detail: [
      "開發 C#/.NET 後端並整合 WeChat API 的會議安排系統",
      "設計 workflow 讓差旅報銷效率提升 25%",
      "訪談 10+ 使用者，將需求轉成系統設計/測試",
    ],
  },
  {
    year: "2015", title: "Bachelor - 資訊管理", org: "中原大學", flag: "🇹🇼", type: "education",
    loc: "桃園", locFull: "台灣", duration: "2015.09 – 2019.06",
    detail: [
      "資管主修、企管輔系，奠定資訊 × 管理基礎",
      "系學會會長，策畫跨院活動與專案",
      "2019 Taiwan InnoService、資管競賽獲獎並取得交換資格",
    ],
  },
];

/* ── Styling per type ── */
const typeStyle = {
  work: {
    accent: "from-sky-400 to-cyan-500",
    accentText: "text-sky-600",
    accentBg: "bg-sky-500",
    cardBg: "bg-white/85",
    glow: "hover:shadow-xl hover:shadow-sky-200/30 hover:-translate-y-1",
    badge: "bg-sky-100 text-sky-600",
    dot: "bg-sky-400",
    strip: "from-sky-400 to-cyan-500",
    hex: "#0ea5e9",
  },
  education: {
    accent: "from-amber-400 to-orange-500",
    accentText: "text-amber-600",
    accentBg: "bg-amber-500",
    cardBg: "bg-white/85",
    glow: "hover:shadow-xl hover:shadow-amber-200/30 hover:-translate-y-1",
    badge: "bg-amber-100 text-amber-600",
    dot: "bg-amber-400",
    strip: "from-amber-400 to-orange-500",
    hex: "#f59e0b",
  },
};

const AUTO_SCROLL_SPEED = 60;
const CARD_W = 520;
const CARD_H = 220;
const GAP = 40;
const PAD = 48;

/* ── Fake barcode bars (deterministic) ── */
function BarcodeSVG({ width = 100, height = 20 }) {
  const bars = [];
  let x = 0;
  const seed = [2,1,3,1,2,1,1,3,2,1,1,2,3,1,2,1,3,1,1,2,1,3,2,1,1,3,1,2,1,1,2,3,1,2,1,3,1,1,2,1];
  for (let i = 0; i < seed.length && x < width; i++) {
    const w = seed[i];
    if (i % 2 === 0) bars.push(<rect key={i} x={x} y={0} width={w} height={height} fill="currentColor" />);
    x += w + 1;
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="text-slate-300" aria-hidden="true">
      {bars}
    </svg>
  );
}

/* ── COMPONENT ── */
export default function FlightTimeline() {
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const dragX = useMotionValue(0);
  const [dragConstraint, setDragConstraint] = useState(0);
  const isDragging = useRef(false);
  const isHovering = useRef(false);

  const openModal = useCallback((ev) => setSelected(ev), []);
  const closeModal = useCallback(() => setSelected(null), []);

  /* Scroll by one card */
  const scrollBy = useCallback((dir) => {
    const step = CARD_W + GAP;
    const current = dragX.get();
    const target = Math.round(current / step) * step + dir * step;
    const clamped = Math.max(dragConstraint, Math.min(0, target));
    animate(dragX, clamped, { type: "spring", stiffness: 300, damping: 30 });
  }, [dragX, dragConstraint]);

  useEffect(() => {
    function calc() {
      if (!containerRef.current || !innerRef.current) return;
      const containerW = containerRef.current.offsetWidth;
      const innerW = innerRef.current.scrollWidth;
      setDragConstraint(Math.min(0, -(innerW - containerW)));
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    if (dragConstraint >= 0) return;
    let lastTime = performance.now();
    let direction = -1;
    let rafId;
    function tick(now) {
      rafId = requestAnimationFrame(tick);
      if (isDragging.current || isHovering.current) { lastTime = now; return; }
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const current = dragX.get();
      let next = current + direction * AUTO_SCROLL_SPEED * dt;
      if (next <= dragConstraint) { next = dragConstraint; direction = 1; }
      else if (next >= 0) { next = 0; direction = -1; }
      dragX.set(next);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [dragConstraint, dragX]);

  const progressWidth = useTransform(dragX, [0, dragConstraint || -1], ["0%", "100%"]);

  return (
    <section className="relative py-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 rounded-full bg-sky-50 border border-sky-200/60 px-4 py-1.5 mb-5"
          >
            <FaPlane className="text-[10px] text-sky-500 -rotate-12" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-sky-600 font-semibold">Flight Log</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-4xl font-bold mb-3 text-[#1d1d1f]"
          >
            人生航線
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-sm text-slate-400"
          >
          </motion.p>
        </div>
      </div>

      {/* ═══ Timeline — no outer box, full-bleed map ═══ */}
      <div
        className="group/timeline relative overflow-hidden"
        style={{ height: "clamp(380px, 45vh, 480px)" }}
      >
        {/* ── World map — prominent ── */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.55]">
          <WorldMapBackground />
        </div>

        {/* ── Warm atmospheric glow ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 25% 45%, rgba(14,165,233,0.07) 0%, transparent 55%), radial-gradient(ellipse at 75% 35%, rgba(245,158,11,0.06) 0%, transparent 55%)" }} />

        {/* ── Drag container ── */}
        <div
          ref={containerRef}
          className="relative h-full overflow-hidden"
          onMouseEnter={() => { isHovering.current = true; }}
          onMouseLeave={() => { isHovering.current = false; }}
        >
          <motion.div
            ref={innerRef}
            drag="x"
            dragConstraints={{ left: dragConstraint, right: 0 }}
            dragElastic={0.1}
            dragDirectionLock
            onDragStart={() => { isDragging.current = true; }}
            onDragEnd={() => { requestAnimationFrame(() => { isDragging.current = false; }); }}
            className="flex h-full cursor-grab active:cursor-grabbing select-none"
            style={{ x: dragX, paddingLeft: PAD, paddingRight: PAD, alignItems: "center" }}
          >
            {/* ── Dashed flight path ── */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none">
              <div
                className="h-[2px] w-full"
                style={{
                  backgroundImage: "repeating-linear-gradient(90deg, rgba(100,116,139,0.35) 0, rgba(100,116,139,0.35) 10px, transparent 10px, transparent 22px)",
                }}
              />
            </div>

            {/* ── Animated plane ── */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20"
              style={{ left: "12%" }}
              animate={{ x: [0, 40, 0], y: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <FaPlane className="text-sky-500/60 text-base drop-shadow-sm" />
            </motion.div>

            {events.map((ev, idx) => {
              const s = typeStyle[ev.type];
              const isAbove = idx % 2 === 0;
              const prevEvent = idx < events.length - 1 ? events[idx + 1] : null;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: isAbove ? -30 : 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-shrink-0 flex flex-col items-center relative"
                  style={{
                    width: `${CARD_W}px`,
                    marginRight: idx < events.length - 1 ? `${GAP}px` : 0,
                  }}
                >
                  <div className={`flex flex-col items-center ${isAbove ? "flex-col" : "flex-col-reverse"}`} style={{ minHeight: "100%" }}>

                    <div className="flex-1 min-h-[16px]" />

                    {/* ═══ Boarding Pass Card — landscape 20:8 ═══ */}
                    <button
                      type="button"
                      onClick={() => { if (!isDragging.current) openModal(ev); }}
                      className={`group relative overflow-hidden ${s.cardBg} backdrop-blur-md shadow-lg ${s.glow} transition-all duration-300 cursor-pointer text-left flex`}
                      style={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.06)", width: `${CARD_W}px`, height: `${CARD_H}px` }}
                    >
                      {/* ── Left: accent strip ── */}
                      <div className={`w-[6px] shrink-0 bg-gradient-to-b ${s.strip}`} />

                      {/* ── Main section (left ~70%) ── */}
                      <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
                        {/* Airline header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <FaPlane className={`text-[10px] ${s.accentText}`} />
                            <span className={`text-[10px] font-bold tracking-wider uppercase ${s.accentText}`}>
                              {ev.type === "work" ? "Career Airlines" : "Edu Airlines"}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-300">
                            ML-{String(events.length - idx).padStart(3, "0")}
                          </span>
                        </div>

                        {/* FROM → TO */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="text-center min-w-[42px]">
                            <div className="text-xl font-black text-[#1d1d1f] leading-none">{prevEvent ? prevEvent.loc : "---"}</div>
                            <div className="text-[8px] text-slate-400 mt-0.5">{prevEvent ? prevEvent.locFull : ""}</div>
                          </div>
                          <div className="flex-1 flex items-center gap-1 px-1">
                            <div className="flex-1 border-t border-dashed border-slate-300" />
                            <FaPlane className={`text-[9px] ${s.accentText}`} />
                            <div className="flex-1 border-t border-dashed border-slate-300" />
                          </div>
                          <div className="text-center min-w-[42px]">
                            <div className="text-xl font-black text-[#1d1d1f] leading-none">{ev.loc}</div>
                            <div className="text-[8px] text-slate-400 mt-0.5">{ev.locFull}</div>
                          </div>
                        </div>

                        {/* Info row */}
                        <div className="flex gap-4">
                          <div>
                            <div className="text-[8px] text-slate-400 uppercase tracking-wider">Date</div>
                            <div className={`text-base font-bold ${s.accentText}`}>{ev.year}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[8px] text-slate-400 uppercase tracking-wider">Role</div>
                            <div className="text-sm font-bold text-[#1d1d1f] leading-snug">{ev.title}</div>
                            <div className="text-xs text-slate-500 leading-snug">{ev.org}</div>
                          </div>
                        </div>

                        {/* Duration + barcode */}
                        <div className="flex items-end justify-between mt-auto pt-2">
                          <div className="text-[11px] font-medium text-slate-500 truncate mr-3">{ev.duration}</div>
                          <BarcodeSVG width={80} height={14} />
                        </div>
                      </div>

                      {/* ── Vertical perforation ── */}
                      <div className="relative w-0 shrink-0">
                        <div className="absolute inset-y-0 left-0 border-l border-dashed border-slate-200" />
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#f5f5f7]" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#f5f5f7]" />
                      </div>

                      {/* ── Right stub (~30%) ── */}
                      <div className="w-[130px] shrink-0 flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-3xl mb-1">{ev.flag}</span>
                        <div className="text-2xl font-black text-[#1d1d1f] leading-none mb-0.5">{ev.loc}</div>
                        <div className="text-[9px] text-slate-400 mb-2">{ev.locFull}</div>
                        <span className="mt-1 text-[8px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          查看詳情 →
                        </span>
                      </div>
                    </button>

                    {/* ── Connecting stem ── */}
                    <div className={`w-px h-5 bg-gradient-to-b ${s.strip} opacity-40`} />

                    {/* ── Timeline dot ── */}
                    <div className="relative flex-shrink-0 z-10">
                      <div className={`w-4 h-4 rounded-full ${s.dot} ring-4 ring-[#f5f5f7] shadow-md`} />
                    </div>

                    <div className="w-px h-5 opacity-0" />
                    <div className="flex-1 min-h-[16px]" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f5f5f7] to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f5f5f7] to-transparent pointer-events-none z-10" />

          {/* Arrow buttons — subtle, appear on hover */}
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 flex items-center justify-center text-slate-400 opacity-0 hover:opacity-100 hover:bg-white/80 hover:text-slate-600 hover:shadow-md group-hover/timeline:opacity-60 transition-all duration-300 cursor-pointer"
          >
            <FaChevronLeft className="text-[10px]" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 flex items-center justify-center text-slate-400 opacity-0 hover:opacity-100 hover:bg-white/80 hover:text-slate-600 hover:shadow-md group-hover/timeline:opacity-60 transition-all duration-300 cursor-pointer"
          >
            <FaChevronRight className="text-[10px]" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-200/30">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-400 to-amber-400 rounded-full"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      {/* ═══ MODAL ═══ */}
      <AnimatePresence>
        {selected && <DetailModal ev={selected} s={typeStyle[selected.type]} onClose={closeModal} />}
      </AnimatePresence>
    </section>
  );
}

/* ── Detail Modal ── */
const listStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const listItem = { hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0, transition: { duration: 0.25 } } };

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
      <div className="absolute inset-0 bg-black/15 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md overflow-hidden bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-300/30 text-[#1d1d1f]"
        style={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.06)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className={`flex items-center justify-between px-5 py-2.5 bg-gradient-to-r ${s.strip} text-white`}>
          <div className="flex items-center gap-1.5">
            <FaPlane className="text-[10px] opacity-80" />
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {ev.type === "work" ? "Career Airlines" : "Edu Airlines"}
            </span>
          </div>
          <span className="text-[10px] font-mono opacity-80">
            ML-{String(events.length - events.indexOf(ev)).padStart(3, "0")}
          </span>
        </div>

        <div className="p-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2.5 right-4 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <FaTimes className="text-xs" />
          </button>

          {/* FROM → TO */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl leading-none">{ev.flag}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-[#1d1d1f] leading-snug">{ev.title}</h3>
              <p className={`text-sm ${s.accentText} font-medium`}>{ev.org}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{ev.year} · {ev.locFull} ({ev.loc})</p>
            </div>
          </div>

          {/* Perforation */}
          <div className="relative my-3">
            <div className="border-t border-dashed border-slate-200" />
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#f5f5f7]" />
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#f5f5f7]" />
          </div>

          <motion.ul className="space-y-2.5" variants={listStagger} initial="hidden" animate="visible">
            {ev.detail.map((item, i) => (
              <motion.li key={i} variants={listItem} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                {item}
              </motion.li>
            ))}
          </motion.ul>

          {/* Barcode */}
          <div className="mt-4 flex items-center justify-between">
            <BarcodeSVG width={120} height={20} />
            <span className="text-[9px] text-slate-300 font-mono">BOARDING PASS</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
