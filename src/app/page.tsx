"use client";
import ModelViewer from "@/components/ModelViewer";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function Home() {
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
          cameraDistance={3}
        />
      </div>

      {/* Navbar with high z-index to stay on top */}
      <Navbar />

      {/* Scrollable content */}
      <div className="relative z-10 py-20">
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
        <h1 className="text-3xl font-bold text-center">text</h1>
      </div>
    </main>
  );
}
