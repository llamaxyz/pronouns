/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { images: { allowFutureImage: true } },
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx'],
}

module.exports = nextConfig
