"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsArticle, Product, ArticleBlock } from "@/lib/types";
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  Check,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface ArticleClientProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
  curatedProducts: Product[];
}

export function ArticleClient({
  article,
  relatedArticles,
  curatedProducts,
}: ArticleClientProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Fullscreen / Lightbox state (derived from ProductImageGallery)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const isSpam = (t: string) => {
    const lower = t.toLowerCase();
    return (
      lower.includes("wishlist") ||
      lower.includes("favorite look") ||
      lower.includes("vote now") ||
      lower.includes("condé nast") ||
      lower.includes("conde nast") ||
      lower.includes("see more stories") ||
      lower.includes("affiliate partnerships") ||
      lower.includes("ad choices") ||
      lower.includes("all rights reserved") ||
      lower.includes("cn fashion")
    );
  };

  const rawBlocks: ArticleBlock[] = article.blocks && article.blocks.length > 0
    ? article.blocks
    : article.content
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((text) => ({ type: "paragraph" as const, text }));

  const seenLongParagraphs = new Set<string>();
  const blocks: ArticleBlock[] = [];

  for (let i = 0; i < rawBlocks.length; i++) {
    const b = rawBlocks[i];
    if (b.text) {
      const text = b.text.trim();
      if (isSpam(text)) continue;

      // Skip consecutive exact duplicates
      const prev = blocks[blocks.length - 1];
      if (prev && prev.text && prev.text.trim() === text) continue;

      // Skip duplicate long paragraphs
      if (text.length > 40) {
        if (seenLongParagraphs.has(text)) continue;
        seenLongParagraphs.add(text);
      }
    }
    blocks.push(b);
  }

  // Filter out duplicate images already displayed as heroImage
  const secondaryGallery = (article.galleryImages || []).filter(
    (img) => img.url !== article.heroImage
  );

  // Full collection of all photos in the story for the Lightbox
  const allStoryPhotos = [
    {
      url: article.heroImage,
      alt: article.heroImageAlt || article.title,
      caption: article.heroImageCaption || article.title,
    },
    ...secondaryGallery,
  ];

  // Chapters ("Bab") extraction & navigation matching editorial reading rail
  const isBoilerplateHeading = (t: string) => {
    const l = t.toLowerCase();
    return (
      l.includes("more great") ||
      l.includes("more stories") ||
      l.includes("more fashion") ||
      l.includes("more retail") ||
      l.includes("more beauty") ||
      l.includes("more executive") ||
      l.includes("more living") ||
      l.includes("more culture") ||
      l.includes("sign up") ||
      l.includes("newsletter") ||
      l.includes("vogue business") ||
      l.includes("condé nast") ||
      l.includes("ad choices") ||
      l.includes("wishlist") ||
      l.includes("favorite look")
    );
  };

  const headingBlocksWithIndex: { block: ArticleBlock; index: number }[] = [];
  blocks.forEach((b, idx) => {
    if (b.type === "heading" && b.text && b.text.trim().length > 0 && !isBoilerplateHeading(b.text)) {
      headingBlocksWithIndex.push({ block: b, index: idx });
    }
  });

  interface Chapter {
    id: string;
    number: number;
    title: string;
    targetId: string;
  }

  const chapters: Chapter[] = [
    {
      id: "bab-1",
      number: 1,
      title: "Prolog",
      targetId: "bab-prolog",
    },
  ];

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

  if (headingBlocksWithIndex.length >= 2) {
    if (headingBlocksWithIndex.length <= 4) {
      headingBlocksWithIndex.forEach((h, hIdx) => {
        chapters.push({
          id: `bab-${hIdx + 2}`,
          number: hIdx + 2,
          title: stripHtml(h.block.text!),
          targetId: `heading-block-${h.index}`,
        });
      });
    } else {
      const total = headingBlocksWithIndex.length;
      const selectedIndices = [
        0,
        Math.floor(total * 0.33),
        Math.floor(total * 0.66),
        total - 1,
      ];
      const uniqueIndices = Array.from(new Set(selectedIndices));
      uniqueIndices.forEach((hPos, hIdx) => {
        const h = headingBlocksWithIndex[hPos];
        chapters.push({
          id: `bab-${hIdx + 2}`,
          number: hIdx + 2,
          title: stripHtml(h.block.text!),
          targetId: `heading-block-${h.index}`,
        });
      });
    }
  } else if (headingBlocksWithIndex.length === 1) {
    chapters.push({
      id: "bab-2",
      number: 2,
      title: stripHtml(headingBlocksWithIndex[0].block.text!),
      targetId: `heading-block-${headingBlocksWithIndex[0].index}`,
    });
    chapters.push({
      id: "bab-3",
      number: 3,
      title: "Sorotan Editorial",
      targetId: "pullquote-break",
    });
  } else {
    const midIdx = Math.floor(blocks.length / 2);
    chapters.push({
      id: "bab-2",
      number: 2,
      title: "Narasi Utama",
      targetId: `block-anchor-${midIdx}`,
    });
    chapters.push({
      id: "bab-3",
      number: 3,
      title: "Sorotan Editorial",
      targetId: "pullquote-break",
    });
  }

  if (chapters.length < 5 && secondaryGallery.length > 0) {
    chapters.push({
      id: `bab-${chapters.length + 1}`,
      number: chapters.length + 1,
      title: "Visual Chronicle",
      targetId: "bab-visual-chronicle",
    });
  }

  if (chapters.length < 5) {
    chapters.push({
      id: `bab-${chapters.length + 1}`,
      number: chapters.length + 1,
      title: "Catatan Atelier",
      targetId: "bab-curator-notes",
    });
  }

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const scrollToChapter = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = chapters.length - 1; i >= 0; i--) {
        const el = document.getElementById(chapters[i].targetId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPos >= top) {
            setActiveChapterIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapters]);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
    setLightboxOpen(true);
  };

  const resetZoom = useCallback(() => {
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomScale((prev) => Math.min(4, parseFloat((prev + 0.25).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomScale((prev) => {
      const next = Math.max(1, parseFloat((prev - 0.25).toFixed(2)));
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - panPosition.x,
      y: e.clientY - panPosition.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale <= 1) return;
    const maxPan = (zoomScale - 1) * 350;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPanPosition({
      x: Math.max(-maxPan, Math.min(maxPan, newX)),
      y: Math.max(-maxPan, Math.min(maxPan, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    if (!lightboxOpen) {
      resetZoom();
      return;
    }

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const zoomStep = 0.25;
      const isZoomIn = e.deltaY < 0;

      setZoomScale((prev) => {
        const nextScale = isZoomIn ? prev + zoomStep : prev - zoomStep;
        const clamped = Math.min(4, Math.max(1, parseFloat(nextScale.toFixed(2))));
        if (clamped === 1) {
          setPanPosition({ x: 0, y: 0 });
        }
        return clamped;
      });
    };

    window.addEventListener("wheel", handleNativeWheel, { passive: false });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        resetZoom();
        setActiveLightboxIndex((prev) =>
          prev === 0 ? allStoryPhotos.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        resetZoom();
        setActiveLightboxIndex((prev) =>
          prev === allStoryPhotos.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener("wheel", handleNativeWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, allStoryPhotos.length, resetZoom]);

  let hasRenderedFirstParagraph = false;

  // Group blocks into render items: diptych for adjacent image pairs, single images, headings, paragraphs
  type RenderItem =
    | { type: "heading"; text: string; index: number }
    | { type: "paragraph"; text: string; index: number }
    | { type: "single_image"; block: ArticleBlock; index: number }
    | { type: "image_pair"; blocks: [ArticleBlock, ArticleBlock]; indices: [number, number] };

  const renderItems: RenderItem[] = [];
  let blockIdx = 0;
  while (blockIdx < blocks.length) {
    const cur = blocks[blockIdx];
    if (cur.type === "image" && cur.url) {
      const next = blocks[blockIdx + 1];
      if (next && next.type === "image" && next.url) {
        renderItems.push({
          type: "image_pair",
          blocks: [cur, next],
          indices: [blockIdx, blockIdx + 1],
        });
        blockIdx += 2;
        continue;
      } else {
        renderItems.push({
          type: "single_image",
          block: cur,
          index: blockIdx,
        });
        blockIdx += 1;
        continue;
      }
    } else if (cur.type === "heading" && cur.text) {
      renderItems.push({
        type: "heading",
        text: cur.text,
        index: blockIdx,
      });
      blockIdx += 1;
    } else if (cur.type === "paragraph" && cur.text) {
      renderItems.push({
        type: "paragraph",
        text: cur.text,
        index: blockIdx,
      });
      blockIdx += 1;
    } else {
      blockIdx += 1;
    }
  }

  return (
    <article className="min-h-screen bg-[#080808] text-[#f5f4f0] pt-24 sm:pt-28 pb-28 relative">
      {/* Floating Vertical Chapter Indicator ("Bab") matching reference screenshot */}
      <aside
        aria-label="Navigasi Bab"
        className="fixed right-3 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-40 select-none pointer-events-auto"
      >
        <div className="flex flex-col items-end gap-5 py-3">
          {chapters.map((ch, idx) => {
            const isActive = activeChapterIndex === idx;
            return (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(ch.targetId)}
                className="group relative flex items-center justify-end py-1.5 px-1 cursor-pointer focus:outline-none"
                title={`Bab ${ch.number}: ${ch.title}`}
                aria-label={`Bab ${ch.number}: ${ch.title}`}
                aria-current={isActive ? "true" : undefined}
              >
                {/* Floating Chapter Tooltip */}
                <div className="absolute right-full mr-3.5 flex items-center space-x-2 bg-[#121212]/95 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-right whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#a7c080]">
                    BAB {String(ch.number).padStart(2, "0")}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-[11px] font-serif text-white tracking-wide max-w-[200px] truncate">
                    {ch.title}
                  </span>
                </div>

                {/* Horizontal Dash Bar */}
                <span
                  className={`block rounded-full transition-all duration-300 ease-out ${
                    isActive
                      ? "w-7 sm:w-8 h-[2.5px] bg-[#a7c080] shadow-[0_0_8px_rgba(167,192,128,0.5)]"
                      : "w-3.5 sm:w-4 h-[2.5px] bg-[#2a2a2a] group-hover:w-5 group-hover:bg-neutral-400"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </aside>

      {/* Top Editorial Breadcrumb & Action Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-4">
          <Link
            href="/news"
            className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-[#a7c080] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>The Gazette</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[#a7c080] font-semibold">{article.category}</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-1.5 transition-colors cursor-pointer ${
                bookmarked ? "text-[#a7c080]" : "text-neutral-400 hover:text-white"
              }`}
              title="Bookmark story"
              aria-label="Bookmark story"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer relative"
              title="Share article"
              aria-label="Share article"
            >
              {copied ? <Check className="w-4 h-4 text-[#a7c080]" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 mb-10 text-center space-y-5">
        <div className="inline-flex items-center space-x-3 text-[11px] uppercase tracking-[0.25em] text-[#a7c080] font-semibold">
          <span>{article.category}</span>
          <span>•</span>
          <span className="text-neutral-400 font-normal">{article.readingTime}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-white leading-[1.08] tracking-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="font-serif text-lg sm:text-2xl text-neutral-300 italic font-light max-w-2xl mx-auto leading-relaxed">
            {article.subtitle}
          </p>
        )}

        {/* Byline Strip */}
        <div className="pt-6 border-t border-[#1c1c1c] flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-neutral-400">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#333] flex items-center justify-center text-[11px] font-serif font-bold text-[#a7c080]">
              {article.author.charAt(0)}
            </div>
            <div className="text-left">
              <span className="text-white font-medium block">{article.author}</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                {article.authorRole}
              </span>
            </div>
          </div>

          <span className="hidden sm:inline text-neutral-700">•</span>

          <div className="flex items-center space-x-2 text-[11px] text-neutral-400">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </header>

      {/* Hero Feature Image - Completely Transparent, No Card Box */}
      <figure className="max-w-5xl mx-auto px-4 sm:px-6 mb-14 text-center">
        <div
          onClick={() => openLightbox(0)}
          className="relative inline-block w-fit max-w-full overflow-hidden bg-transparent cursor-pointer group mx-auto"
          title="Click to view full image"
        >
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            width={1600}
            height={1000}
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="w-auto max-w-full h-auto max-h-[85vh] object-contain mx-auto block"
          />
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm p-2 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>
        <figcaption className="mt-3 text-[11px] text-neutral-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 italic text-left">
          <span>{article.heroImageCaption || "Editorial imagery via Vogue Archives."}</span>
          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-wider not-italic text-neutral-400 hover:text-[#a7c080] inline-flex items-center space-x-1"
            >
              <span>Vogue Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </figcaption>
      </figure>

      {/* Main Editorial Story Flow (Blocks) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Bab 1 (Prolog) Anchor Header */}
        <div id="bab-prolog" className="scroll-mt-28 mb-8 pb-3 border-b border-[#1c1c1c]/60 flex items-center space-x-2 text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#a7c080]">
          <span>BAB 01</span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-400 font-normal">PROLOG</span>
        </div>

        <div className="space-y-6">
          {renderItems.map((item, itemIdx) => {
            if (item.type === "heading") {
              const matchingChapter = chapters.find(
                (c) => c.targetId === `heading-block-${item.index}`
              );
              const chapterNum = matchingChapter ? matchingChapter.number : null;

              return (
                <div
                  key={`h-${item.index}-${itemIdx}`}
                  id={`heading-block-${item.index}`}
                  className="pt-12 pb-3 mt-10 border-t border-[#1c1c1c] scroll-mt-28"
                >
                  <span className="text-[9.5px] uppercase tracking-[0.25em] font-semibold text-[#a7c080] block mb-2 font-mono">
                    {chapterNum ? `BAB ${String(chapterNum).padStart(2, "0")}` : `BAGIAN`}
                  </span>
                  <h2
                    className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal leading-snug tracking-tight"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </div>
              );
            }

            if (item.type === "image_pair") {
              return (
                <div
                  key={`pair-${item.indices[0]}-${itemIdx}`}
                  id={`block-anchor-${item.indices[0]}`}
                  className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4 scroll-mt-28 items-start"
                >
                  {item.blocks.map((imgB, pIdx) => {
                    const gIdx = allStoryPhotos.findIndex((p) => p.url === imgB.url);
                    return (
                      <figure key={pIdx} className="space-y-2 text-center">
                        <div
                          onClick={() => openLightbox(gIdx >= 0 ? gIdx : 0)}
                          className="relative inline-block w-fit max-w-full overflow-hidden bg-transparent cursor-pointer group mx-auto"
                          title="Click to open fullscreen view"
                        >
                          <Image
                            src={imgB.url!}
                            alt={imgB.alt || article.title}
                            width={800}
                            height={1000}
                            sizes="(max-width: 640px) 100vw, 384px"
                            className="w-auto max-w-full h-auto max-h-[75vh] object-contain mx-auto block"
                          />
                          <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-sm p-1.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                        {imgB.caption && (
                          <figcaption className="text-[11px] text-neutral-400 italic border-l border-[#a7c080] pl-2.5 py-0.5 line-clamp-2 text-left">
                            {imgB.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  })}
                </div>
              );
            }

            if (item.type === "single_image") {
              const galleryIdx = allStoryPhotos.findIndex((p) => p.url === item.block.url);
              return (
                <figure key={`img-${item.index}-${itemIdx}`} id={`block-anchor-${item.index}`} className="my-10 space-y-2.5 scroll-mt-28 text-center">
                  <div
                    onClick={() => openLightbox(galleryIdx >= 0 ? galleryIdx : 0)}
                    className="relative inline-block w-fit max-w-full overflow-hidden bg-transparent cursor-pointer group mx-auto"
                    title="Click to open fullscreen view"
                  >
                    <Image
                      src={item.block.url!}
                      alt={item.block.alt || article.title}
                      width={1600}
                      height={1000}
                      sizes="(max-width: 1024px) 100vw, 768px"
                      className="w-auto max-w-full h-auto max-h-[85vh] object-contain mx-auto block"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm p-1.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <figcaption className="text-xs text-neutral-400 italic font-sans border-l-2 border-[#a7c080] pl-3 py-0.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
                    <span>{item.block.caption || item.block.alt || "Photography via Vogue Archives"}</span>
                    <span className="text-[10px] text-neutral-500 uppercase not-italic tracking-wider">
                      Vogue Editorial
                    </span>
                  </figcaption>
                </figure>
              );
            }

            if (item.type === "paragraph") {
              const text = item.text;

              // Check if paragraph is structured details (like Rooms, Amenities, Location)
              const isDetails =
                text.startsWith("Rooms:") ||
                text.startsWith("Amenities:") ||
                text.startsWith("Location:") ||
                text.startsWith("Rate:") ||
                text.startsWith("Why we love it:");

              if (isDetails) {
                const parts = text.split(":");
                const label = parts[0];
                const value = parts.slice(1).join(":");
                return (
                  <div
                    key={`p-detail-${item.index}-${itemIdx}`}
                    id={`block-anchor-${item.index}`}
                    className="py-2.5 px-3 bg-white/[0.02] border-y border-[#222] text-xs flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3 my-2 scroll-mt-28"
                  >
                    <span className="uppercase tracking-widest text-[#a7c080] font-semibold text-[10px] whitespace-nowrap">
                      {label}:
                    </span>
                    <span
                      className="text-neutral-300 font-sans"
                      dangerouslySetInnerHTML={{ __html: value }}
                    />
                  </div>
                );
              }

              // First editorial paragraph gets an elegant drop cap
              if (!hasRenderedFirstParagraph) {
                hasRenderedFirstParagraph = true;
                return (
                  <p
                    key={`p-${item.index}-${itemIdx}`}
                    id={`block-anchor-${item.index}`}
                    className="font-serif text-lg sm:text-xl text-neutral-200 leading-[1.8] mb-8 first-letter:float-left first-letter:text-6xl first-letter:pr-4 first-letter:font-serif first-letter:font-bold first-letter:text-[#a7c080] first-letter:leading-none scroll-mt-28"
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                );
              }

              // Normal editorial paragraph with elegant line height and spacing
              return (
                <p
                  key={`p-${item.index}-${itemIdx}`}
                  id={`block-anchor-${item.index}`}
                  className="font-serif text-[17px] sm:text-[19px] text-[#dedede] leading-[1.85] mb-6 font-light scroll-mt-28"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              );
            }

            return null;
          })}
        </div>

        {/* Editorial Pullquote Break */}
        <div id="pullquote-break" className="my-14 py-8 border-y border-[#262626] text-center space-y-3 scroll-mt-28">
          <blockquote className="font-serif italic text-2xl sm:text-3xl text-white leading-snug">
            &ldquo;In high fashion, every stitch and silhouette is a testament to the pursuit of timeless beauty.&rdquo;
          </blockquote>
          <cite className="text-[10px] uppercase tracking-[0.2em] text-[#a7c080] not-italic font-semibold block">
            — VOYOR Atelier Milano Gazette
          </cite>
        </div>

        {/* Story Topics & Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[#1c1c1c] flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-luxury text-neutral-500 mr-2">
              Topics:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-wider border border-[#282828] text-neutral-300 px-3 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Contributor Box - Transparent */}
        <div id="bab-curator-notes" className="mt-12 py-8 border-t border-b border-[#1c1c1c] flex items-start space-x-4 scroll-mt-28">
          <div className="w-12 h-12 rounded-full bg-[#1c1c1c] border border-[#a7c080]/30 flex-shrink-0 flex items-center justify-center font-serif text-lg font-bold text-[#a7c080]">
            {article.author.charAt(0)}
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#a7c080] font-bold block">
              Editorial Contributor
            </span>
            <h4 className="font-serif text-lg text-white font-medium">{article.author}</h4>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Reporting on European haute couture, Milan fashion week presentations, and global luxury design for the VOYOR Gazette and Vogue archives.
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Lookbook & Photography Archive (Visual Chronicle) - Fully Transparent & Clickable for Fullscreen */}
      {secondaryGallery.length > 0 && (
        <section id="bab-visual-chronicle" className="max-w-5xl mx-auto px-4 sm:px-6 mt-20 pt-16 border-t border-[#1c1c1c] scroll-mt-28">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#222]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#a7c080] font-bold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                Editorial Lookbook
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal uppercase mt-1">
                Visual Chronicle ({secondaryGallery.length + 1} Images)
              </h3>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 hidden sm:inline">
              Click any image for fullscreen view
            </span>
          </div>

          {/* Pinterest-Style Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {secondaryGallery.map((img, idx) => {
              const galleryIdx = allStoryPhotos.findIndex((p) => p.url === img.url);
              return (
                <div
                  key={idx}
                  onClick={() => openLightbox(galleryIdx >= 0 ? galleryIdx : idx + 1)}
                  className="break-inside-avoid mb-6 group cursor-pointer select-none"
                  title="Click to open fullscreen view"
                >
                  <div className="relative overflow-hidden bg-transparent transition-all duration-300">
                    <Image
                      src={img.url}
                      alt={img.alt || `Visual Chronicle Photo ${idx + 1}`}
                      width={800}
                      height={1000}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-auto object-contain block group-hover:opacity-90 transition-opacity"
                    />

                    {/* Pinterest Hover Gradient & Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider font-mono font-semibold bg-black/70 backdrop-blur-md text-[#a7c080] px-2 py-0.5 rounded border border-white/10">
                          Plate {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-colors">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {img.caption && (
                        <p className="text-xs text-neutral-200 font-serif italic line-clamp-3 leading-snug drop-shadow">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Curated "Shop The Editorial Runway" - Transparent */}
      {curatedProducts && curatedProducts.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-20 pt-16 border-t border-[#1c1c1c]">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#222]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#a7c080] font-bold block">
                Runway Curation
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal uppercase">
                Featured Atelier Creations
              </h3>
            </div>
            <Link
              href="/category/runway-couture"
              className="text-[11px] uppercase tracking-wider text-neutral-400 hover:text-[#a7c080] flex items-center space-x-1 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {curatedProducts.slice(0, 3).map((prod) => {
              const img = prod.images.find((i) => i.isPrimary) || prod.images[0];
              return (
                <Link
                  key={prod.id}
                  href={`/product/${prod.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-transparent mb-4">
                    {img && (
                      <Image
                        src={img.url}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#a7c080] font-semibold block">
                      {prod.origin}
                    </span>
                    <h4 className="font-serif text-base text-white group-hover:text-[#a7c080] transition-colors truncate">
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

      {/* More in Fashion / Related Stories */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-20 pt-16 border-t border-[#1c1c1c]">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#222]">
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal uppercase">
              Next in Fashion & Editorial
            </h3>
            <Link
              href="/news"
              className="text-[11px] uppercase tracking-wider text-neutral-400 hover:text-[#a7c080] flex items-center space-x-1"
            >
              <span>The Gazette Index</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((rel) => (
              <article key={rel.id} className="group">
                <Link href={`/news/${rel.slug}`} className="block">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-transparent mb-4">
                    <Image
                      src={rel.heroImage}
                      alt={rel.heroImageAlt || rel.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-[#a7c080] font-bold block mb-1">
                    {rel.category}
                  </span>
                  <h4 className="font-serif text-lg text-white group-hover:text-[#a7c080] transition-colors leading-snug line-clamp-2 mb-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {rel.subtitle}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Product-Grade Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onMouseUp={handleMouseUp}
        >
          {/* Lightbox Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#222] z-30">
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#a7c080]">
                Visual Chronicle
              </span>
              <span className="text-neutral-600 hidden sm:inline">•</span>
              <span className="text-xs text-neutral-300 font-serif italic truncate max-w-xs sm:max-w-md hidden sm:inline">
                {allStoryPhotos[activeLightboxIndex]?.caption || article.title}
              </span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Zoom Controls */}
              <div className="flex items-center bg-[#141414] border border-[#262626] rounded-full p-1">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                {zoomScale > 1 && (
                  <button
                    type="button"
                    onClick={resetZoom}
                    className="p-1.5 rounded-full text-neutral-400 hover:text-[#a7c080] hover:bg-white/10 transition-colors cursor-pointer ml-1"
                    title="Reset Zoom"
                    aria-label="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={toggleBrowserFullscreen}
                className="p-2 rounded-full bg-[#141414] border border-[#262626] text-neutral-300 hover:text-[#a7c080] transition-colors cursor-pointer hidden sm:flex items-center justify-center"
                title="Toggle Fullscreen"
                aria-label="Toggle Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Counter */}
              <span className="text-xs font-mono text-neutral-400 px-2">
                {activeLightboxIndex + 1} / {allStoryPhotos.length}
              </span>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-[#a7c080] text-white hover:text-black transition-colors cursor-pointer"
                aria-label="Close fullscreen view"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Stage Image Area with Pan & Zoom */}
          <div
            className={`relative flex-1 flex items-center justify-center overflow-hidden my-3 ${
              zoomScale > 1
                ? isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-zoom-in"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            title={zoomScale > 1 ? "Drag to pan • Scroll mouse to zoom" : "Scroll mouse to zoom in / out"}
          >
            <div
              className={`relative w-full h-full max-w-6xl max-h-[78vh] ${
                isDragging ? "transition-none" : "transition-transform duration-150 ease-out"
              }`}
              style={{
                transform: `scale(${zoomScale}) translate(${panPosition.x / zoomScale}px, ${panPosition.y / zoomScale}px)`,
                transformOrigin: "center center",
              }}
            >
              <Image
                src={allStoryPhotos[activeLightboxIndex]?.url || ""}
                alt={allStoryPhotos[activeLightboxIndex]?.alt || `Photo ${activeLightboxIndex + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-contain pointer-events-none select-none"
              />
            </div>

            {/* Navigation Arrows */}
            {allStoryPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetZoom();
                    setActiveLightboxIndex((prev) =>
                      prev === 0 ? allStoryPhotos.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-[#a7c080] text-white hover:text-black border border-white/20 transition-all z-20 cursor-pointer shadow-xl"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetZoom();
                    setActiveLightboxIndex((prev) =>
                      prev === allStoryPhotos.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-[#a7c080] text-white hover:text-black border border-white/20 transition-all z-20 cursor-pointer shadow-xl"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          {allStoryPhotos.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 z-30 max-w-4xl mx-auto scrollbar-none">
              {allStoryPhotos.map((photo, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => {
                    resetZoom();
                    setActiveLightboxIndex(pIdx);
                  }}
                  className={`relative w-14 h-10 sm:w-16 sm:h-12 flex-shrink-0 overflow-hidden border transition-all cursor-pointer ${
                    activeLightboxIndex === pIdx
                      ? "border-[#a7c080] scale-105 opacity-100"
                      : "border-transparent opacity-40 hover:opacity-80"
                  }`}
                  aria-label={`Jump to photo ${pIdx + 1}`}
                >
                  <Image
                    src={photo.url}
                    alt={`Thumbnail ${pIdx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
