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
    const onScroll = () => setScrolled(window.scrollY > 40);
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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Backdrop — only on scroll */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}
      />

      <div className="relative flex items-center justify-between px-6 sm:px-10 lg:px-16 h-16">

        {/* Logo */}
        <Link href={hrefPrefix || '/'} className="flex items-center gap-2.5 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #6366f1)' }}
          >
            <span className="text-white text-[10px] font-black select-none">ML</span>
          </div>
          <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
            Morris Liu
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link, i) => {
            const linkHref = normalize(`${hrefPrefix}${link.href}`.replace('//', '/'));
            const isActive = normalize(pathname || '') === linkHref;
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  href={linkHref}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-white/55 hover:text-white/90'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-sky-400"
                      style={{ boxShadow: '0 0 6px rgba(56,189,248,0.8)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}

          {/* Lang */}
          <div className="flex items-center gap-1 text-sm font-medium ml-2">
            <button
              onClick={() => switchTo('zh')}
              className={`transition-colors ${locale === 'zh' ? 'text-white' : 'text-white/35 hover:text-white/70'}`}
            >
              繁中
            </button>
            <span className="text-white/20">·</span>
            <button
              onClick={() => switchTo('en')}
              className={`transition-colors ${locale === 'en' ? 'text-white' : 'text-white/35 hover:text-white/70'}`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(v => !v)}
          className="md:hidden flex flex-col items-center justify-center gap-1.5 w-8 h-8"
          aria-label="Toggle menu"
        >
          <motion.span className="block h-px w-5 bg-white/70 rounded-full"
            animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} />
          <motion.span className="block h-px w-5 bg-white/70 rounded-full"
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }} />
          <motion.span className="block h-px w-5 bg-white/70 rounded-full"
            animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.2 }} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mx-4 rounded-xl border border-white/[0.08] overflow-hidden"
            style={{ background: 'rgba(12,12,12,0.96)', backdropFilter: 'blur(20px)' }}
          >
            <div className="p-2 flex flex-col">
              {links.map((link) => {
                const linkHref = normalize(`${hrefPrefix}${link.href}`.replace('//', '/'));
                const isActive = normalize(pathname || '') === linkHref;
                return (
                  <Link
                    key={link.href}
                    href={linkHref}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'text-white bg-white/[0.06]' : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="mt-1 pt-2 border-t border-white/[0.06] flex gap-1 px-2 pb-1">
                <button onClick={() => switchTo('zh')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${locale === 'zh' ? 'text-white bg-white/[0.07]' : 'text-white/35 hover:text-white/60'}`}>
                  繁中
                </button>
                <button onClick={() => switchTo('en')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${locale === 'en' ? 'text-white bg-white/[0.07]' : 'text-white/35 hover:text-white/60'}`}>
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
