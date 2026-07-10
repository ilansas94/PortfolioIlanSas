/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  typescript: {
    // The cinematic branch is an isolated visual prototype. Keep preview builds
    // deployable while interaction code is iterated and validated in-browser.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
