"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLinkedin, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaGlobe, FaPaperPlane } from "react-icons/fa";

const TO_EMAIL = "liu_chiensheng@outlook.com";

const contactInfo = [
  { icon: <FaEnvelope size={24} />, label: "Email", value: TO_EMAIL, href: `mailto:${TO_EMAIL}`, description: "Fastest way to reach me", color: "from-red-500 to-orange-500" },
  { icon: <FaLinkedin size={24} />, label: "LinkedIn", value: "Chien-Sheng (Morris) Liu", href: "https://www.linkedin.com/in/chienshengliu/", description: "Professional network", color: "from-blue-600 to-blue-400" },
  { icon: <FaCalendarAlt size={24} />, label: "Book a call (Google Calendar)", value: "Schedule a 30-min chat", href: "https://calendar.app.google/jPexFUzauM39fYfV9", description: "Preview timeslots or book directly", color: "from-green-600 to-emerald-400", type: "calendar" },
];

const quickInfo = [
  { icon: <FaMapMarkerAlt size={20} />, label: "Location", value: "Hong Kong" },
  { icon: <FaClock size={20} />, label: "Response", value: "24–48 hours" },
  { icon: <FaGlobe size={20} />, label: "Languages", value: "Chinese, English, Deutsch" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };
const floatingVariants = { animate: { y: [-8, 8, -8], rotate: [-2, 2, -2], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } } };

