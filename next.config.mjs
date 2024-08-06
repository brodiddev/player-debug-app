/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // 클라이언트 사이드 번들에 대해 Fast Refresh 활성화
    if (!isServer) {
      config.optimization.runtimeChunk = "single";
    }
    return config;
  },
};
export default nextConfig;
