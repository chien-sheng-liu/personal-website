/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  output: 'export',
  basePath,
  images: {
    unoptimized: true,
  },
  // In dev (no basePath), redirect /personal-website/* → /* so old bookmarks still work
  async redirects() {
    if (basePath) return [];
    return [
      { source: '/personal-website', destination: '/', permanent: false },
      { source: '/personal-website/:path*', destination: '/:path*', permanent: false },
    ];
  },
};

export default nextConfig;
