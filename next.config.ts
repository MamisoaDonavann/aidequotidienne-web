/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false, // ← Désactive Turbopack, revient à Webpack
  },
}

module.exports = nextConfig