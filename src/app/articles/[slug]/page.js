import Link from 'next/link';
import { getArticle } from '@/lib/content';
import { markdownToHtml } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default async function ArticlePage({ params }) {
  const { slug } = params;
  const data = await getArticle(slug, 'zh');
  const { meta, content } = data;
  const { html, toc } = markdownToHtml(content);
  return (
    <div className="relative min-h-screen text-slate-800 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 max-w-6xl">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-sky-600 to-indigo-600">{meta.title}</h1>
          <div className="text-sm text-slate-500 mb-6">{meta.date} · {meta.readingTime}</div>
          <article className="leading-relaxed text-slate-600 space-y-4">
            <MarkdownRenderer html={html} />
          </article>
          <div className="mt-8">
            <Link href="/articles" className="text-sky-500 hover:text-indigo-500 font-semibold">← 回到文章列表</Link>
          </div>
        </div>
        <aside className="hidden lg:block sticky top-28 h-max bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-slate-800 mb-2">目錄</div>
          <nav className="space-y-1">
            {toc.map((h) => {
              const indent = Math.max(0, h.level - 2) * 12; // px
              return (
                <a key={h.id} href={`#${h.id}`} className="block text-slate-600 hover:text-slate-900 transition-colors" style={{ paddingLeft: `${indent}px` }}>{h.text}</a>
              );
            })}
          </nav>
        </aside>
      </div>
    </div>
  );
}
