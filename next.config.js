/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack(config, options) {
    const { isServer } = options;
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve("file-loader"),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? "../" : ""}static/images/`,
            name: "[name]-[hash].[ext]",
            esModule: config.esModule || false,
          },
        },
      ],
    });

    return config;
  },
  experimental: {
    //largePageDataBytes: 128 * 1000, // 128KB by default
    largePageDataBytes: 200 * 1000,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

module.exports = nextConfig;
