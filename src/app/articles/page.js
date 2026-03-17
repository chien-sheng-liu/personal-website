import Link from 'next/link';
import { FaBookOpen, FaArrowRight } from 'react-icons/fa';
import { listArticles } from '@/lib/content';

export default async function ArticlesPage() {
  const posts = await listArticles('zh');
  return (
    <div className="relative min-h-screen text-slate-800 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.05),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.04),transparent_50%)]"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-sky-600 to-indigo-600">文章</h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">記錄我對 AI、資料工程與產品落地的思考與實作。</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.slug} className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm transition-all duration-300 hover:border-sky-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center space-x-2 text-sky-500"><FaBookOpen /><span className="text-xs uppercase tracking-wide">Article</span></div>
                  <div className="text-xs text-slate-500">{post.date} · {post.readingTime}</div>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors duration-300">{post.title}</h2>
                <p className="text-slate-500 mb-4 leading-relaxed group-hover:text-slate-600 transition-colors duration-300">{post.summary}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((t) => (<span key={t} className="px-2 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-[10px] font-medium text-sky-500">{t}</span>))}
                </div>
                <Link href={`/articles/${post.slug}`} className="inline-flex items-center text-sky-500 font-semibold group-hover:text-indigo-500 transition-colors duration-300">閱讀全文 <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-300" /></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
