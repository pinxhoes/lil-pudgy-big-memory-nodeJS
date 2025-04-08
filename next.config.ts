import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      // 🧠 Cache static assets aggressively
      {
        source: '/(fonts|images|_next/static|favicon\\.ico|.*\\.css|.*\\.js)', // static files
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 🧠 Cache dynamic pages minimally
      {
        source: '/(.*)', // everything else
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; frame-src https://*.privy.io; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig