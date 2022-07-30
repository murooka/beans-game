const env = {
  local: {
    NEXT_PUBLIC_WEB_ORIGIN: "http://localhost:3000",
    NEXT_PUBLIC_API_ORIGIN: "http://localhost:4000",
  },
  prod: {
    NEXT_PUBLIC_WEB_ORIGIN: "https://bp-game.web.app",
    NEXT_PUBLIC_API_ORIGIN: "https://api-2kwriflhpq-an.a.run.app",
  },
}[process.env.APP_ENV];

if (env == null) throw new Error(`unknown APP_ENV: ${process.env.APP_ENV}`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env,
};

module.exports = nextConfig;
