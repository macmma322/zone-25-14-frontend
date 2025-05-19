"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { nicheThemes } from "@/data/nicheThemes";

type NicheKey = keyof typeof nicheThemes;

const nicheOrder: NicheKey[] = [
  "otakusquad",
  "stoikrclub",
  "wd_crew",
  "peros_pack",
  "crithit_team",
  "the_grid_opus",
  "the_syndicate",
];

export default function NicheCards() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [showQuote, setShowQuote] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const router = useRouter();

  const handleHover = (slug: string) => {
    setHovered(slug);
    const video = videoRefs.current[slug];
    if (video && video.paused) {
      video.currentTime = 0;
      video.loop = true;
      setTimeout(() => video.play().catch(() => {}), 300);
    }
    setTimeout(() => setShowQuote(slug), 400);
  };

  const handleLeave = (slug: string) => {
    setHovered(null);
    setShowQuote(null);
    const video = videoRefs.current[slug];
    if (video) {
      requestAnimationFrame(() => {
        video.pause();
        video.currentTime = 0;
        video.loop = false;
      });
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden items-stretch p-0 m-0">
      {nicheOrder.map((slug) => {
        const niche = nicheThemes[slug];
        const isHovered = hovered === slug;
        const showThisQuote = showQuote === slug;

        return (
          <div
            key={slug}
            onMouseEnter={() => handleHover(slug)}
            onMouseLeave={() => handleLeave(slug)}
            onClick={() => router.push(`/${slug}`)}
            className={`relative flex items-center justify-center transition-all duration-700 overflow-hidden cursor-pointer ${
              isHovered ? "flex-[4]" : "flex-1"
            }`}
          >
            {/* Rotating wrapper for the video */}
            <div
              className={`absolute w-[100vh] h-full origin-center flex items-center justify-center overflow-hidden 
    transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] will-change-transform ${
      isHovered ? "rotate-0 scale-100" : "-rotate-90 scale-[1.35]"
    }`}
            >
              <video
                ref={(el) => {
                  videoRefs.current[slug] = el;
                }}
                src={niche.video}
                muted
                playsInline
                loop={isHovered}
                preload="auto"
                className={`absolute object-cover transition-opacity duration-500 ease-in-out will-change-transform ${
                  isHovered
                    ? "opacity-100 h-full w-full translate-x-[0%]"
                    : "opacity-100 h-auto -translate-x-[0%]"
                }`}
                onLoadedData={(e) => {
                  const video = e.currentTarget;
                  video.pause();
                  video.currentTime = 0;
                }}
              />
            </div>

            {/* Optional dark overlay */}
            <div className="absolute bg-black/40 pointer-events-none z-0" />

            {/* Title + Quote */}
            <div className="relative z-10 text-center">
              <h2
                className={`font-display mb-2 text-white transition-all duration-700 origin-center inline-block ${
                  isHovered
                    ? "text-2xl md:text-3xl rotate-0"
                    : "-rotate-90 text-lg tracking-widest"
                }`}
              >
                {niche.name}
              </h2>

              <p
                className={`text-sm max-w-[240px] mx-auto text-white transition-opacity duration-500 ${
                  showThisQuote && isHovered
                    ? "opacity-100 fade-in"
                    : "opacity-0"
                }`}
              >
                {niche.quote}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
