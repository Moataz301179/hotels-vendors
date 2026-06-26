"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2, Loader2 } from "lucide-react";

interface LazyVideoProps {
  src: string;
  poster: string;
  title?: string;
  className?: string;
}

export function LazyVideo({ src, poster, title = "HotelsVendors promotional video", className }: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVisible) return;

    const onCanPlay = () => setIsLoaded(true);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("canplaythrough", onCanPlay);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    video.load();
    if (reducedMotion) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener("canplaythrough", onCanPlay);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [isVisible, reducedMotion]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-xl ${className || ""}`}
      style={{
        backgroundColor: "var(--bg-surface-1)",
        aspectRatio: "16/9",
      }}
    >
      {/* Poster / Placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{ background: `url(${poster}) center/cover` }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(20, 17, 14, 0.7)" }}
          />
          <button
            onClick={togglePlay}
            className="relative z-10 rounded-full p-4 transition-transform hover:scale-110"
            style={{
              backgroundColor: "var(--accent-base)",
              color: "var(--accent-text)",
              boxShadow: "0 0 30px var(--accent-glow)",
            }}
            aria-label={`Play ${title}`}
            title={`Play ${title}`}
          >
            <Play size={32} fill="currentColor" />
          </button>
          <span
            className="relative z-10 text-sm font-medium"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {isVisible ? "Loading..." : "Scroll to load video"}
          </span>
        </div>
      )}

      {/* Video element */}
      {isVisible && (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            playsInline
            loop
            preload="none"
            className="h-full w-full object-cover"
            aria-label={title}
            onClick={togglePlay}
          />
          {/* Loading indicator */}
          {!isLoaded && isVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2
                size={24}
                className="animate-spin"
                style={{ color: "var(--accent-base)" }}
              />
            </div>
          )}
          {/* Play overlay (when paused after load) */}
          {isLoaded && !isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center transition-colors"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              aria-label="Play video"
            >
              <Play
                size={48}
                fill="white"
                className="opacity-80"
                style={{ color: "white" }}
              />
            </button>
          )}
          {/* Mute indicator */}
          {isLoaded && isPlaying && (
            <div
              className="absolute bottom-2 right-2 rounded-full p-1.5"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <Volume2 size={14} style={{ color: "white" }} />
            </div>
          )}
        </>
      )}

      {/* Reduced motion: static poster */}
      {reducedMotion && !isVisible && (
        <div
          className="absolute inset-0"
          style={{
            background: `url(${poster}) center/cover`,
            backgroundColor: "var(--bg-surface-1)",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(20, 17, 14, 0.5)" }}
          >
            <img
              src={poster}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
