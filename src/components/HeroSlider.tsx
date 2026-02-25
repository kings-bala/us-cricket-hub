"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export default function HeroSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSliderPos(pct);
    },
    []
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      updatePosition(e.clientX);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [updatePosition]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const autoRef = useRef(true);

  useEffect(() => {
    let frame: number;
    let pos = 20;
    let dir = 1;
    const animate = () => {
      if (!autoRef.current) return;
      pos += dir * 0.15;
      if (pos >= 80) dir = -1;
      if (pos <= 20) dir = 1;
      setSliderPos(pos);
      frame = requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 800);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden select-none cursor-col-resize"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="absolute inset-0">
        <img
          src="/hero-pro.jpg"
          alt="Professional cricket"
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src="/hero-street.jpg"
          alt="Street cricket"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: "100vw", maxWidth: "none" }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
      </div>

      <div
        className="absolute top-0 bottom-0 z-20"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-1 h-full bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 border-2 border-white">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 10L3 10M3 10L5 8M3 10L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 10L17 10M17 10L15 8M17 10L15 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-10 text-white text-sm font-semibold bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
        Street Cricket
      </div>
      <div className="absolute bottom-6 right-6 z-10 text-white text-sm font-semibold bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
        T20 Professional
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            From Street Cricket to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Global T20 Leagues
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            The global talent discovery platform connecting youth cricketers with
            IPL, BBL, CPL, PSL, SA20, The Hundred, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