const ContactPageEn = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const isEmailValid = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const buildSubject = () => (subject || `New contact message: ${name || "No name"}`).trim();

  const buildBody = () => {
    const lines = [
      `Hello, this is ${name || "(no name)"}.`,
      "",
      message || "(no message)",
      "",
      "—",
      `Name: ${name || "(no name)"}`,
      `Email: ${email || "(no email)"}`,
      typeof window !== "undefined" ? `From page: ${window.location.href}` : "",
    ].filter(Boolean);
    return lines.join("\n");
  };

  const openWithMailto = () => {
    const su = encodeURIComponent(buildSubject());
    const bo = encodeURIComponent(buildBody());
    const cc = email && isEmailValid(email) ? `&cc=${encodeURIComponent(email)}` : "";
    const url = `mailto:${encodeURIComponent(TO_EMAIL)}?subject=${su}&body=${bo}${cc}`;
    window.location.href = url;
  };

  const openWithGmail = () => {
    const su = encodeURIComponent(buildSubject());
    const bo = encodeURIComponent(buildBody());
    const cc = email && isEmailValid(email) ? `&cc=${encodeURIComponent(email)}` : "";
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TO_EMAIL)}${cc}&su=${su}&body=${bo}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const openWithOutlookWeb = () => {
    const su = encodeURIComponent(buildSubject());
    const bo = encodeURIComponent(buildBody());
    const cc = email && isEmailValid(email) ? `&cc=${encodeURIComponent(email)}` : "";
    const url = `https://outlook.live.com/owa/?path=/mail/action/compose&to=${encodeURIComponent(TO_EMAIL)}${cc}&subject=${su}&body=${bo}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const validate = () => {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim()) return "Please enter your email.";
    if (!isEmailValid(email)) return "Please enter a valid email format.";
    return null;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setFeedback(err); return; }
    setSending(true);
    try { openWithMailto(); } finally { setTimeout(() => setSending(false), 300); }
  };

  return (
    <div className="relative min-h-screen text-slate-800 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-sky-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-20" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-sky-100 rounded-full filter blur-3xl opacity-15" style={{ animationDelay: "4s" }}></div>
        <motion.div className="absolute top-1/4 right-1/4 w-4 h-4 border-2 border-sky-300 rotate-45" variants={floatingVariants} animate="animate" />
        <motion.div className="absolute top-2/3 left-1/5 w-3 h-3 bg-indigo-300 rounded-full" variants={floatingVariants} animate="animate" style={{ animationDelay: "2s" }} />
        <motion.div className="absolute top-1/2 left-1/4 w-2 h-2 border border-sky-300 rounded-full" variants={floatingVariants} animate="animate" style={{ animationDelay: "3s" }} />
      </div>
      {calendarOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 relative shadow-xl">
            <button onClick={() => setCalendarOpen(false)} className="absolute top-3 right-3 rounded-full bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm text-slate-600">✕</button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pick a timeslot</h3>
            <p className="text-sm text-slate-500 mb-4">Timezone: HKT (UTC+8). You can also book directly via Google Calendar.</p>
            <div className="space-y-2 mb-4">
              {['Wed 8:00–8:30 PM','Sat 10:00–10:30 AM','Mon 7:30–8:00 PM'].map((slot, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <div className="text-slate-900 text-sm">{slot}</div>
                  <a href="https://calendar.app.google/jPexFUzauM39fYfV9" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-indigo-600 text-sm font-semibold">Book</a>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <a href="https://calendar.app.google/jPexFUzauM39fYfV9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold">Open Google Calendar</a>
              <button onClick={() => setCalendarOpen(false)} className="text-sm text-slate-500 hover:text-slate-900">Maybe later</button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-sky-600 to-indigo-600" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            Contact Me
          </motion.h1>
          <motion.p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            I&apos;d love to discuss potential collaborations, project ideas, or anything related to <span className="text-sky-600 font-semibold">Data Science</span> and <span className="text-indigo-600 font-semibold">AI</span>.
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-4 mb-12" variants={containerVariants} initial="hidden" animate="visible">
            {quickInfo.map((info, index) => (
              <motion.div key={index} variants={itemVariants} className="flex items-center space-x-3 px-6 py-3 bg-white shadow-sm backdrop-blur-lg rounded-full border border-slate-200">
                <div className="text-sky-500">{info.icon}</div>
                <div>
                  <span className="text-slate-500 text-sm">{info.label}:</span>
                  <span className="text-slate-900 font-medium ml-2">{info.value}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <motion.h2 className="text-3xl font-bold text-slate-900 mb-8" variants={itemVariants}>Contact Methods</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactInfo.map((item, index) => {
                const base = "group block relative overflow-hidden bg-white backdrop-blur-xl rounded-2xl p-6 border border-slate-200 transition-all duration-500 hover:border-sky-300 hover:shadow-lg";
                const inner = (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    <div className="relative flex items-center space-x-6">
                      <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors duration-300">{item.label}</h3>
                        <p className="text-slate-600 font-medium mt-1 group-hover:text-slate-900 transition-colors duration-300">{item.value}</p>
                        <p className="text-sm text-slate-400 mt-1 group-hover:text-slate-500 transition-colors duration-300">{item.description}</p>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition-all duration-300">
                        <span className="text-sky-600 text-sm">→</span>
                      </div>
                    </div>
                  </>
                );
                return (
                  <motion.div key={index} variants={itemVariants} whileHover={{ y: -3 }}>
                    {item.type === 'calendar' ? (
                      <button type="button" onClick={() => setCalendarOpen(true)} className={base}>
                        {inner}
                      </button>
                    ) : (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className={base}>
                        {inner}
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <motion.div variants={itemVariants} className="relative overflow-hidden bg-white backdrop-blur-xl rounded-2xl p-6 border border-indigo-200 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-sky-50"></div>
              <div className="relative">
                <h3 className="text-lg font-bold text-indigo-600 mb-2">Response Commitment</h3>
                <p className="text-slate-500 text-sm leading-relaxed">I commit to replying within 24–48 hours. For urgent matters, please email directly and include &ldquo;URGENT&rdquo; in the subject.</p>
              </div>
            </motion.div>
          </motion.div>

          {false && (
          <motion.div className="relative" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="relative overflow-hidden bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
              <div className="text-center mb-8">
                <motion.div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl mb-4" whileHover={{ rotate: 5, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <FaPaperPlane className="text-white text-xl" />
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Send a Message</h2>
                <p className="text-slate-500 text-sm">Fill the form to open your email app with content prefilled</p>
              </div>

              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700">Name <span className="text-red-400">*</span></label>
                    <motion.input type="text" id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-slate-900 placeholder-slate-400" whileFocus={{ scale: 1.02 }} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email <span className="text-red-400">*</span></label>
                    <motion.input type="email" id="email" placeholder="Your email (sender)" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-slate-900 placeholder-slate-400" whileFocus={{ scale: 1.02 }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-700">Subject</label>
                  <motion.input type="text" id="subject" placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-slate-900 placeholder-slate-400" whileFocus={{ scale: 1.02 }} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700">Message</label>
                  <motion.textarea id="message" placeholder="Write your message here" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 text-slate-900 placeholder-slate-400" whileFocus={{ scale: 1.01 }} />
                </div>
                <motion.button type="submit" disabled={sending} className="w-full py-4 px-6 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 disabled:opacity-60 disabled:cursor-not-allowed" whileHover={{ scale: sending ? 1 : 1.02 }} whileTap={{ scale: sending ? 1 : 0.98 }}>
                  <span>{sending ? 'Sending…' : 'Send via your mail app'}</span>
                </motion.button>
                <div className="text-center text-xs text-slate-400 mt-2 space-x-3">
                  <button type="button" onClick={openWithGmail} className="underline hover:text-slate-900">Use Gmail (force)</button>
                  <span>·</span>
                  <button type="button" onClick={openWithOutlookWeb} className="underline hover:text-slate-900">Use Outlook Web</button>
                </div>
                {feedback && (
                  <div aria-live="assertive" className="text-sm mt-2 p-3 rounded-lg border border-red-300 bg-red-50 text-red-600">{feedback}</div>
                )}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-center text-sm text-slate-500">Submitting opens your email app; you still need to review and press send.</p>
                </div>
              </form>

              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-100 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
          )}
        </div>

        <motion.div className="text-center mt-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Ready to collaborate?</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">Whether it&apos;s AI development, career consulting, or any data challenge, I&apos;m happy to discuss and provide professional advice.</p>
            <motion.div className="inline-flex items-center space-x-2 px-8 py-3 bg-sky-50 border border-sky-200 rounded-full text-sky-600" animate={{ boxShadow: ["0 0 20px rgba(14, 165, 233, 0.0)", "0 0 20px rgba(14, 165, 233, 0.15)", "0 0 20px rgba(14, 165, 233, 0.0)"] }} transition={{ duration: 3, repeat: Infinity }}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="font-medium">Online and ready to reply</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPageEn;
