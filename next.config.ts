import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preview Arena (sandbox e2b) — autorise l'origine de dev proxifiée (HMR).
  allowedDevOrigins: ["3000-i6q368vxoo2n3cwmm032m.e2b.app"],
};

export default nextConfig;
