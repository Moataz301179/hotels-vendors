/** @type {import('next').NextConfig} */

// Security headers for production-grade protection
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://maps.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://*.vercel.app https://*.upstash.io",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), payment=(self), usb=()',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

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

  // Add security headers for all routes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  // Redirects for legacy URLs
  async redirects() {
    return [
      {
        source: '/old-login',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
