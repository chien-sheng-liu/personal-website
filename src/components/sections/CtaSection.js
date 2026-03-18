"use client";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import AnimatedGradientBg from "@/components/AnimatedGradientBg";
import ScrollReveal from "@/components/ScrollReveal";
import Card3D from "@/components/Card3D";

/**
 * Shared CTA section — frosted glass card with gradient button.
 *
 * Props:
 * - title: string
 * - description: string
 * - buttonLabel: string
 * - buttonHref: string
 */
export default function CtaSection({ title, description, buttonLabel, buttonHref }) {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <AnimatedGradientBg variant="bottom" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <ScrollReveal>
          <Card3D intensity={4}>
            <div className="glass-panel rounded-3xl border border-white/40 shadow-lg px-8 py-8 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] mb-3">
                {title}
              </h3>
              <p className="text-slate-500 mb-8">{description}</p>
              <Link
                href={buttonHref}
                className="group inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200/40 hover:shadow-xl hover:shadow-indigo-300/40 transition-all duration-300"
              >
                {buttonLabel}
                <FaArrowRight className="ml-2 text-sm transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Card3D>
        </ScrollReveal>
      </div>
    </section>
  );
}
