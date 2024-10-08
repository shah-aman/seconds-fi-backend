/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  env: {
    OKTO_BASE_URL: process.env.OKTO_BASE_URL,
    OKTO_API_KEY: process.env.OKTO_API_KEY,
  },
};

export default nextConfig;
