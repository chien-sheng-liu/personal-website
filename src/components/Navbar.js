'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

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

const navLinksYue = [
  { name: '主頁', href: '/' },
  { name: '個人項目', href: '/projects' },
  { name: '文章', href: '/articles' },
  { name: '聯絡我', href: '/contact' },
];

const normalize = (p) => (p === '/' ? '/' : p.replace(/\/$/, ''));

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const locale = useMemo(() => (pathname?.startsWith('/en') ? 'en' : pathname?.startsWith('/yue') ? 'yue' : 'zh'), [pathname]);
  const hrefPrefix = locale === 'zh' ? '' : `/${locale}`;
  const links = locale === 'en' ? navLinksEn : locale === 'yue' ? navLinksYue : navLinksZh;

  const toggleMenu = () => setIsOpen((v) => !v);

  const switchTo = useCallback((lang) => {
    if (!pathname) return;
    const base = pathname.replace(/^\/(en|yue)(?=\/|$)/, '') || '/';
    const target = lang === 'zh' ? (base === '' ? '/' : base) : `/${lang}${base === '/' ? '' : base}`;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-lang', lang);
        document.cookie = `preferred-lang=${lang}; path=/; max-age=31536000; samesite=lax`;
      }
    } catch {}
    setShowLang(false);
    router.push(target);
  }, [pathname, router]);

  const linkVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href={hrefPrefix || '/'} className="text-2xl font-semibold text-slate-900">
              Morris
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1">
              {links.map((link) => {
                const linkHref = normalize(`${hrefPrefix}${link.href}`.replace('//', '/'));
                const isActive = normalize(pathname || '') === linkHref;
                return (
                  <Link
                    key={`${link.name}-${link.href}`}
                    href={linkHref}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLang(v => !v)}
                className="ml-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors bg-white"
                aria-haspopup="true"
                aria-expanded={showLang}
              >
                {locale === 'en' ? 'EN' : locale === 'yue' ? '粵語' : '繁中'}
              </button>
              {showLang && (
                <div className="absolute right-0 mt-2 w-28 rounded-lg border border-slate-200 bg-white shadow-lg p-1">
                  <button onClick={() => switchTo('zh')} className={`w-full text-left px-3 py-2 rounded-md text-xs ${locale==='zh' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>繁中</button>
                  <button onClick={() => switchTo('yue')} className={`w-full text-left px-3 py-2 rounded-md text-xs ${locale==='yue' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>粵語</button>
                  <button onClick={() => switchTo('en')} className={`w-full text-left px-3 py-2 rounded-md text-xs ${locale==='en' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>English</button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowLang(v => !v)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors"
                aria-haspopup="true"
                aria-expanded={showLang}
              >
                {locale === 'en' ? 'EN' : locale === 'yue' ? '粵語' : '繁中'}
              </button>
              {showLang && (
                <div className="absolute right-0 mt-2 w-28 rounded-lg border border-slate-200 bg-white shadow-lg p-1">
                  <button onClick={() => switchTo('zh')} className={`w-full text-left px-3 py-2 rounded-md text-xs ${locale==='zh' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>繁中</button>
                  <button onClick={() => switchTo('yue')} className={`w-full text-left px-3 py-2 rounded-md text-xs ${locale==='yue' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>粵語</button>
                  <button onClick={() => switchTo('en')} className={`w-full text-left px-3 py-2 rounded-md text-xs ${locale==='en' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>English</button>
                </div>
              )}
            </div>
            <button onClick={toggleMenu} className="text-slate-700 focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-white/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            {links.map((link, index) => {
              const linkHref = normalize(`${hrefPrefix}${link.href}`.replace('//', '/'));
              const active = normalize(pathname || '') === linkHref;
              return (
                <motion.div
                  key={`${link.name}-${index}`}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={linkHref} onClick={toggleMenu} className={`block px-3 py-2 rounded-full text-base font-medium border ${active ? 'text-slate-900 bg-slate-100 border-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'}`}>
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
            <div className="flex gap-2 pt-2">
              {[
                { key: 'zh', label: '繁中' },
                { key: 'yue', label: '粵語' },
                { key: 'en', label: 'EN' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => { switchTo(opt.key); toggleMenu(); }}
                  className={`px-3 py-2 rounded-full text-sm font-semibold border border-slate-200 ${locale===opt.key ? 'text-slate-900 bg-slate-100' : 'text-slate-600 hover:text-slate-900 hover:border-slate-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
