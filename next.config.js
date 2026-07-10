/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryBase = "/PortfolioIlanSas";

const nextConfig = {
  output: isGitHubPages ? "export" : undefined,
  trailingSlash: isGitHubPages,
  basePath: isGitHubPages ? repositoryBase : "",
  assetPrefix: isGitHubPages ? `${repositoryBase}/` : "",
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
