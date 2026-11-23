import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getNewsArticleBySlug,
  getRelatedNewsArticles,
  getAllProducts,
} from "@/lib/db/queries";
import { ArticleClient } from "./ArticleClient";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsArticleBySlug(slug);

  if (!article) {
    return {
      title: "Story Not Found",
    };
  }

  return {
    title: `${article.title} | ${SITE_NAME} Gazette`,
    description: article.subtitle || article.title,
    openGraph: {
      title: article.title,
      description: article.subtitle || article.title,
      url: `${SITE_URL}/news/${article.slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: article.heroImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: new Date(article.publishedAt).toISOString(),
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.subtitle || article.title,
      images: [article.heroImage],
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedNewsArticles(article.slug, article.category, 3);
  const allProducts = getAllProducts();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.subtitle,
    image: [article.heroImage],
    datePublished: new Date(article.publishedAt).toISOString(),
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: `${SITE_NAME} Atelier Milano`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <ArticleClient
        article={article}
        relatedArticles={relatedArticles}
        curatedProducts={allProducts}
      />
    </>
  );
}
