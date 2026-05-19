/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Security Headers ──────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Clickjacking хамгаалалт
          { key: "X-Frame-Options", value: "DENY" },
          // MIME sniffing хамгаалалт
          { key: "X-Content-Type-Options", value: "nosniff" },
          // XSS хамгаалалт
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Referrer policy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions policy
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          // HSTS (production-д л идэвхтэй)
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
        ],
      },
    ];
  },

  // ── Production optimizations ──────────────────────────────
  poweredByHeader: false, // "X-Powered-By: Next.js" header-г нуух

  // ── Image optimization ────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // ── Compression ───────────────────────────────────────────
  compress: true,
};

module.exports = nextConfig;
