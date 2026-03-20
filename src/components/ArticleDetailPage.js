"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedGradientBg from "./AnimatedGradientBg";
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
    <div className="relative min-h-screen text-[#1d1d1f] overflow-x-hidden">
      <ReadingProgress />

      {/* Background */}
      <AnimatedGradientBg variant="hero" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.04),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.03),transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        {/* ── Header ── */}
        <div className="max-w-3xl mx-auto mb-10">
          <motion.div initial="hidden" animate="visible">
            {/* Breadcrumb */}
            <motion.div variants={fadeUp} custom={0} className="mb-6">
              <Link
                href={t.backPrefix}
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-sky-500 transition-colors"
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
              <span className="bg-gradient-to-r from-slate-900 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                {meta.title}
              </span>
            </motion.h1>

            {/* Meta row */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-4"
            >
              <span>{meta.date}</span>
              {meta.readingTime && (
                <>
                  <span className="text-slate-200">·</span>
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
                    className="px-2.5 py-1 bg-sky-500/8 border border-sky-500/15 rounded-full text-[11px] font-medium text-sky-600 tracking-wide"
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
                className="text-lg text-slate-500 leading-relaxed"
              >
                {meta.summary}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* ── Body + TOC ── */}
        <div className="max-w-3xl mx-auto xl:max-w-none xl:flex xl:justify-center xl:gap-10">
          {/* Article glass card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl"
          >
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10">
              <article className="leading-relaxed text-slate-600">
                <MarkdownRenderer html={html} />
              </article>
            </div>

            {/* Bottom back link */}
            <div className="mt-8 text-center">
              <Link
                href={t.backPrefix}
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-sky-500 transition-colors font-medium"
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
