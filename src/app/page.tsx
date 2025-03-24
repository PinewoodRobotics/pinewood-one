"use client";

import { VideoBackgroundPlayer } from "@/components/VideoBackgroundPlayer";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { Navbar } from "@/components/Navbar";

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

  // Transform values based on scroll progress
  const modelRotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);
  const titleScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);
  const subtitleOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const modelOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const featureOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  // Video background opacity that fades out as you scroll
  const videoOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Update model rotation based on scroll
  useMotionValueEvent(modelRotation, "change", (latest) => {
    setModelYRotation(latest);
  });

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

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
    <div
      ref={containerRef}
      className="h-[400vh] overflow-x-hidden bg-gradient-to-b from-black to-slate-900"
    >
      {/* Navigation bar with scroll progress indicator */}
      <Navbar scrollProgress={scrollYProgress} />

      {/* Video background that fades out when scrolling */}
      <motion.div
        style={{ opacity: videoOpacity }}
        className="fixed inset-0 w-full h-screen"
      >
        <VideoBackgroundPlayer
          video_path={"/match_bg.mp4"}
          is_muted={true}
          className={"blur-sm"}
        />
      </motion.div>

      {/* First section - Team title */}
      <section
        id="about"
        className="h-screen w-full relative flex items-center justify-center"
      >
        <motion.div style={{ scale: titleScale }} className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-8xl font-extrabold tracking-tighter drop-shadow-[0_0_15px_rgba(0,0,0,0.7)]"
          >
            TEAM <span className="text-red-500">4765</span>
          </motion.h1>
        </motion.div>
      </section>

      {/* Second section - Subtitle and intro */}
      <section
        id="team"
        className="h-screen w-full relative flex items-center justify-center"
      >
        <motion.div
          style={{ opacity: subtitleOpacity }}
          className="text-center max-w-2xl mx-auto px-4"
        >
          <h2 className="text-white text-3xl font-bold tracking-wide uppercase drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] mb-6">
            Pinewood Robotics
          </h2>
          <p className="text-white text-xl">
            Pushing the boundaries of innovation in FIRST Robotics Competition
          </p>
        </motion.div>
      </section>

      {/* Third section - 3D Model that spins as you scroll */}
      <section
        id="robots"
        className="h-screen w-full relative flex items-center justify-center"
      >
        <motion.div
          style={{ opacity: modelOpacity }}
          className="w-full max-w-xl h-96 relative"
        >
          <Model3D
            model_path={"/rick_astley.glb"}
            scale={1.2}
            position_scene={[0, -1, 0]}
            rotation_x={0}
            rotation_y={modelYRotation}
            rotation_z={0}
            is_interactive={false}
            light_position={[10, 10, 10]}
            className={"w-full h-full"}
          />
        </motion.div>
      </section>

      {/* Fourth section - Features that appear */}
      <section
        id="sponsors"
        className="h-screen w-full relative flex items-center justify-center"
      >
        <motion.div
          style={{ opacity: featureOpacity }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full max-w-5xl mx-auto px-4"
        >
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-red-500 mb-3">Innovation</h3>
            <p className="text-white">
              Pushing the boundaries of what&apos;s possible in robotics design
              and engineering.
            </p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-red-500 mb-3">Teamwork</h3>
            <p className="text-white">
              Collaborating across disciplines to build championship-winning
              robots.
            </p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-red-500 mb-3">Excellence</h3>
            <p className="text-white">
              Striving for excellence in competition and in our community
              impact.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
