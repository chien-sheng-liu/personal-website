"use client";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLinkedin,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";

const TO_EMAIL = "liu_chiensheng@outlook.com";
const CALENDAR_URL = "https://calendar.app.google/MANJXP2ZZiaWF5T26";
const LINKEDIN_URL = "https://www.linkedin.com/in/chienshengliu/";

const i18n = {
  zh: {
    tagline: "Let's Talk",
    heroTitle: "有想法？聊聊吧",
    heroDesc: "無論是 AI 專案、數據策略，或只是想交流想法，都歡迎找我。",
    location: "香港",
    languages: "中文 · English · Deutsch",
    channels: [
      {
        key: "email",
        icon: <FaEnvelope />,
        label: "Email",
        subtitle: "最快的方式",
        value: TO_EMAIL,
        href: `mailto:${TO_EMAIL}`,
        color: "#ef4444",
      },
      {
        key: "linkedin",
        icon: <FaLinkedin />,
        label: "LinkedIn",
        subtitle: "專業網路",
        value: "Chien-Sheng (Morris) Liu",
        href: LINKEDIN_URL,
        color: "#0077b5",
      },
      {
        key: "calendar",
        icon: <FaCalendarAlt />,
        label: "預約會談",
        subtitle: "30 分鐘 · Google Calendar",
        value: "選一個適合你的時段",
        href: CALENDAR_URL,
        color: "#16a34a",
      },
    ],
    responseNote: "通常 24 小時內回覆",
  },
  en: {
    tagline: "Let's Talk",
    heroTitle: "Got an idea? Let's chat",
    heroDesc: "Whether it's an AI project, data strategy, or just exchanging ideas — I'd love to hear from you.",
    location: "Hong Kong",
    languages: "Chinese · English · Deutsch",
    channels: [
      {
        key: "email",
        icon: <FaEnvelope />,
        label: "Email",
        subtitle: "Fastest way to reach me",
        value: TO_EMAIL,
        href: `mailto:${TO_EMAIL}`,
        color: "#ef4444",
      },
      {
        key: "linkedin",
        icon: <FaLinkedin />,
        label: "LinkedIn",
        subtitle: "Professional network",
        value: "Chien-Sheng (Morris) Liu",
        href: LINKEDIN_URL,
        color: "#0077b5",
      },
      {
        key: "calendar",
        icon: <FaCalendarAlt />,
        label: "Book a call",
        subtitle: "30 min · Google Calendar",
        value: "Pick a time that works for you",
        href: CALENDAR_URL,
        color: "#16a34a",
      },
    ],
    responseNote: "Usually reply within 24 hours",
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

export default function ContactPage({ locale = "zh" }) {
  const t = i18n[locale] || i18n.zh;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="max-w-2xl mx-auto">

          {/* ── Hero ── */}
          <motion.div className="mb-16" initial="hidden" animate="visible">
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
                {t.heroTitle}
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-white/50 leading-relaxed mb-6"
            >
              {t.heroDesc}
            </motion.p>

            {/* Quick meta */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap gap-3 text-sm text-white/40"
            >
              <span className="inline-flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-xs text-sky-400" />
                {t.location}
              </span>
              <span className="text-white/20">·</span>
              <span className="inline-flex items-center gap-1.5">
                <FaGlobe className="text-xs text-sky-400" />
                {t.languages}
              </span>
            </motion.div>
          </motion.div>

          {/* ── Contact channels ── */}
          <div className="space-y-4 mb-12">
            {t.channels.map((ch, i) => (
              <motion.a
                key={ch.key}
                href={ch.href}
                target={ch.key === "email" ? undefined : "_blank"}
                rel={ch.key === "email" ? undefined : "noopener noreferrer"}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                custom={i}
                variants={fadeUp}
                className="group flex items-center gap-5 p-5 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] hover:border-white/20 hover:shadow-lg hover:shadow-black/20 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg shadow-lg"
                  style={{ backgroundColor: ch.color }}
                >
                  {ch.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                      {ch.label}
                    </h3>
                    <span className="text-xs text-white/40">{ch.subtitle}</span>
                  </div>
                  <p className="text-sm text-white/50 truncate mt-0.5">{ch.value}</p>
                </div>

                {/* Arrow */}
                <FaArrowRight className="flex-shrink-0 text-xs text-white/20 group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* ── Response note ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex items-center justify-center gap-2 text-sm text-white/40"
          >
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {t.responseNote}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
