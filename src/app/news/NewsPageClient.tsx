"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsArticle, Product } from "@/lib/types";
import { ArrowRight, Clock, Bookmark, Share2, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NewsPageClientProps {
  articles: NewsArticle[];
  featuredArticle: NewsArticle | null;
  trendingArticles: NewsArticle[];
  products: Product[];
}

const CATEGORIES = [
  "All Stories",
  "Runway Couture",
  "Celebrity Style",
  "The Edit & Trends",
  "Culture & Arts",
  "Photovogue",
];

export function NewsPageClient({
  articles,
  featuredArticle,
  trendingArticles,
  products,
}: NewsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Stories");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const filteredArticles = selectedCategory === "All Stories"
    ? articles
    : articles.filter(
        (a) => a.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  // Exclude featured and trending from secondary grids when viewing All Stories
  const gridArticles = selectedCategory === "All Stories"
    ? articles.filter((a) => a.id !== featuredArticle?.id)
    : filteredArticles;

  const runwayReportArticles = gridArticles.slice(0, 3);
  const cultureAndArtsArticles = gridArticles.slice(3, 7);
  const remainingArticles = gridArticles.slice(7);

  const handleShare = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/news/${slug}`);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f4f0] pt-24 sm:pt-28 pb-24">
      {/* Editorial Top Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="border-b border-[#222] pb-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] uppercase tracking-luxury text-neutral-400 border-b border-[#1c1c1c] pb-3 mb-6 gap-2">
            <div className="flex items-center space-x-3">
              <span className="text-[#a7c080] font-semibold">VOYOR DISPATCH</span>
              <span>•</span>
              <span>MILANO • PARIS • NEW YORK</span>
            </div>
            <div className="text-neutral-500 font-sans">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="text-center py-4">
            <Link href="/news" className="group inline-block">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight uppercase text-white group-hover:text-[#a7c080] transition-colors leading-none">
                The Gazette
              </h1>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#a7c080] font-medium mt-2">
                Haute Couture • Runway Journalism • Style Editorial
              </p>
            </Link>
          </div>

          {/* Vogue-Style Editorial Category Filter Bar */}
          <nav className="flex items-center justify-center overflow-x-auto py-3 border-t border-[#1c1c1c] gap-4 sm:gap-8 scrollbar-none text-[11px] uppercase tracking-wider">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1 relative whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "text-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>{cat}</span>
                {selectedCategory === cat && (
                  <motion.div
                    layoutId="activeCategoryUnderline"
                    className="absolute -bottom-3 left-0 right-0 h-[2px] bg-[#a7c080]"
                  />
                )}
              </button>
            ))}
          </nav>
        </header>

        {/* Lead Cover Story & The Runway Wire Grid */}
        {selectedCategory === "All Stories" && featuredArticle && (
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#1c1c1c]">
              {/* Main Cover Story (7 Columns) */}
              <article className="lg:col-span-7 flex flex-col justify-between group">
                <Link href={`/news/${featuredArticle.slug}`} className="block">
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-transparent mb-6">
                    <Image
                      src={featuredArticle.heroImage}
                      alt={featuredArticle.heroImageAlt || featuredArticle.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1 border border-white/10 text-[9px] uppercase tracking-widest text-[#a7c080] font-bold">
                      Cover Story
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#a7c080]">
                      <span>{featuredArticle.category}</span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-neutral-400 font-normal">{featuredArticle.readingTime}</span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white group-hover:text-[#a7c080] transition-colors leading-[1.12] tracking-tight">
                      {featuredArticle.title}
                    </h2>

                    {featuredArticle.subtitle && (
                      <p className="font-serif text-neutral-300 text-sm sm:text-base italic leading-relaxed line-clamp-3">
                        {featuredArticle.subtitle}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-[#1c1c1c] text-[11px] text-neutral-400">
                      <div>
                        <span className="uppercase tracking-wider font-medium text-neutral-200">
                          By {featuredArticle.author}
                        </span>
                        <span className="text-neutral-600 mx-2">—</span>
                        <span className="text-neutral-500">{formatDate(featuredArticle.publishedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#a7c080] group-hover:translate-x-1 transition-transform">
                        <span className="text-[10px] uppercase tracking-wider font-semibold">Read Story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>

              {/* The Runway Wire / Sidebar (5 Columns) */}
              <aside className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#1c1c1c] lg:pl-10 pt-8 lg:pt-0">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#222]">
                    <span className="text-xs uppercase tracking-luxury font-bold text-white flex items-center gap-2">
                      The Runway Wire
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                      Developing
                    </span>
                  </div>

                  <div className="divide-y divide-[#1c1c1c] space-y-5">
                    {trendingArticles.map((art, idx) => (
                      <article key={art.id} className={`${idx > 0 ? "pt-5" : ""} group`}>
                        <Link href={`/news/${art.slug}`} className="grid grid-cols-12 gap-4 items-start">
                          <div className="col-span-8 space-y-1.5">
                            <span className="text-[9.5px] uppercase tracking-[0.18em] font-semibold text-[#a7c080] block">
                              {art.category}
                            </span>
                            <h3 className="font-serif text-base sm:text-lg font-normal text-white group-hover:text-[#a7c080] transition-colors leading-snug line-clamp-2">
                              {art.title}
                            </h3>
                            <div className="text-[10px] text-neutral-500 flex items-center space-x-2">
                              <span>By {art.author.split(",")[0]}</span>
                              <span>•</span>
                              <span>{art.readingTime}</span>
                            </div>
                          </div>
                          <div className="col-span-4 relative aspect-[4/3] bg-transparent overflow-hidden">
                            <Image
                              src={art.heroImage}
                              alt={art.heroImageAlt || art.title}
                              fill
                              sizes="(max-width: 1024px) 30vw, 15vw"
                              className="object-cover"
                            />
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Atelier Quote Callout */}
                <div className="mt-8 pt-6 border-t border-[#1c1c1c] relative">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#a7c080] font-bold block mb-2">
                    Milano Atelier Note
                  </span>
                  <blockquote className="font-serif italic text-sm text-neutral-300 leading-relaxed mb-3">
                    &ldquo;Fashion is not merely what we put on; it is the physical architecture of our personal courage and beauty.&rdquo;
                  </blockquote>
                  <cite className="text-[10px] uppercase tracking-wider text-neutral-500 not-italic block">
                    — VOYOR Creative Atelier, Via Montenapoleone
                  </cite>
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* The Runway Report Spread (3-Column Magazine Layout) */}
        {runwayReportArticles.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between pb-3 mb-8 border-b border-[#222]">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal uppercase tracking-tight">
                  The Runway & Couture Dispatches
                </h2>
                <p className="text-xs text-neutral-400 mt-1 font-light">
                  Direct insights from Milan, Paris, London, and international couture salons.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-luxury text-[#a7c080]">
                Curated by Vogue Archives
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {runwayReportArticles.map((art) => (
                <article key={art.id} className="group flex flex-col justify-between">
                  <Link href={`/news/${art.slug}`} className="block">
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-transparent mb-5">
                      <Image
                        src={art.heroImage}
                        alt={art.heroImageAlt || art.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex items-end justify-between">
                        <span className="text-[9px] uppercase tracking-widest text-[#a7c080] font-bold bg-black/70 px-2 py-0.5">
                          {art.category}
                        </span>
                        <span className="text-[10px] text-neutral-300 font-sans">
                          {art.readingTime}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-xl sm:text-2xl font-normal text-white group-hover:text-[#a7c080] transition-colors leading-tight">
                        {art.title}
                      </h3>
                      {art.subtitle && (
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {art.subtitle}
                        </p>
                      )}
                      <div className="pt-3 border-t border-[#1c1c1c] text-[10px] text-neutral-500 uppercase tracking-wider">
                        By {art.author} • {formatDate(art.publishedAt)}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Photovogue Full-Bleed Editorial Break */}
        <section className="mb-20">
          <div className="relative overflow-hidden border-y border-[#1c1c1c] py-14 sm:py-20">
            <div className="absolute inset-0 opacity-20">
              <Image
                src="https://assets.vogue.com/photos/6b006bf541b02888576c0a96/master/pass/000107%20MAT%2008D%20MRS%20RGB.jpg"
                alt="Photovogue master archive"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#a7c080] font-bold block mb-3">
                Photovogue Retrospective
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight mb-4">
                The Intimacy of Milanese Fashion Photography
              </h2>
              <p className="font-serif italic text-base sm:text-lg text-neutral-300 leading-relaxed mb-6">
                &ldquo;A photograph in fashion is not merely about the garment; it is the frozen moment when emotion, light, and fabric become eternal.&rdquo;
              </p>
              <Link
                href="/category/runway-couture"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-luxury text-[#a7c080] hover:text-white border-b border-[#a7c080] pb-1 font-semibold transition-colors"
              >
                <span>Explore The Runway Creations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Culture, Arts & The Edit Grid (4-Column Layout) */}
        {cultureAndArtsArticles.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between pb-3 mb-8 border-b border-[#222]">
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal uppercase tracking-tight">
                Culture, Living & The Edit
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                Latest Insights
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cultureAndArtsArticles.map((art) => (
                <article key={art.id} className="group flex flex-col justify-between">
                  <Link href={`/news/${art.slug}`} className="block">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-transparent mb-4">
                      <Image
                        src={art.heroImage}
                        alt={art.heroImageAlt || art.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-[#a7c080] font-bold block mb-1.5">
                      {art.category}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg text-white group-hover:text-[#a7c080] transition-colors leading-snug line-clamp-2 mb-2">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                      {art.subtitle}
                    </p>
                  </Link>
                  <div className="pt-3 border-t border-[#1a1a1a] flex items-center justify-between text-[10px] text-neutral-500">
                    <span>{art.readingTime}</span>
                    <button
                      onClick={(e) => handleShare(art.slug, e)}
                      title="Copy story link"
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedSlug === art.slug ? (
                        <span className="text-[#a7c080]">Copied!</span>
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Shop The Editorial Runway Section (Connecting stories to VOYOR products) */}
        {products && products.length > 0 && (
          <section className="mb-20 pt-12 border-t border-[#1c1c1c]">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#a7c080] font-bold">
                Atelier Wardrobe
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal uppercase tracking-tight">
                Shop The Editorial
              </h2>
              <p className="text-xs text-neutral-400 font-light">
                Pieces sculpted in Milan, featured in our seasonal dispatches and runway collections.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {products.slice(0, 4).map((prod) => {
                const primaryImg = prod.images.find((i) => i.isPrimary) || prod.images[0];
                return (
                  <Link
                    key={prod.id}
                    href={`/product/${prod.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-transparent mb-3">
                      {primaryImg && (
                        <Image
                          src={primaryImg.url}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8.5px] uppercase tracking-widest text-[#a7c080] block font-semibold">
                        {prod.origin}
                      </span>
                      <h4 className="font-medium text-xs sm:text-sm text-white group-hover:text-[#a7c080] transition-colors truncate">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-neutral-400 font-mono">
                        ${prod.basePrice.toLocaleString()} USD
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Additional Archive Articles if any */}
        {remainingArticles.length > 0 && (
          <section className="pt-8 border-t border-[#1c1c1c]">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#222]">
              <h3 className="font-serif text-xl sm:text-2xl text-white font-normal uppercase">
                The Archive & Chronicle
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingArticles.map((art) => (
                <article key={art.id} className="group border-b border-[#1c1c1c] pb-6">
                  <Link href={`/news/${art.slug}`} className="block">
                    <span className="text-[9px] uppercase tracking-widest text-[#a7c080] font-bold block mb-1">
                      {art.category}
                    </span>
                    <h4 className="font-serif text-lg text-white group-hover:text-[#a7c080] transition-colors leading-snug mb-2">
                      {art.title}
                    </h4>
                    <p className="text-xs text-neutral-400 line-clamp-2 mb-2 font-light">
                      {art.subtitle}
                    </p>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                      By {art.author} • {formatDate(art.publishedAt)}
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
