/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  // Serve Work's verified standalone HTML without rebuilding its React/animation code.
  async rewrites() {
    return [
      { source: '/first-shift', destination: '/first-shift/index.html' }
    ];
  }
}

module.exports = nextConfig
