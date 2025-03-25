"use client";

import { VideoBackgroundPlayer } from "@/components/VideoBackgroundPlayer";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  easeIn,
} from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { Navbar } from "@/components/Navbar";
import Logo from "@/components/Logo";

// Import the 3D model with dynamic loading
const Model3D = dynamic(
  () => import("../components/Model3D").then((mod) => mod.Model),
  {
    ssr: false,
  }
);

export default function Home() {
  // Reference for the scroll container
  const containerRef = useRef(null);
  // State for model rotation
  const [modelYRotation, setModelYRotation] = useState(0);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Mask scale with direct scroll values and a smooth easing function
  const maskScale = useTransform(
    scrollYProgress, // Use direct scroll values instead of spring physics
    [0, 0.015, 0.03, 0.045, 0.06, 0.08, 0.1], // Control points
    [20, 12, 7, 3.5, 2, 1, 0.32], // Scale values
    {
      ease: (x) => {
        // Custom easing function for smooth logarithmic-like curve
        return 1 - Math.pow(1 - x, 3); // Cubic ease-out
      },
    }
  );

  // Update other transforms to use scrollYProgress directly
  const videoOpacity = useTransform(scrollYProgress, [0.1, 0.101], [1, 0]);

  const logoOpacity = useTransform(scrollYProgress, [0.15, 0.2], [1, 0]);

  const videoBlur = useTransform(scrollYProgress, [0, 0.2], [4, 50], {
    ease: easeIn,
  });

  // Other transforms should also use scrollYProgress directly
  const subtitleOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  const modelOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);

  const featureOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);

  const modelRotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);

  // Create a derived motion value for the CSS filter
  const videoBlurFilter = useTransform(
    videoBlur,
    (value) => `blur(${value}px)`
  );

  // Update model rotation based on scroll
  useMotionValueEvent(modelRotation, "change", (latest) => {
    setModelYRotation(latest);
  });

  // Initialize Lenis smooth scrolling with optimized settings
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8, // Increase duration for smoother scrolling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1.2, // Slightly increase wheel multiplier
      lerp: 0.1, // Linear interpolation amount (lower = smoother)
    });

    // Use requestAnimationFrame for smoother animation
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center h-screen z-10">
        <Image
          src="/pwone.png"
          alt="Pinewood One"
          width="500"
          height="500"
          className="w-1/2 h-auto hover:scale-105 active:scale-95 transition-transform duration-300 ease-in-out cursor-pointer"
          onClick={logoOnClick}
        />
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        <video
          loop
          playsInline
          className="w-full h-full object-cover opacity-0"
          src="https://cdn.hackclubber.dev/slackcdn/3342a21636498dd66c6e423e694eb841.mp4"
          id="video"
        />
      </div>
    </div>
  );
}

let clicks = 0;

function logoOnClick() {
  clicks++;
  document.body.style.backgroundColor = `rgba(0, 0, 0, ${clicks * 0.08})`;

  if (clicks >= 13) {
    const video = document.getElementById("video") as HTMLVideoElement;
    if (video) {
      const playPromise = video.play();
      video.style.opacity = "100";

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video playing successfully");
          })
          .catch((error) => {
            console.error("Error playing video:", error);
          });
      }
    }
  }
}
