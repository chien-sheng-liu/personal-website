"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaEnvelope,
  FaLinkedin,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaGlobe,
} from "react-icons/fa";

const TO_EMAIL = "liu_chiensheng@outlook.com";

const contactInfo = [
  {
    icon: <FaEnvelope size={24} />,
    label: "Email",
    value: TO_EMAIL,
    href: `mailto:${TO_EMAIL}`,
    description: "最快的聯繫方式",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: <FaLinkedin size={24} />,
    label: "LinkedIn",
    value: "Chien-Sheng (Morris) Liu",
    href: "https://www.linkedin.com/in/chienshengliu/",
    description: "專業社交網路",
    color: "from-blue-600 to-blue-400",
  },
  {
    icon: <FaCalendarAlt size={24} />,
    label: "預約會談（Google Calendar）",
    value: "預約 30 分鐘諮詢",
    href: "https://calendar.app.google/jPexFUzauM39fYfV9",
    description: "直接選擇可用時段進行預約",
    type: 'calendar',
    color: "from-green-600 to-emerald-400",
  },
];

const quickInfo = [
  { icon: <FaMapMarkerAlt size={20} />, label: "位置", value: "香港, 香港" },
  { icon: <FaClock size={20} />, label: "回覆時間", value: "24-48 小時內" },
  { icon: <FaGlobe size={20} />, label: "語言", value: "中文, English, Deutsch" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const floatingVariants = {
  animate: {
    y: [-8, 8, -8],
    rotate: [-2, 2, -2],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

const ContactPage = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  return (
    <div className="relative min-h-screen text-slate-800 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.05),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.04),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-sky-600 to-indigo-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            與我聯繫
          </motion.h1>
          <motion.p
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            我非常樂意與您討論潛在的合作機會、專案想法，或任何與{" "}
            <span className="text-sky-500 font-semibold">數據科學</span>、<span className="text-indigo-500 font-semibold">AI</span>{" "}
            相關的話題。
          </motion.p>

          <motion.div className="flex flex-wrap justify-center gap-4 mb-12" variants={containerVariants} initial="hidden" animate="visible">
            {quickInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center space-x-3 px-6 py-3 bg-white shadow-sm rounded-full border border-slate-200"
              >
                <div className="text-sky-500">{info.icon}</div>
                <div>
                  <span className="text-slate-500 text-sm">{info.label}:</span>
                  <span className="text-slate-800 font-medium ml-2">{info.value}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* 聯絡方式卡片 */}
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <motion.h2 className="text-3xl font-bold text-slate-900 mb-8" variants={itemVariants}>
              聯絡方式
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactInfo.map((item, index) => {
                const base = "group block relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm transition-all duration-500 hover:border-sky-300 hover:shadow-lg";
                const inner = (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    <div className="relative flex items-center space-x-6">
                      <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-sky-600 transition-colors duration-300">{item.label}</h3>
                        <p className="text-slate-600 font-medium mt-1 group-hover:text-slate-800 transition-colors duration-300">{item.value}</p>
                        <p className="text-sm text-slate-400 mt-1 group-hover:text-slate-500 transition-colors duration-300">{item.description}</p>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-all duration-300">
                        <span className="text-sky-500 text-sm">→</span>
                      </div>
                    </div>
                  </>
                );
                return (
                  <motion.div key={index} variants={itemVariants} whileHover={{ y: -3 }}>
                    {item.type === 'calendar' ? (
                      <button type="button" onClick={() => setCalendarOpen(true)} className={base}>{inner}</button>
                    ) : (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className={base}>{inner}</a>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden bg-indigo-50 rounded-2xl p-6 border border-indigo-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-sky-50/50"></div>
              <div className="relative">
                <h3 className="text-lg font-bold text-indigo-500 mb-2">回覆承諾</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  我承諾在 24-48 小時內回覆所有訊息。對於緊急事項，請直接透過 Email 聯繫，並在主旨標註「緊急」。
                </p>
              </div>
            </motion.div>
          </motion.div>

          
        </div>

        {/* CTA 區塊 */}
        <motion.div
          className="text-center mt-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">準備開始合作了嗎？</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              無論是 AI 專案開發、職涯諮詢，或是任何數據科學相關的挑戰，我都很樂意與您討論並提供專業建議。
            </p>
            <motion.div
              className="inline-flex items-center space-x-2 px-8 py-3 bg-sky-50 border border-sky-200 rounded-full text-sky-600"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="font-medium">線上且隨時準備回覆</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {calendarOpen && (
        <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 relative shadow-2xl">
            <button onClick={() => setCalendarOpen(false)} className="absolute top-3 right-3 rounded-full bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm text-slate-600">✕</button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">選擇可約時段</h3>
            <p className="text-sm text-slate-500 mb-4">時區：HKT（UTC+8）。你也可以直接開啟 Google Calendar 預約。</p>
            <div className="space-y-2 mb-4">
              {['本週三 20:00 - 20:30','本週六 10:00 - 10:30','下週一 19:30 - 20:00'].map((slot, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <div className="text-slate-800 text-sm">{slot}</div>
                  <a href="https://calendar.app.google/jPexFUzauM39fYfV9" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-indigo-500 text-sm font-semibold">預約</a>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <a href="https://calendar.app.google/jPexFUzauM39fYfV9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600">開啟 Google Calendar</a>
              <button onClick={() => setCalendarOpen(false)} className="text-sm text-slate-500 hover:text-slate-800">稍後再說</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
