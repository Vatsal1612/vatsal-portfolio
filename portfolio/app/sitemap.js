const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://vatsalchhatbar.dev';

export default function sitemap() {
  const now = new Date();
  const routes = ['', '#about', '#skills', '#experience', '#projects', '#achievements', '#certifications', '#blog', '#contact'];
  return routes.map((r) => ({
    url: `${SITE_URL}/${r}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: r === '' ? 1 : 0.7,
  }));
}
