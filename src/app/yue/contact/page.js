"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLinkedin, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaGlobe, FaPaperPlane } from "react-icons/fa";

const TO_EMAIL = "liu_chiensheng@outlook.com";

const contactInfo = [
  { icon: <FaEnvelope size={24} />, label: "Email", value: TO_EMAIL, href: `mailto:${TO_EMAIL}`, description: "最快聯絡方式", color: "from-red-500 to-orange-500" },
  { icon: <FaLinkedin size={24} />, label: "LinkedIn", value: "Chien-Sheng (Morris) Liu", href: "https://www.linkedin.com/in/chienshengliu/", description: "專業社交網絡", color: "from-blue-600 to-blue-400" },
  { icon: <FaCalendarAlt size={24} />, label: "預約會談（Google Calendar）", value: "預約 30 分鐘", href: "https://calendar.app.google/jPexFUzauM39fYfV9", description: "睇可約時段或直接預約", color: "from-green-600 to-emerald-400", type: "calendar" },
];

const quickInfo = [
  { icon: <FaMapMarkerAlt size={20} />, label: "位置", value: "香港" },
  { icon: <FaClock size={20} />, label: "回覆時間", value: "24–48 小時" },
  { icon: <FaGlobe size={20} />, label: "語言", value: "中文、English、Deutsch" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

const ContactPageYue = () => {

  return (
    <div className="relative min-h-screen text-slate-800 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-sky-100 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-60" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-sky-50 rounded-full filter blur-3xl opacity-40" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-sky-600 to-indigo-600" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            聯絡我
          </motion.h1>
          <motion.p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            歡迎討論合作、項目諗法，或者任何關於 <span className="text-sky-500 font-semibold">數據科學</span> 同 <span className="text-indigo-600 font-semibold">AI</span> 嘅主題。
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-4 mb-12" variants={containerVariants} initial="hidden" animate="visible">
            {quickInfo.map((info, index) => (
              <motion.div key={index} variants={itemVariants} className="flex items-center space-x-3 px-6 py-3 bg-white shadow-sm backdrop-blur-lg rounded-full border border-slate-200">
                <div className="text-sky-500">{info.icon}</div>
                <div><span className="text-slate-500 text-sm">{info.label}:</span><span className="text-slate-900 font-medium ml-2">{info.value}</span></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <motion.h2 className="text-3xl font-bold text-slate-900 mb-8" variants={itemVariants}>聯絡方式</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((item, index) => (
              <motion.a key={index} href={item.href} target="_blank" rel="noopener noreferrer" variants={itemVariants} className="group block relative overflow-hidden bg-white shadow-sm backdrop-blur-xl rounded-2xl p-6 border border-slate-200 transition-all duration-500 hover:border-sky-300 hover:shadow-lg" whileHover={{ y: -3 }}>
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="relative flex items-center space-x-6">
                  <motion.div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`} whileHover={{ rotate: 5, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>{item.icon}</motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors duration-300">{item.label}</h3>
                    <p className="text-slate-600 font-medium mt-1 group-hover:text-slate-900 transition-colors duration-300">{item.value}</p>
                    <p className="text-sm text-slate-400 mt-1 group-hover:text-slate-500 transition-colors duration-300">{item.description}</p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-all duration-300">
                    <motion.div className="text-sky-500 text-sm" animate={{ x: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity }}>→</motion.div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-sky-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.a>
            ))}
            </div>
            <motion.div variants={itemVariants} className="relative overflow-hidden bg-white shadow-sm backdrop-blur-xl rounded-2xl p-6 border border-indigo-200 mt-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-sky-50/50"></div>
              <div className="relative">
                <h3 className="text-lg font-bold text-indigo-600 mb-2">回覆承諾</h3>
                <p className="text-slate-500 text-sm leading-relaxed">我承諾 24–48 小時內回覆。如有急事，請直接 Email 並喺主旨註明「緊急」。</p>
              </div>
            </motion.div>
          </motion.div>

          {false && (
          <motion.div className="relative" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="relative overflow-hidden bg-white shadow-lg backdrop-blur-xl rounded-3xl p-8 border border-slate-200">
              <div className="text-center mb-8">
                <motion.div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl mb-4" whileHover={{ rotate: 5, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <FaPaperPlane className="text-white text-xl" />
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">發送訊息</h2>
                <p className="text-slate-500 text-sm">填好以下表單，會用你嘅郵件程式打開草稿</p>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(e); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-800">姓名 <span className="text-red-400">*</span></label>
                    <motion.input type="text" id="name" placeholder="你嘅姓名" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-slate-900 placeholder-gray-400" whileFocus={{ scale: 1.02 }} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-800">電子郵件 <span className="text-red-400">*</span></label>
                    <motion.input type="email" id="email" placeholder="你嘅電子郵件（寄件者）" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-slate-900 placeholder-gray-400" whileFocus={{ scale: 1.02 }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-800">主旨</label>
                  <motion.input type="text" id="subject" placeholder="主旨（可留空）" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-slate-900 placeholder-gray-400" whileFocus={{ scale: 1.02 }} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-800">內容</label>
                  <motion.textarea id="message" placeholder="寫低你想講嘅內容" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-slate-900 placeholder-gray-400" whileFocus={{ scale: 1.01 }} />
                </div>
                <motion.button type="submit" disabled={sending} className="w-full py-4 px-6 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 disabled:opacity-60 disabled:cursor-not-allowed" whileHover={{ scale: sending ? 1 : 1.02 }} whileTap={{ scale: sending ? 1 : 0.98 }}>
                  <span>{sending ? '傳送中…' : '用你嘅郵件程式寄出'}</span>
                </motion.button>
                <div className="text-center text-xs text-slate-500 mt-2 space-x-3">
                  <button type="button" onClick={openWithGmail} className="underline hover:text-slate-900">改用 Gmail</button>
                  <span>·</span>
                  <button type="button" onClick={openWithOutlookWeb} className="underline hover:text-slate-900">改用 Outlook Web</button>
                </div>
                {feedback && (<div aria-live="assertive" className="text-sm mt-2 p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-600">{feedback}</div>)}
                <div className="mt-6 pt-6 border-t border-slate-200"><p className="text-center text-sm text-slate-400">送出會打開你嘅郵件視窗；實際寄送仍需要你確認再撳「傳送」。</p></div>
              </form>

              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-100 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
          )}
        </div>

        <motion.div className="text-center mt-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">準備開始合作未？</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">無論係 AI 開發、職涯諮詢，或者任何數據挑戰，我都樂意傾下同提供專業建議。</p>
            <motion.div className="inline-flex items-center space-x-2 px-8 py-3 bg-sky-500/10 border border-sky-300 rounded-full text-sky-500" animate={{ boxShadow: ["0 0 20px rgba(0, 191, 255, 0.0)", "0 0 20px rgba(0, 191, 255, 0.15)", "0 0 20px rgba(0, 191, 255, 0.0)"] }} transition={{ duration: 3, repeat: Infinity }}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="font-medium">在線，隨時回覆</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPageYue;
