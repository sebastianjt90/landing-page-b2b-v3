import type { NextConfig } from "next";

const csp = [
  "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:",
  // Scripts - including Meta/Facebook, Google, HubSpot, LinkedIn, PostHog
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://tagassistant.google.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://js.hs-scripts.com https://js.hsforms.net https://js.hscollectedforms.net https://js.usemessages.com https://js.hsleadflows.net https://js.hs-banner.com https://js.hs-analytics.net https://js.hsadspixel.net https://js.hubspot.com https://snap.licdn.com https://connect.facebook.net https://us-assets.i.posthog.com https://app.posthog.com https://cdn.posthog.com",
  // Connections - including Meta/Facebook APIs, PostHog
  "connect-src 'self' https: wss: ws: https://www.facebook.com https://connect.facebook.net https://graph.facebook.com https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://us.i.posthog.com https://app.posthog.com",
  // Images - including Meta/Facebook pixels, PostHog
  "img-src 'self' data: https: blob: https://www.facebook.com https://connect.facebook.net https://www.google-analytics.com https://www.googletagmanager.com https://us-assets.i.posthog.com https://app.posthog.com",
  // Frames - including Meta/Facebook widgets and PandaVideo
  "frame-src 'self' https://www.facebook.com https://www.googletagmanager.com https://tagassistant.google.com https://player-vz-711edda5-617.tv.pandavideo.com https://player.pandavideo.com.br https://meetings.hubspot.com https://meetings-eu1.hubspot.com https://*.hsforms.com https://*.hubspot.com",
  // Child sources
  "child-src 'self' https://www.googletagmanager.com https://tagassistant.google.com https://player-vz-711edda5-617.tv.pandavideo.com https://player.pandavideo.com.br",
  // Styles
  "style-src 'self' 'unsafe-inline' https:",
  // Media
  "media-src 'self' https: blob:",
  // Fonts
  "font-src 'self' data: https:",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Content-Security-Policy",
            value: csp
          }
        ],
      },
      {
        source: "/assets/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  },
};

export default nextConfig;