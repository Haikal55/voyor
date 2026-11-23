"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { ProductImage } from "@/lib/types";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  isRunway?: boolean;
}

export function ProductImageGallery({
  images,
  productName,
  isRunway = false,
}: ProductImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);

  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const handleMobileScroll = useCallback(() => {
    if (!mobileScrollRef.current) return;
    const { scrollLeft, clientWidth } = mobileScrollRef.current;
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex >= 0 && newIndex < images.length) {
        setActiveMobileIndex(newIndex);
      }
    }
  }, [images.length]);

  const scrollToMobileSlide = (index: number) => {
    if (!mobileScrollRef.current) return;
    const clientWidth = mobileScrollRef.current.clientWidth;
    mobileScrollRef.current.scrollTo({
      left: index * clientWidth,
      behavior: "smooth",
    });
    setActiveMobileIndex(index);
  };

  useEffect(() => {
    setActiveMobileIndex(0);
    if (mobileScrollRef.current) {
      mobileScrollRef.current.scrollLeft = 0;
    }
  }, [images]);

  const [zoomScale, setZoomScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomScale((prev) => Math.min(4, parseFloat((prev + 0.5).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomScale((prev) => {
      const next = Math.max(1, parseFloat((prev - 0.5).toFixed(2)));
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleToggleZoom = useCallback(() => {
    setZoomScale((prev) => {
      if (prev > 1) {
        setPanPosition({ x: 0, y: 0 });
        return 1;
      }
      return 2.5;
    });
  }, []);

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

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener("wheel", handleNativeWheel);
    };
  }, [lightboxOpen, resetZoom]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        resetZoom();
        setActiveLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        resetZoom();
        setActiveLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      } else if (e.key === "0") {
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, images.length, resetZoom, handleZoomIn, handleZoomOut]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale > 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomScale > 1) {
      const maxPan = (zoomScale - 1) * 350;
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      setPanPosition({
        x: Math.max(-maxPan, Math.min(maxPan, newX)),
        y: Math.max(-maxPan, Math.min(maxPan, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="block lg:hidden relative w-full aspect-[3/4] bg-[#141414] overflow-hidden border border-[#222]">
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-none overscroll-x-contain"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => {
                setActiveLightboxIndex(idx);
                resetZoom();
                setLightboxOpen(true);
              }}
              className="relative w-full h-full shrink-0 snap-center snap-always cursor-pointer"
            >
              <Image
                src={img.url}
                alt={img.alt || productName}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-top select-none"
              />
            </div>
          ))}
        </div>

        {isRunway && (
          <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-sm border border-[#a7c080] text-[#a7c080] text-[10px] uppercase tracking-ultra px-3 py-1 font-medium z-10 pointer-events-none">
            Milano Runway Piece
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-1.5 pointer-events-auto">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToMobileSlide(idx);
                }}
                aria-label={`Go to image ${idx + 1}`}
                className={`h-[2.5px] rounded-full transition-all duration-300 ${
                  activeMobileIndex === idx
                    ? "w-7 bg-white shadow-sm"
                    : "w-3.5 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 z-20 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] tracking-widest text-neutral-300 pointer-events-none">
            {activeMobileIndex + 1}/{images.length}
          </div>
        )}
      </div>

      <div className="hidden lg:block space-y-6">
        {images.map((img, idx) => (
          <div
            key={img.id || idx}
            onClick={() => {
              setActiveLightboxIndex(idx);
              resetZoom();
              setLightboxOpen(true);
            }}
            className="group relative aspect-[3/4] w-full bg-transparent overflow-hidden cursor-pointer"
          >
            <Image
              src={img.url}
              alt={img.alt || productName}
              fill
              priority={idx === 0}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-top select-none"
            />

            <div className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <Maximize2 className="w-4 h-4" />
            </div>

            {isRunway && idx === 0 && (
              <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-sm border border-[#a7c080] text-[#a7c080] text-[10px] uppercase tracking-ultra px-3 py-1 font-medium z-10 pointer-events-none">
                Milano Runway Piece
              </div>
            )}
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 select-none overscroll-none touch-none"
          onMouseUp={handleMouseUp}
        >
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] uppercase tracking-ultra text-[#a7c080] font-medium block">
                Atelier Fullscreen View
              </span>
              <h2 className="text-sm sm:text-base uppercase tracking-wider text-white font-medium">
                {productName}
              </h2>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-full px-2 py-1">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 1}
                  className="p-1.5 rounded-full text-neutral-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors cursor-pointer"
                  title="Zoom Out (-)"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={resetZoom}
                  className="px-2 py-0.5 text-[11px] font-mono font-medium text-[#a7c080] hover:underline cursor-pointer"
                  title="Reset Zoom (0)"
                >
                  {Math.round(zoomScale * 100)}%
                </button>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 4}
                  className="p-1.5 rounded-full text-neutral-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors cursor-pointer"
                  title="Zoom In (+)"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
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

              <span className="text-xs font-mono text-neutral-400 hidden sm:inline-block">
                {activeLightboxIndex + 1} / {images.length}
              </span>

              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-[#a7c080] text-white hover:text-black transition-colors cursor-pointer"
                aria-label="Close fullscreen view"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className={`relative flex-1 flex items-center justify-center overflow-hidden my-4 ${
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
            title={zoomScale > 1 ? "Drag to pan • Scroll wheel to zoom" : "Scroll wheel to zoom in / out"}
          >
            <div
              className={`relative w-full h-full max-w-5xl max-h-[82vh] ${
                isDragging ? "transition-none" : "transition-transform duration-150 ease-out"
              }`}
              style={{
                transform: `scale(${zoomScale}) translate(${panPosition.x / zoomScale}px, ${panPosition.y / zoomScale}px)`,
                transformOrigin: "center center",
              }}
            >
              <Image
                src={images[activeLightboxIndex]?.url || ""}
                alt={`${productName} - View ${activeLightboxIndex + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-contain pointer-events-none select-none"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetZoom();
                    setActiveLightboxIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
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
                      prev === images.length - 1 ? 0 : prev + 1
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

          {images.length > 1 && (
            <div className="flex items-center justify-center space-x-3 z-10">
              {images.map((img, idx) => (
                <button
                  type="button"
                  key={img.id || idx}
                  onClick={() => {
                    resetZoom();
                    setActiveLightboxIndex(idx);
                  }}
                  className={`relative w-14 h-18 rounded border transition-all overflow-hidden cursor-pointer ${
                    activeLightboxIndex === idx
                      ? "border-[#a7c080] ring-1 ring-[#a7c080] opacity-100"
                      : "border-neutral-800 opacity-50 hover:opacity-80"
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
