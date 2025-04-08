"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLinksDropdownOpen, setIsLinksDropdownOpen] = useState(false);
  const linksDropdownRef = useRef<HTMLDivElement>(null);

  // Use a ref to track if we're in the process of scrolling
  const isScrollingRef = useRef(false);
  // Use a ref to track the current scroll position
  const scrollPositionRef = useRef(0);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        linksDropdownRef.current &&
        !linksDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLinksDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if device is mobile and handle scroll events
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      // Only update state if the scrolled status would change
      const isCurrentlyScrolled = window.scrollY > 20;
      if (isCurrentlyScrolled !== scrolled) {
        setScrolled(isCurrentlyScrolled);
      }

      // Store current scroll position
      scrollPositionRef.current = window.scrollY;

      // Update scroll percentage for debug display
      const scrollElement = document.getElementById("scrollPercentage");
      if (scrollElement) {
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress =
          scrollHeight > 0
            ? (window.scrollY / scrollHeight).toFixed(3)
            : "0.000";
        scrollElement.textContent = scrollProgress;
      }
    };

    // Initial checks
    checkMobile();

    // Only set initial scroll state once
    const initialScrolled = window.scrollY > 20;
    if (scrolled !== initialScrolled) {
      setScrolled(initialScrolled);
    }

    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, [scrolled]); // Add scrolled as a dependency

  // Function to handle smooth scrolling
  const handleSmoothScroll = (id: string) => {
    // Prevent recursive calls
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    console.log("Attempting to scroll to:", id);

    // For scrolling to top
    if (id === "") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
      return;
    }

    // For scrolling to sections
    const element = document.getElementById(id);
    console.log("Found element:", element);

    if (element) {
      const targetPosition =
        element.getBoundingClientRect().top + window.scrollY;
      console.log("Scrolling to position:", targetPosition);

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    } else {
      console.error("Element not found:", id);
    }

    // Reset the scrolling flag after a short delay
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 100);
  };

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i, duration: 0.3 },
    }),
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300`}
      style={{
        backdropFilter: isMobile && isMenuOpen ? "blur(8px)" : "blur(0px)",
        WebkitBackdropFilter:
          isMobile && isMenuOpen ? "blur(8px)" : "blur(0px)",
        transition:
          "backdrop-filter 0.2s ease-in-out, -webkit-backdrop-filter 0.2s ease-in-out",
      }}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="flex justify-between items-center p-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleSmoothScroll("");
          }}
        >
          <motion.div
            className="text-2xl font-bold z-10 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image src="/PWRUP_text.svg" alt="Logo" width={100} height={100} />
          </motion.div>
        </a>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="space-x-6 flex items-center">
            {/* Internal navigation links */}
            {[
              { id: "features", text: "Features" },
              { id: "about", text: "About" },
            ].map((item, i) => (
              <motion.a
                key={item.text}
                href={`#${item.id}`}
                className="hover:text-[#70cd35] transition-colors"
                variants={linkVariants}
                custom={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll(item.id);
                }}
              >
                {item.text}
              </motion.a>
            ))}

            {/* Links Dropdown */}
            <div className="relative" ref={linksDropdownRef}>
              <motion.button
                className="flex items-center hover:text-[#70cd35] transition-colors cursor-pointer"
                onClick={() => setIsLinksDropdownOpen(!isLinksDropdownOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                variants={linkVariants}
                custom={2}
              >
                Links
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`ml-1 h-4 w-4 transition-transform ${
                    isLinksDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.button>

              {/* <motion.a
                href="#"
                className="hover:text-[#70cd35] transition-colors"
                variants={linkVariants}
                custom={3}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                id="debug"
              >
                Scrolled: <span id="scrollPercentage">0.000</span>/1
              </motion.a> */}

              <AnimatePresence>
                {isLinksDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md rounded-md shadow-lg py-1 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      borderTop: "2px solid #70cd35",
                    }}
                  >
                    <a
                      href="https://github.com/pinewoodrobotics"
                      className="block px-4 py-2 hover:bg-black/50 hover:text-[#70cd35] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://www.thebluealliance.com/team/4765"
                      className="block px-4 py-2 hover:bg-black/50 hover:text-[#70cd35] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      The Blue Alliance
                    </a>
                    <a
                      href="https://www.youtube.com/@pinewoodrobotics"
                      className="block px-4 py-2 hover:bg-black/50 hover:text-[#70cd35] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      YouTube
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <motion.button
            className="p-2 focus:outline-none cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            animate={{
              x: isMenuOpen ? 10 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300" // Lime color for hamburger
              style={{
                transform: isMenuOpen ? "rotate(45deg) translateY(11px)" : "",
              }}
            />
            <div
              className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300" // Lime color for hamburger
              style={{
                opacity: isMenuOpen ? 0 : 1,
                transform: isMenuOpen ? "translateX(10px)" : "translateX(0)",
              }}
            />
            <div
              className="w-6 h-0.5 bg-white transition-all duration-300" // Lime color for hamburger
              style={{
                transform: isMenuOpen ? "rotate(-45deg) translateY(-11px)" : "",
              }}
            />
          </motion.button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <motion.div
          className="px-4 pb-4 overflow-hidden"
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={mobileMenuVariants}
        >
          <div
            className="flex flex-col bg-black/70 p-4 rounded-lg"
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <div className="flex flex-col space-y-3 items-end">
              <motion.a
                href="#features"
                className="block py-2 hover:text-[#70cd35] transition-colors text-right text-xl font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Mobile Features clicked");
                  handleSmoothScroll("features");
                  setIsMenuOpen(false);
                }}
                whileHover={{ x: -10 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                Features
              </motion.a>
              <motion.a
                href="#about"
                className="block py-2 hover:text-[#70cd35] transition-colors text-right text-xl font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Mobile About clicked");
                  handleSmoothScroll("about");
                  setIsMenuOpen(false);
                }}
                whileHover={{ x: -10 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                About
              </motion.a>
            </div>

            {/* External Links Section */}
            <div className="mt-4 pt-3 border-t border-gray-700 w-full">
              <h3 className="text-[#70cd35] my-4 font-bold text-3xl text-right">
                Links
              </h3>
              <div className="flex flex-col space-y-3 items-end">
                <motion.a
                  href="https://github.com/pinewoodrobotics"
                  className="block py-2 hover:text-[#70cd35] transition-colors text-right text-xl font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: -10 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  GitHub
                </motion.a>
                <motion.a
                  href="https://www.thebluealliance.com/team/4765"
                  className="block py-2 hover:text-[#70cd35] transition-colors text-right text-xl font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: -10 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  The Blue Alliance
                </motion.a>
                <motion.a
                  href="https://www.youtube.com/@pinewoodrobotics"
                  className="block py-2 hover:text-[#70cd35] transition-colors text-right text-xl font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: -10 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  YouTube
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
