/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow remote dev access from the VPS IP (or any other host you use)
  allowedDevOrigins: ['187.77.181.3'],

  // Custom webpack alias – needed for our sandbox UI components.
  // This works because we disable Turbopack (see experimental below).
  webpack: (config) => {
    config.resolve.alias['~'] = __dirname;
    return config;
  },

  // Allow external images (e.g., Unsplash) used in marketing pages.
  images: {
    domains: ['images.unsplash.com'],
  },

  // Disable Turbopack to allow the custom webpack config above.
  // An empty `turbopack` key silences the warning, and we set
  // `experimental.turbopack` to `false` so Next.js falls back to Webpack.
  experimental: {
    turbopack: false,
  },

  // Keep the existing production output mode.
  output: 'standalone',
};

module.exports = nextConfig;
