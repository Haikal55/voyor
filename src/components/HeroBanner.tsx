"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";

export function HeroBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.75);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      videoRef.current.volume = volume;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (!videoRef.current) return;

    videoRef.current.volume = val;
    if (val === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen().catch((err) => console.warn(err));
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      } else if ((video as any).webkitEnterFullscreen) {
        (video as any).webkitEnterFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.warn(err));
      }
    }
  };

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-black pt-16 sm:pt-24 pb-20 px-4 sm:px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover object-center opacity-65 pointer-events-auto"
          poster="/images/categories/category-runway-versace.jpg"
        >
          <source src="/videos/runway-hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/40 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/90 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <h1 className="font-script text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-white font-normal tracking-wide leading-[1.1] drop-shadow-2xl select-none">
          Fearless <span className="text-[#a7c080]">Opulence</span>
        </h1>

        <p className="max-w-xl mx-auto text-xs sm:text-sm text-neutral-300 font-light tracking-wide leading-relaxed px-2">
          The new chapter of the VOYOR Maison. Sculpted tailoring, liquid mulberry silks, and iconic 24-karat gold Barocco hardware.
        </p>

        <div className="flex items-center justify-center pt-4">
          <Link
            href="/category/runway-couture"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs uppercase tracking-luxury font-semibold transition-all shadow-lg text-center"
          >
            Explore The Runway
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 sm:bottom-12 left-6 sm:left-8 z-20 flex items-center space-x-3.5">
        <div className="group/audio relative flex items-center">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
            title={isMuted ? "Unmute video sound" : "Mute video sound"}
            className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer drop-shadow-md"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 stroke-[1.5]" />
            ) : (
              <Volume2 className="w-4 h-4 stroke-[1.5]" />
            )}
          </button>

          <div className="w-0 group-hover/audio:w-20 overflow-hidden opacity-0 group-hover/audio:opacity-100 transition-all duration-300 ease-out flex items-center pl-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Adjust volume"
              className="w-full h-1 appearance-none rounded-lg cursor-pointer transition-all"
              style={{
                background: `linear-gradient(to right, #a7c080 ${
                  isMuted ? 0 : Math.round(volume * 100)
                }%, rgba(255, 255, 255, 0.25) ${
                  isMuted ? 0 : Math.round(volume * 100)
                }%)`,
              }}
            />
          </div>
        </div>

        <button
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen video"}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen video"}
          className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer drop-shadow-md"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 stroke-[1.5]" />
          ) : (
            <Maximize2 className="w-4 h-4 stroke-[1.5]" />
          )}
        </button>
      </div>
    </section>
  );
}
