import gsap from "gsap";
import { useLayoutEffect, useRef, useState } from "react";

export default function Preloader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Wait for the browser to fully load all assets
  useLayoutEffect(() => {
    let animationFrame: number;

    const checkReady = () => {
      if (document.readyState === "complete") {
        setLoaded(true);
      } else {
        animationFrame = requestAnimationFrame(checkReady);
      }
    };

    checkReady();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Once loaded, run the exit animation: text scales + fades, panel slides up
  useLayoutEffect(() => {
    if (loaded && loaderRef.current && textRef.current) {
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          gsap.set(loaderRef.current, {
            pointerEvents: "none",
            display: "none",
          });
        },
      });

      // Text scales out simultaneously with the panel sliding upward
      tl.to(textRef.current, { scale: 5, opacity: 0, duration: 0.8 });
      tl.to(
        loaderRef.current,
        {
          y: "-105%",
          borderBottomLeftRadius: "50% 20%",
          borderBottomRightRadius: "50% 20%",
          duration: 1,
        },
        "<"
      );
    }
  }, [loaded]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0A] shadow-2xl"
      style={{
        transform: "translateY(0%)",
        borderBottomLeftRadius: "0%",
        borderBottomRightRadius: "0%",
      }}
    >
      <div
        ref={textRef}
        className="flex flex-col items-center gap-4 select-none"
      >
        {/* Animated monogram */}
        <div className="font-sans font-black text-5xl text-white tracking-tighter">
          V<span className="text-white/30">|</span>
        </div>

        {/* Loading label */}
        <p className="font-mono text-xs text-white/50 uppercase tracking-[0.4em] animate-pulse">
          Getting Ready..
        </p>

        {/* Thin progress shimmer bar */}
        <div className="w-32 h-[1px] bg-white/10 overflow-hidden rounded-full">
          <div className="h-full bg-white/60 animate-[shimmer_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
