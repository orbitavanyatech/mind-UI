import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mind Elevate — Mental Performance Platform",
    short_name: "Mind Elevate",
    description: "The mental performance platform for modern organizations.",
    theme_color: "#14132E",
    background_color: "#F8F7F5",
    display: "standalone",
    start_url: "/",
    scope: "/",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
