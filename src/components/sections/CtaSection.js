"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

/**
 * Shared CTA section — minimal, elegant bottom call-to-action.
 *
 * Props:
 * - title: string
 * - description: string
 * - buttonLabel: string
 * - buttonHref: string
 */
export default function CtaSection({ title, description, buttonLabel, buttonHref }) {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Subtle top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm text-white/40 mb-4"
        >
          {description}
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-8"
        >
          <span className="bg-gradient-to-r from-violet-500 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </span>
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={buttonHref}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#1d1d1f] px-7 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-slate-800 transition-all duration-300"
          >
            {buttonLabel}
            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
