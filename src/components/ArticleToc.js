"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tocStrings = {
  zh: "目錄",
  en: "On this page",
};

export default function ArticleToc({ toc, locale = "zh" }) {
  const [activeId, setActiveId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    if (!toc.length) return;

    const headings = toc
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is intersecting (visible)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  const handleClick = useCallback(
    (e, id) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
      }
      setDrawerOpen(false);
    },
    []
  );

  if (!toc.length) return null;

  const title = tocStrings[locale] || tocStrings.zh;

  const tocList = (
    <nav className="relative">
      {/* Vertical guide line */}
      <div className="absolute left-[5px] top-1 bottom-1 w-px bg-slate-200/80" />

      <div className="space-y-0.5">
        {toc.map((h) => {
          const isActive = activeId === h.id;
          const isChild = h.level >= 3;
          return (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={(e) => handleClick(e, h.id)}
              className={`relative flex items-start gap-2.5 py-1.5 transition-all duration-200 ${
                isChild ? "pl-5" : "pl-0"
              }`}
            >
              {/* Dot indicator */}
              <span
                className={`relative z-10 shrink-0 rounded-full transition-all duration-200 ${
                  isActive
                    ? "w-[9px] h-[9px] bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.4)] mt-[5px]"
                    : isChild
                      ? "w-[5px] h-[5px] bg-slate-300 mt-[7px]"
                      : "w-[7px] h-[7px] bg-slate-300 mt-[6px]"
                }`}
                style={{ marginLeft: isChild ? "-1px" : "-2px" }}
              />
              <span
                className={`leading-snug transition-colors duration-200 ${
                  isActive
                    ? "text-sky-600 font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                } ${isChild ? "text-[11.5px] text-slate-400" : "text-[13px] font-medium"}`}
              >
                {h.text}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden xl:block sticky top-28 h-max w-56 shrink-0">
        <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 shadow-sm">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">
            {title}
          </div>
          {tocList}
        </div>
      </aside>

      {/* Mobile: floating button + drawer */}
      <div className="xl:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg flex items-center justify-center text-slate-500 hover:text-sky-600 hover:border-sky-300 transition-all duration-200"
          aria-label={title}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
          </svg>
        </button>

        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
                onClick={() => setDrawerOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 max-h-[60vh] overflow-y-auto bg-white/90 backdrop-blur-xl border-t border-slate-200/60 rounded-t-2xl p-6 pb-10 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    {title}
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                {tocList}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
