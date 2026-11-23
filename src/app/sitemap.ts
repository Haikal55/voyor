import type { MetadataRoute } from "next";
import { getAllCategories, getAllProducts } from "@/lib/db/queries";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getAllCategories();
  const products = getAllProducts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/book-appointment`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${SITE_URL}/product/${prod.slug}`,
    lastModified: new Date(prod.createdAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
