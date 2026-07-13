/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Désactiver explicitement Turbopack pour le build (en plus de la variable d'env)
  experimental: {
    // Laisser vide pour éviter des conflits
  },
}

module.exports = nextConfig