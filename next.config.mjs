/** @type {import('next').NextConfig} */

// GitHub Pages 部署在 https://<user>.github.io/<repo>/ 子路径下。
// 由 GitHub Actions 设置 GITHUB_PAGES=true；本地 dev / build 不受影响。
const isPages = process.env.GITHUB_PAGES === 'true';
const basePath = isPages
  ? (process.env.NEXT_PUBLIC_BASE_PATH ?? '/knowledge-engineering')
  : '';

// 允许用独立目录构建，避免本地残留的 .next 被环境的文件删除代理锁定。
// CI / 默认情况仍使用 .next（Pages 导出使用 .next-pages）。
const distDir = process.env.NEXT_DIST_DIR ?? (isPages ? '.next-pages' : '.next');

const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  output: isPages ? 'export' : undefined,
  basePath,
  distDir,
  trailingSlash: isPages,
  images: { unoptimized: true },
};

export default nextConfig;
