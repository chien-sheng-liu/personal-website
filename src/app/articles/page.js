import { listArticles } from '@/lib/content';
import ArticlesPage from '@/components/ArticlesPage';

export default async function ArticlesPageZh() {
  const posts = await listArticles('zh');
  return <ArticlesPage posts={posts} locale="zh" />;
}
