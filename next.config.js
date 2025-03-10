/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.fallback = {
      fs: false,
      buffer: require.resolve('buffer'),
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify')
    };
    return config;
  },
  reactStrictMode: true,
};

module.exports = nextConfig; 