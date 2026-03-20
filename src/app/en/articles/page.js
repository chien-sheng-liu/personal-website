import { listArticles } from '@/lib/content';
import ArticlesPage from '@/components/ArticlesPage';

export default async function ArticlesPageEn() {
  const posts = await listArticles('en');
  return <ArticlesPage posts={posts} locale="en" />;
}
