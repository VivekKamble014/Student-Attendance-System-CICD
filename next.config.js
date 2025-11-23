/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only expose public environment variables to the client
  // Server-side variables (DATABASE_URL, JWT_SECRET) are accessed via process.env in API routes
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig

