/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb'
    },
    responseLimit: '100mb'
  },
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com']
  },
  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["tr"],
    defaultLocale: "tr",
    
  },
};

export default config;
