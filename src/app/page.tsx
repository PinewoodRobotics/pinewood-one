"use client";
import ModelViewer from "@/components/ModelViewer";
import Navbar from "@/components/Navbar";
import { useEffect, useState, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";
import { motion } from "framer-motion";
import Box from "@/components/Box";

// Add this component at the top of your file, before the Home component
function ARButton() {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if user is on iOS
    const checkIOS = () => {
      const ua = window.navigator.userAgent;
      const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
      const webkit = !!ua.match(/WebKit/i);
      setIsIOS(iOS && webkit && !ua.match(/CriOS/i));
    };

    checkIOS();
  }, []);

  if (!isIOS) return null;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<a rel="ar" href="https://ar.pinewood.one/memo-1.usdz"
          class="bg-[#70cd35] hover:bg-[#5fb82e] text-white font-bold py-3 px-8 rounded-full 
                shadow-lg transition-colors duration-300 cursor-pointer flex items-center">
          View our robot in AR
        </a>`,
      }}
    />
  );
}

// Define keyframes for scroll-based animation
// Format: [positionX, positionY, positionZ, rotationX, rotationY, rotationZ]
type KeyframeValues = [number, number, number, number, number, number];

// Add easing type to each keyframe
type KeyframeWithEasing = {
  values: KeyframeValues;
  easing?: "linear" | "easeInOut" | "easeIn" | "easeOut";
};

// Updated keyframes structure with easing options
const scrollKeyFrames: Record<number, KeyframeWithEasing> = {
  0: {
    values: [0, -2, 0, 0.3, 0, Math.PI * 0.75],
    easing: "linear",
  },
  1: {
    values: [0, -2, 0, 0, 0, Math.PI * 0.75],
    easing: "easeOut",
  },
};

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t * t, // Cubic easing for stronger effect
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3), // Cubic easing out
  easeInOut: (t: number) => {
    // More pronounced easeInOut function
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
};

// Helper function to interpolate between keyframes with easing
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
  if (progress === startKey) return scrollKeyFrames[startKey].values;
  if (progress === endKey) return scrollKeyFrames[endKey].values;

  // Calculate how far we are between the two keyframes (0 to 1)
  const segmentProgress = (progress - startKey) / (endKey - startKey);

  // Get the easing function (default to linear if not specified)
  const easingType = scrollKeyFrames[startKey].easing || "linear";
  const easingFunction = easingFunctions[easingType];

  // Apply easing to the progress
  const easedProgress = easingFunction(segmentProgress);

  // Interpolate between the two keyframes
  const startValues = scrollKeyFrames[startKey].values;
  const endValues = scrollKeyFrames[endKey].values;

  // Linear interpolation between each value with easing applied
  return startValues.map((start, i) => {
    return start + (endValues[i] - start) * easedProgress;
  });
}

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [keyframeValues, setKeyframeValues] = useState<number[]>([]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const loadingInterval = useRef<NodeJS.Timeout | null>(null);
  const dotsInterval = useRef<NodeJS.Timeout | null>(null);

  // Function to handle model load completion
  const handleModelLoaded = () => {
    setModelLoaded(true);
    // Set to 100% when loaded
    setLoadingPercentage(100);

    // Remove loading screen when model is loaded
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.style.opacity = "0";
      setTimeout(() => {
        loadingElement.style.display = "none";
      }, 500);

      // Clear intervals
      if (loadingInterval.current) clearInterval(loadingInterval.current);
      if (dotsInterval.current) clearInterval(dotsInterval.current);
    }
  };

  // Loading animation
  useEffect(() => {
    // Animate loading dots
    dotsInterval.current = setInterval(() => {
      const loadingDots = document.getElementById("loadingDots");
      if (loadingDots) {
        if (loadingDots.textContent === "...") loadingDots.textContent = "";
        else if (loadingDots.textContent === "") loadingDots.textContent = ".";
        else if (loadingDots.textContent === ".")
          loadingDots.textContent = "..";
        else if (loadingDots.textContent === "..")
          loadingDots.textContent = "...";
      }
    }, 100);

    // Simulate loading progress
    loadingInterval.current = setInterval(() => {
      setLoadingPercentage((prev) => {
        // Slow down as we approach 90%
        if (prev < 90) {
          return Math.min(prev + Math.random() * 10, 90);
        }
        return prev;
      });
    }, 200);

    return () => {
      if (loadingInterval.current) clearInterval(loadingInterval.current);
      if (dotsInterval.current) clearInterval(dotsInterval.current);
    };
  }, []);

  // Update the percentage display
  useEffect(() => {
    const percentElement = document.getElementById("percentLoadedValue");
    if (percentElement) {
      percentElement.textContent = Math.floor(loadingPercentage).toString();
    }
  }, [loadingPercentage]);

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

    // Handle anchor links for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener(
        "click",
        function (this: HTMLAnchorElement, e: Event) {
          e.preventDefault();
          const href = this.getAttribute("href");

          // Special case for "#" (top of page)
          if (href === "#") {
            lenis.scrollTo(0);
            return;
          }

          // For all other anchor links
          const targetId = href?.substring(1);
          if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
              lenis.scrollTo(targetElement);
            }
          }
        }
      );
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
      <div
        id="loading"
        className="fixed inset-0 z-51 flex flex-col gap-4 items-center justify-center bg-black text-white text-2xl w-screen h-screen top-0 left-0 right-0 bottom-0 transition-opacity duration-500"
      >
        <p className="text-4xl text-[#70cd35] font-bold">
          Loading<span id="loadingDots">...</span>
        </p>
        {/* Loading bar container */}
        <div className="w-64 h-4 bg-gray-800 rounded-full overflow-hidden">
          {/* // Loading bar fill - width controlled by percentage */}
          <div
            id="loadingBarFill"
            className="h-full bg-[#70cd35] transition-all duration-200 ease-out"
            style={{ width: `${loadingPercentage}%` }}
          ></div>
        </div>
        <p className="text-2xl text-white mt-2" id="percentLoaded">
          <span id="percentLoadedValue">0</span>% loaded
        </p>
        <p className="text-sm text-white mt-4 opacity-50">
          This could take a while, especially on slow connections.
        </p>
        <p className="text-xs text-white mt-4 opacity-50">
          Alternatively, skip loading the 3D model for a degraded experience but
          faster load time:{" "}
          <a
            className="underline cursor-pointer"
            onClick={() => handleModelLoaded()}
          >
            Skip
          </a>
        </p>
      </div>

      {/* Fixed background - stays in place regardless of scroll */}
      <div className="fixed inset-0 z-0">
        <ModelViewer
          modelUrl="https://cdn.pinewood.one/memo-1.glb"
          cameraPosition={[0, 0, 40]} // Move camera back to z=10
          cameraDistance={5} // Increased from 2.5 to 5 to make the model appear smaller/further away
          scrollProgress={scrollProgress}
          keyframeValues={keyframeValues}
          onLoaded={handleModelLoaded}
        />
      </div>

      {/* Navbar with high z-index to stay on top */}
      <Navbar />

      {/* Scrollable content */}
      <div className="relative py-20 text-center w-screen flex flex-col justify-center items-center">
        <div className="h-[89vh] w-screen flex flex-col">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: modelLoaded ? 1 : 0 }}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
              delay: modelLoaded ? 0.5 : 0,
            }}
            className="z-[-100] mx-10 h-[500px] flex items-center justify-center -mb-130"
          >
            <Image src="/PWRUP_icon.svg" alt="Image" width={500} height={500} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: modelLoaded ? 1 : 0 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: modelLoaded ? 0.75 : 0,
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
        <span className="-mt-8">
          <motion.p
            className="text-xl text-white z-10 opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.5, delay: 5 }}
          >
            Scroll to learn more...
          </motion.p>
        </span>
        <h1 className="text-4xl font-bold text-white z-10">
          We are <span className="text-[#70cd35]">PWRUP</span> from{" "}
          <a
            href="https://pinewood.edu/"
            className="text-[#70cd35] underline hover:text-[#5fb82e]"
          >
            Pinewood School
          </a>{" "}
          in Los Altos, California.
        </h1>
        <div className="h-screen">
          <p>This</p>
          <p>is</p>
          <p>Memo</p>
        </div>
        <h2 className="text-2xl text-white z-10 mt-8" id="features">
          Here&apos;s what Meemo can do!
        </h2>
        <div className="w-screen h-screen flex justify-center items-center text-align-left">
          <div className="w-1/2 text-align-left mr-[50%]">
            <h2
              className="text-align-left text-2xl md:text-6xl font-bold text-white z-10 ml-[5%] mb-2"
              style={{ textAlign: "left" }}
            >
              Coral Manipulation
            </h2>
            <p
              className="text-align-left text-lg md:text-2xl text-white z-10 ml-[5%]"
              style={{ textAlign: "left" }}
            >
              Memo receives coral from the coral station and can score on reef
              levels 2, 3, and 4.
            </p>
          </div>
        </div>
        <div className="w-screen h-screen flex justify-center items-center text-align-right">
          <div className="w-1/2 text-align-left ml-[50%]">
            <h2
              className="text-align-left text-2xl md:text-6xl font-bold text-white z-10 mr-[5%] mb-2"
              style={{ textAlign: "right" }}
            >
              Scoring
            </h2>
            <p
              className="text-align-left text-lg md:text-2xl text-white z-10 mr-[5%]"
              style={{ textAlign: "right" }}
            >
              Our robot has everything it needs to score points, from an
              intelligent auto-aligned coral scoring system that can score at
              all levels of the reef to the ability to score algae into the
              processor, our robot is flexible and powerful.
            </p>
          </div>
        </div>
        <h2 className="text-2xl text-white z-10 mt-8" id="about">
          Here&apos;s a bit about us:
        </h2>
        <div className="w-screen py-16 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          <Box
            title="About Us"
            description="This is the about section."
            color="#56B97F"
            num={1}
            extendedDescription="This is the extended description for the about section."
            image="/PWRUP_icon.svg"
          />
          <Box
            title="Team"
            description="Meet our talented team members."
            color="#3478C6"
            num={2}
            extendedDescription="This is the extended description for the team section. It can be very long.\n\nThis is a new line."
            image="/PWRUP_icon.svg"
          />
          <Box
            title="Sponsors"
            description="Learn about our amazing sponsors."
            color="#F2994A"
            num={3}
            extendedDescription="This is the extended description for the sponsors section."
            image="/PWRUP_icon.svg"
          />
        </div>
      </div>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20">
        <ARButton />
      </div>
    </main>
  );
}
