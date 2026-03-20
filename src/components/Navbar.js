'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinksZh = [
  { name: '首頁', href: '/' },
  { name: '個人專案', href: '/projects' },
  { name: '文章', href: '/articles' },
  { name: '聯絡我', href: '/contact' },
];

const navLinksEn = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Articles', href: '/articles' },
  { name: 'Contact', href: '/contact' },
];

const normalize = (p) => (p === '/' ? '/' : p.replace(/\/$/, ''));

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const locale = useMemo(() => (pathname?.startsWith('/en') ? 'en' : 'zh'), [pathname]);
  const hrefPrefix = locale === 'zh' ? '' : '/en';
  const links = locale === 'en' ? navLinksEn : navLinksZh;

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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glass bar */}
      <div className="mx-4 mt-3 sm:mx-6 lg:mx-8">
        <div className="max-w-5xl mx-auto rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-sm shadow-slate-200/50 px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href={hrefPrefix || '/'} className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
              Morris
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const linkHref = normalize(`${hrefPrefix}${link.href}`.replace('//', '/'));
              const isActive = normalize(pathname || '') === linkHref;
              return (
                <Link
                  key={link.href}
                  href={linkHref}
                  className={`relative px-3.5 py-1.5 text-sm font-medium rounded-xl transition-colors duration-150 ${
                    isActive
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-slate-100"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: lang toggle + mobile button */}
          <div className="flex items-center gap-2">
            {/* Inline language toggle */}
            <div className="flex items-center rounded-lg border border-slate-200/80 bg-slate-50/80 p-0.5 text-xs font-semibold">
              <button
                onClick={() => switchTo('zh')}
                className={`px-2.5 py-1 rounded-md transition-colors duration-150 ${
                  locale === 'zh'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                繁中
              </button>
              <button
                onClick={() => switchTo('en')}
                className={`px-2.5 py-1 rounded-md transition-colors duration-150 ${
                  locale === 'en'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                EN
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(v => !v)}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100/80 transition-colors"
              aria-label="Toggle menu"
            >
              <motion.span
                className="w-4.5 h-px bg-slate-600 rounded-full block"
                style={{ width: '18px' }}
                animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="h-px bg-slate-600 rounded-full block"
                style={{ width: '18px' }}
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="h-px bg-slate-600 rounded-full block"
                style={{ width: '18px' }}
                animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden mt-2 max-w-5xl mx-auto rounded-2xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 overflow-hidden"
            >
              <div className="p-3 flex flex-col gap-1">
                {links.map((link) => {
                  const linkHref = normalize(`${hrefPrefix}${link.href}`.replace('//', '/'));
                  const isActive = normalize(pathname || '') === linkHref;
                  return (
                    <Link
                      key={link.href}
                      href={linkHref}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
