'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinksZh = [
  { name: '首頁', href: '/' },
  { name: '個人經歷', href: '/about' },
  { name: '個人專案', href: '/projects' },
  { name: '文章', href: '/articles' },
  { name: '聯絡我', href: '/contact' },
];

const navLinksEn = [
  { name: 'Home', href: '/' },
  { name: 'Experience', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Articles', href: '/articles' },
  { name: 'Contact', href: '/contact' },
];

const normalize = (p) => (p === '/' ? '/' : p.replace(/\/$/, ''));

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const locale = useMemo(() => (pathname?.startsWith('/en') ? 'en' : 'zh'), [pathname]);
  const hrefPrefix = locale === 'zh' ? '' : '/en';
  const links = locale === 'en' ? navLinksEn : navLinksZh;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchTo = useCallback((lang) => {
    if (!pathname) return;
    const base = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
    const target = lang === 'zh' ? (base === '' ? '/' : base) : `/${lang}${base === '/' ? '' : base}`;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-lang', lang);
        document.cookie = `preferred-lang=${lang}; path=/; max-age=31536000; samesite=lax`;
      }
    } catch {}
    setIsOpen(false);
    router.push(target);
  }, [pathname, router]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Bar */}
      <div
        className="transition-all duration-500"
        style={{
          background: '#0a0a0a',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(255,255,255,0.04)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-8 h-14 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href={hrefPrefix || '/'} className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              className="relative w-7 h-7 rounded-[10px] flex items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)' }}
              whileHover={{ scale: 1.08, rotate: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <span className="relative z-10 text-white text-[11px] font-black tracking-tight select-none">ML</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            </motion.div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors duration-200">Morris</span>
              <span className="hidden sm:block text-sm font-light text-white/20 group-hover:text-white/40 transition-colors duration-200">Liu</span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-stretch h-14">
            {links.map((link, i) => {
              const linkHref = normalize(`${hrefPrefix}${link.href}`.replace('//', '/'));
              const isActive = normalize(pathname || '') === linkHref;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex items-center"
                >
                  <Link
                    href={linkHref}
                    className={`relative flex items-center px-4 h-full text-sm font-medium transition-colors duration-150 ${
                      isActive ? 'text-white' : 'text-white/35 hover:text-white/80'
                    }`}
                  >
                    {/* Hover bg */}
                    <span className="absolute inset-x-1 inset-y-2 rounded-lg bg-white/0 hover:bg-white/[0.05] transition-colors duration-150 pointer-events-none" />

                    <span className="relative z-10">{link.name}</span>

                    {/* Active: bottom glow bar */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-glow"
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                          boxShadow: '0 0 8px rgba(56,189,248,0.7)',
                        }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-1 shrink-0">

            {/* Language toggle */}
            <div className="flex items-center text-[11px] font-semibold tracking-wide">
              <button
                onClick={() => switchTo('zh')}
                className={`px-2.5 py-1.5 rounded-md transition-colors duration-150 ${
                  locale === 'zh' ? 'text-white' : 'text-white/25 hover:text-white/60'
                }`}
              >
                繁中
              </button>
              <span className="text-white/10 select-none">·</span>
              <button
                onClick={() => switchTo('en')}
                className={`px-2.5 py-1.5 rounded-md transition-colors duration-150 ${
                  locale === 'en' ? 'text-white' : 'text-white/25 hover:text-white/60'
                }`}
              >
                EN
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(v => !v)}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-white/[0.06] transition-colors ml-1"
              aria-label="Toggle menu"
            >
              <motion.span
                className="block rounded-full bg-white/60"
                style={{ width: '16px', height: '1.5px' }}
                animate={isOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.22 }}
              />
              <motion.span
                className="block rounded-full bg-white/60"
                style={{ width: '16px', height: '1.5px' }}
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.22 }}
              />
              <motion.span
                className="block rounded-full bg-white/60"
                style={{ width: '16px', height: '1.5px' }}
                animate={isOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.22 }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden mx-4 sm:mx-6 mt-1 rounded-2xl border border-white/[0.08] overflow-hidden"
            style={{ background: '#0d0d0d', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}
          >
            <div className="p-2 flex flex-col gap-0.5">
              {links.map((link) => {
                const linkHref = normalize(`${hrefPrefix}${link.href}`.replace('//', '/'));
                const isActive = normalize(pathname || '') === linkHref;
                return (
                  <Link
                    key={link.href}
                    href={linkHref}
                    onClick={() => setIsOpen(false)}
                    className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-white/40 hover:text-white/75'
                    }`}
                  >
                    {isActive && (
                      <>
                        <span className="absolute inset-0 rounded-xl bg-white/[0.06] pointer-events-none" />
                        <span
                          className="absolute left-0 inset-y-2 w-[2px] rounded-full"
                          style={{ background: 'linear-gradient(180deg, #38bdf8, #818cf8)', boxShadow: '0 0 6px rgba(56,189,248,0.6)' }}
                        />
                      </>
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}

              <div className="mt-1 pt-2 border-t border-white/[0.06] flex gap-1 px-1">
                <button
                  onClick={() => switchTo('zh')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    locale === 'zh' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  繁中
                </button>
                <button
                  onClick={() => switchTo('en')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    locale === 'en' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
