"use client";

import { useEffect, useRef } from "react";
import { MotionValue, motion } from "framer-motion";

export function VideoBackgroundPlayer({
  video_path,
  className,
  is_muted,
  mask_path,
  maskScale = 1,
  blurAmount,
}: {
  video_path: string;
  className?: string;
  is_muted: boolean;
  mask_path?: string;
  maskScale?: number | MotionValue<number>;
  blurAmount?: number | MotionValue<number>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mask_path) return;

    // Apply the mask using CSS
    if (containerRef.current) {
      containerRef.current.style.maskImage = `url(${mask_path})`;
      containerRef.current.style.WebkitMaskImage = `url(${mask_path})`;
      containerRef.current.style.maskRepeat = "no-repeat";
      containerRef.current.style.WebkitMaskRepeat = "no-repeat";
      containerRef.current.style.maskPosition = "center";
      containerRef.current.style.WebkitMaskPosition = "center";

      // Set initial scale immediately
      if (typeof maskScale === "number") {
        const scalePercent = `${maskScale * 100}%`;
        containerRef.current.style.maskSize = scalePercent;
        containerRef.current.style.WebkitMaskSize = scalePercent;
      } else {
        // For MotionValue, get the current value
        const currentScale = maskScale.get();
        const scalePercent = `${currentScale * 100}%`;
        containerRef.current.style.maskSize = scalePercent;
        containerRef.current.style.WebkitMaskSize = scalePercent;
      }
    }
  }, [mask_path, maskScale]);

  // Update mask scale when it changes
  useEffect(() => {
    if (!containerRef.current || !mask_path) return;

    const updateScale = (scale: number) => {
      if (containerRef.current) {
        // Calculate scale as percentage
        const scalePercent = `${scale * 100}%`;
        containerRef.current.style.maskSize = scalePercent;
        containerRef.current.style.WebkitMaskSize = scalePercent;
      }
    };

    // Handle both number and MotionValue
    if (typeof maskScale === "number") {
      updateScale(maskScale);
    } else {
      // It's a MotionValue
      const unsubscribe = maskScale.onChange(updateScale);
      return () => unsubscribe();
    }
  }, [mask_path, maskScale]);

  return (
    <div
      ref={containerRef}
      className={`${className} absolute top-0 left-0 w-full h-full -z-10`}
    >
      {blurAmount && typeof blurAmount !== "number" ? (
        <motion.video
          style={{
            filter: blurAmount, // This now receives the complete "blur(Xpx)" string
          }}
          className="w-full h-full object-cover"
          src={video_path}
          autoPlay
          muted={is_muted}
          loop
          playsInline
        />
      ) : (
        <video
          style={{
            filter:
              typeof blurAmount === "number"
                ? `blur(${blurAmount}px)`
                : undefined,
          }}
          className="w-full h-full object-cover"
          src={video_path}
          autoPlay
          muted={is_muted}
          loop
          playsInline
        />
      )}
    </div>
  );
}
