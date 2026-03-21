"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";

const i18n = {
  zh: {
    tagline: "Articles",
    title: "文章",
    desc: "記錄我對 AI、資料工程與產品落地的思考與實作。",
    all: "全部",
    readMore: "閱讀全文",
    categories: ["資料分析", "資料科學", "AI", "資料工程"],
  },
  en: {
    tagline: "Articles",
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
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="max-w-5xl mx-auto">

          {/* Hero */}
          <motion.div className="mb-14" initial="hidden" animate="visible">
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-xs uppercase tracking-[0.35em] text-indigo-400/70 font-medium mb-4"
            >
              {t.tagline}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-5"
            >
              <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                {t.title}
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-white/50 max-w-2xl leading-relaxed">
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
                  ? "bg-white text-[#0a0a0a] border-white shadow-sm"
                  : "bg-white/[0.05] text-white/50 border-white/[0.08] hover:border-white/20 hover:text-white/80"
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
                    ? "bg-white text-[#0a0a0a] border-white shadow-sm"
                    : "bg-white/[0.05] text-white/50 border-white/[0.08] hover:border-white/20 hover:text-white/80"
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
                  className="group relative overflow-hidden bg-white/[0.05] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.08] hover:border-white/20 hover:shadow-lg hover:shadow-black/20 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400/[0.06] to-indigo-400/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center space-x-2 text-sky-400">
                        <FaBookOpen />
                        {post.category && (
                          <span className="text-xs uppercase tracking-wide font-medium">{post.category}</span>
                        )}
                      </div>
                      <div className="text-xs text-white/40">{post.date} · {post.readingTime}</div>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="text-sm text-white/50 mb-4 leading-relaxed group-hover:text-white/65 transition-colors duration-300">
                      {post.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 bg-sky-500/[0.12] border border-sky-500/20 rounded-full text-[10px] font-medium text-sky-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`${linkPrefix}/${post.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-sky-400 group-hover:text-indigo-400 transition-colors duration-300"
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
