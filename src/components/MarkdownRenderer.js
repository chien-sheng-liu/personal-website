"use client";

import { useEffect, useRef, useState } from 'react';

export default function MarkdownRenderer({ html }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, [html]);

  useEffect(() => {
    let cancelled = false;
    async function highlight() {
      try {
        // Load shiki from CDN on client. Works in browser; ignored by bundler.
        const shiki = await import(/* webpackIgnore: true */ 'https://esm.sh/shiki@1.20.0');
        const highlighter = await shiki.getHighlighter({ themes: ['github-dark'], langs: ['javascript','typescript','python','bash','json','markdown'] });
        const root = ref.current;
        if (!root) return;
        const blocks = root.querySelectorAll('pre > code');
        blocks.forEach((codeEl) => {
          const pre = codeEl.parentElement;
          const lang = (codeEl.className || '').replace(/.*language-([\w+-]+).*/, '$1') || pre.getAttribute('data-lang') || 'text';
          const raw = codeEl.textContent || '';
          const html = highlighter.codeToHtml(raw, { lang, theme: 'github-dark' });
          // Replace <pre> block with shiki HTML
          const wrapper = document.createElement('div');
          wrapper.innerHTML = html;
          const newPre = wrapper.querySelector('pre');
          if (newPre && pre.parentNode) pre.parentNode.replaceChild(newPre, pre);
        });
      } catch (e) {
        // Graceful fallback: no syntax highlighting
      }
    }
    if (ready && typeof window !== 'undefined') highlight();
    return () => { cancelled = true; };
  }, [ready, html]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

