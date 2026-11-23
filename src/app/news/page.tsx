import React from "react";
import type { Metadata } from "next";
import {
  getAllNewsArticles,
  getFeaturedNewsArticle,
  getTrendingNewsArticles,
  getAllProducts,
} from "@/lib/db/queries";
import { NewsPageClient } from "./NewsPageClient";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The Gazette — Fashion, Runway & Culture Dispatches",
  description:
    "Explore high-fashion editorial journalism, runway reports, celebrity style, and culture chronicles directly from the VOYOR Milano Atelier and Vogue archives.",
  openGraph: {
    title: `The Gazette | ${SITE_NAME}`,
    description:
      "Vogue-standard runway journalism, haute couture dispatches, and style chronicles from Milan.",
  },
};

export default async function NewsPage() {
  const articles = getAllNewsArticles();
  const featuredArticle = getFeaturedNewsArticle();
  const trendingArticles = getTrendingNewsArticles(4);
  const allProducts = getAllProducts();

  return (
    <NewsPageClient
      articles={articles}
      featuredArticle={featuredArticle}
      trendingArticles={trendingArticles}
      products={allProducts}
    />
  );
}
