import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static site: `next build` writes plain HTML/CSS/JS to out/.
  // No server, no functions, nothing to patch at runtime.
  output: "export",
  // The Next image optimizer needs a server; images are pre-optimized instead.
  images: { unoptimized: true },
};

export default withAnalyzer(nextConfig);
