import type { NextConfig } from "next";

// Sitio de una sola página: exportación estática (carpeta /out) lista para cualquier hosting.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
