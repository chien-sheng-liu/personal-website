"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ReadingProgress from "./ReadingProgress";
import ArticleToc from "./ArticleToc";
import MarkdownRenderer from "./MarkdownRenderer";

const i18n = {
  zh: { back: "回到文章列表", backPrefix: "/articles" },
  en: { back: "Back to articles", backPrefix: "/en/articles" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ArticleDetailPage({ meta, html, toc, locale = "zh" }) {
  const t = i18n[locale] || i18n.zh;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <ReadingProgress />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        {/* ── Header ── */}
        <div className="max-w-4xl mx-auto mb-10">
          <motion.div initial="hidden" animate="visible">
            {/* Breadcrumb */}
            <motion.div variants={fadeUp} custom={0} className="mb-6">
              <Link
                href={t.backPrefix}
                className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-sky-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {t.back}
              </Link>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight mb-4"
            >
              <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                {meta.title}
              </span>
            </motion.h1>

            {/* Meta row */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="flex flex-wrap items-center gap-3 text-sm text-white/35 mb-4"
            >
              <span>{meta.date}</span>
              {meta.readingTime && (
                <>
                  <span className="text-white/20">·</span>
                  <span>{meta.readingTime}</span>
                </>
              )}
            </motion.div>

            {/* Tags */}
            {meta.tags && meta.tags.length > 0 && (
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-2 mb-5">
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-[11px] font-medium text-sky-400 tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Summary */}
            {meta.summary && (
              <motion.p
                variants={fadeUp}
                custom={4}
                className="text-lg text-white/45 leading-relaxed"
              >
                {meta.summary}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* ── Body + TOC ── */}
        <div className="max-w-4xl mx-auto xl:max-w-none xl:flex xl:justify-center xl:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl min-w-0"
          >
            <article className="leading-relaxed">
              <MarkdownRenderer html={html} />
            </article>

            {/* Bottom back link */}
            <div className="mt-12 pt-8 border-t border-white/[0.07]">
              <Link
                href={t.backPrefix}
                className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-sky-400 transition-colors font-medium"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {t.back}
              </Link>
            </div>
          </motion.div>

          {/* TOC sidebar */}
          <ArticleToc toc={toc} locale={locale} />
        </div>
      </div>
    </div>
  );
}
