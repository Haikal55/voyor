import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VOYOR Milano — Italian Haute Couture",
    short_name: "VOYOR",
    description:
      "Official VOYOR Milano Online Boutique. Discover the Fall/Winter 2026 Runway collection, iconic Barocco silk shirts, atelier evening gowns, and sovereign leather bags.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
