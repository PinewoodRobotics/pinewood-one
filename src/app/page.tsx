"use client";
import ModelViewer from "@/components/ModelViewer";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";
import { motion } from "framer-motion";
import Box from "@/components/Box";

// Define keyframes for scroll-based animation
// Format: [positionX, positionY, positionZ, rotationX, rotationY, rotationZ]
let scrollKeyFrames = {
  0: [0, -2, 0, 0, 0, 0], // Starting position (top of page)
  1: [0, 10, 0, 0, 0, 0], // Ending position (bottom of page)
};

// Helper function to interpolate between keyframes
function interpolateKeyframes(progress: number) {
  // Find the two keyframes to interpolate between
  const keyPoints = Object.keys(scrollKeyFrames)
    .map(Number)
    .sort((a, b) => a - b);

  // Find the keyframes that our progress falls between
  let startIndex = 0;
  for (let i = 0; i < keyPoints.length - 1; i++) {
    if (progress >= keyPoints[i] && progress <= keyPoints[i + 1]) {
      startIndex = i;
      break;
    }
  }

  const startKey = keyPoints[startIndex];
  const endKey = keyPoints[startIndex + 1];

  // If we're at the exact keyframe, return that keyframe's values
  if (progress === startKey) return scrollKeyFrames[startKey];
  if (progress === endKey) return scrollKeyFrames[endKey];

  // Calculate how far we are between the two keyframes (0 to 1)
  const segmentProgress = (progress - startKey) / (endKey - startKey);

  // Interpolate between the two keyframes
  const startValues = scrollKeyFrames[startKey];
  const endValues = scrollKeyFrames[endKey];

  // Linear interpolation between each value
  return startValues.map((start, i) => {
    return start + (endValues[i] - start) * segmentProgress;
  });
}

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [keyframeValues, setKeyframeValues] = useState<number[]>([]);

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);

      // Get normalized scroll progress (0 to 1)
      const progress = Math.min(
        1,
        Math.max(
          0,
          window.scrollY / (document.body.scrollHeight - window.innerHeight)
        )
      );
      setScrollProgress(progress);

      // Calculate interpolated keyframe values
      const interpolated = interpolateKeyframes(progress);
      setKeyframeValues(interpolated);

      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Fixed background - stays in place regardless of scroll */}
      <div className="fixed inset-0 z-0">
        <ModelViewer
          modelUrl="https://cdn.hack.ngo/slackcdn/49b45bdf52354530217dcaf19ae77b06.stl"
          cameraPosition={[-20, 3, 10]}
          cameraDistance={2.5} // Reduced from 3 to 1.5 to make the model appear larger
          scrollProgress={scrollProgress}
          keyframeValues={keyframeValues}
        />
      </div>

      {/* Navbar with high z-index to stay on top */}
      <Navbar />

      {/* Scrollable content */}
      <div className="relative py-20 text-center w-screen flex flex-col justify-center items-center">
        <div className="h-screen w-screen flex flex-col">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
              delay: 0.75,
            }}
            className="z-[-100] mx-10 h-[500px] flex items-center justify-center -mb-130"
          >
            <Image src="/PWRUP_icon.svg" alt="Image" width={500} height={500} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: 1,
            }}
            className="z-[-100] -mt-18 h-[300px] flex items-center justify-center"
          >
            <Image
              src="/4765_number.svg"
              alt="Image"
              width={300}
              height={300}
            />
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold text-white z-10">
          We are <span className="text-[#70cd35]">PWRUP</span> from{" "}
          <a href="https://pinewood.edu/" className="text-[#70cd35]">
            Pinewood School
          </a>{" "}
          in Los Altos, California.
        </h1>
        <div className="w-screen py-16 flex flex-row justify-center items-center gap-8">
          <Box
            title="About"
            description="This is the about section."
            color="#56B97F"
          />
          <Box title="Team" description="Meet our talented team members." />
          <Box
            title="Sponsors"
            description="Learn about our amazing sponsors."
          />
        </div>
        {/* <div className="w-screen h-screen flex flex-col justify-center items-center">
          <h2></h2>
        </div> */}
      </div>
    </main>
  );
}
