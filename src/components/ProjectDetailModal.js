"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaGithub, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const listStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const listItem = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

const i18n = {
  zh: { highlights: "專案亮點", tech: "技術棧", viewCode: "查看程式碼", metrics: "關鍵指標" },
  en: { highlights: "Highlights", tech: "Tech Stack", viewCode: "View Code", metrics: "Key Metrics" },
};

export default function ProjectDetailModal({ project, locale = "zh", onClose }) {
  const t = i18n[locale] || i18n.zh;

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const hasDetail = project.detailDescription || project.highlights;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-3xl overflow-hidden bg-[#141414] shadow-2xl shadow-black/60 text-white flex flex-col sm:flex-row border border-white/[0.08]"
        style={{ borderRadius: "16px", maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══ LEFT: Main content ══ */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Gradient header */}
          <div className={`relative px-6 pt-5 pb-4 bg-gradient-to-r ${project.color} text-white`}>
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
            >
              <FaTimes className="text-[10px]" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/80">{project.categoryIcon}</span>
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">
                {project.category}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold leading-snug pr-8">
              {project.title}
            </h2>
          </div>

          {/* Metrics row */}
          <div className="flex border-b border-white/[0.08]">
            {project.metrics.map((m, i) => (
              <div
                key={i}
                className={`flex-1 px-4 py-2.5 text-center ${i < project.metrics.length - 1 ? "border-r border-white/[0.08]" : ""}`}
              >
                <div className="text-[8px] uppercase tracking-wider text-white/30">{m.label}</div>
                <div className="text-sm font-bold text-white">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Scrollable body */}
          <div className="flex-1 px-6 py-5 overflow-y-auto" style={{ maxHeight: "400px" }}>
            {/* Description */}
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              {hasDetail ? project.detailDescription : project.description}
            </p>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <>
                <div className="relative my-4">
                  <div className="border-t border-dashed border-white/[0.08]" />
                  <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#141414]" />
                  <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#141414]" />
                </div>

                <div className="text-[8px] uppercase tracking-wider text-white/30 mb-2">{t.highlights}</div>
                <motion.ul className="space-y-2 mb-4" variants={listStagger} initial="hidden" animate="visible">
                  {project.highlights.map((item, i) => (
                    <motion.li key={i} variants={listItem} className="flex items-start gap-2 text-[13px] text-white/50 leading-relaxed">
                      <FaCheckCircle className={`mt-0.5 text-xs shrink-0 bg-gradient-to-r ${project.color} text-white rounded-full`} />
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </>
            )}

            {/* Tech tags */}
            <div className="text-[8px] uppercase tracking-wider text-white/30 mb-2">{t.tech}</div>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 bg-white/[0.05] border border-white/[0.08] rounded-full text-[11px] font-medium text-white/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom action */}
          <div className="px-6 py-3 border-t border-white/[0.08] flex items-center justify-between">
            {project.link && project.link !== "#" ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <FaGithub className="text-base" />
                {t.viewCode}
                <FaArrowRight className="text-[10px]" />
              </a>
            ) : (
              <span className="text-xs text-white/20 italic">Private project</span>
            )}
          </div>
        </div>

        {/* ══ RIGHT STUB (desktop only) ══ */}
        <div className="hidden sm:flex relative w-[140px] shrink-0 flex-col items-center justify-center border-l border-dashed border-white/[0.08] bg-white/[0.03]">
          {/* Perforation notches */}
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#141414]" />
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#141414]" />

          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-white shadow-md mb-3`}>
            {project.icon}
          </div>
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider text-center px-2">
            {project.category}
          </div>
          <div className="text-[8px] text-white/20 mt-1 text-center px-2">
            {t.metrics}
          </div>
          <div className="mt-3 space-y-1.5">
            {project.metrics.map((m, i) => (
              <div key={i} className="text-center">
                <div className="text-xs font-bold text-white">{m.value}</div>
                <div className="text-[8px] text-white/40">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
