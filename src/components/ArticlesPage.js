"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";
import AnimatedGradientBg from "./AnimatedGradientBg";

const i18n = {
  zh: {
    title: "文章",
    desc: "記錄我對 AI、資料工程與產品落地的思考與實作。",
    all: "全部",
    readMore: "閱讀全文",
    categories: ["資料分析", "資料科學", "AI", "資料工程"],
  },
  en: {
    title: "Articles",
    desc: "Writing on AI, data engineering, and taking products to production.",
    all: "All",
    readMore: "Read more",
    categories: ["Data Analysis", "Data Science", "AI", "Data Engineering"],
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ArticlesPage({ posts, locale = "zh" }) {
  const t = i18n[locale] || i18n.zh;
  const [activeFilter, setActiveFilter] = useState(null);
  const linkPrefix = locale === "zh" ? "/articles" : `/${locale}/articles`;

  const filteredPosts = useMemo(
    () => (activeFilter ? posts.filter((p) => p.category === activeFilter) : posts),
    [posts, activeFilter],
  );

  return (
    <div className="relative min-h-screen text-[#1d1d1f] overflow-hidden">
      <AnimatedGradientBg variant="hero" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.div className="text-center mb-14" initial="hidden" animate="visible">
            <motion.h1
              variants={fadeUp}
              custom={0}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-sky-600 to-indigo-600"
            >
              {t.title}
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-slate-500 max-w-3xl mx-auto">
              {t.desc}
            </motion.p>
          </motion.div>

          {/* Filter bar */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-10"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                activeFilter === null
                  ? "bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-sm"
                  : "bg-white/70 text-slate-500 border-slate-200/60 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {t.all}
            </button>
            {t.categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                  activeFilter === cat
                    ? "bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-sm"
                    : "bg-white/70 text-slate-500 border-slate-200/60 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Article cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center space-x-2 text-sky-500">
                        <FaBookOpen />
                        {post.category && (
                          <span className="text-xs uppercase tracking-wide font-medium">{post.category}</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{post.date} · {post.readingTime}</div>
                    </div>
                    <h2 className="text-xl font-bold text-[#1d1d1f] mb-2 group-hover:text-sky-600 transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed group-hover:text-slate-600 transition-colors duration-300">
                      {post.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 bg-sky-500/8 border border-sky-500/15 rounded-full text-[10px] font-medium text-sky-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`${linkPrefix}/${post.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-sky-600 group-hover:text-indigo-600 transition-colors duration-300"
                    >
                      {t.readMore}
                      <FaArrowRight className="ml-1.5 text-[10px] group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
