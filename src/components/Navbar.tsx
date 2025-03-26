"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile and handle scroll events
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        backdropFilter: scrolled ? "blur(8px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(8px)" : "blur(0px)",
        transition:
          "backdrop-filter 0.2s ease-in-out, -webkit-backdrop-filter 0.2s ease-in-out",
      }}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="flex justify-between items-center p-4">
        <motion.div
          className="text-2xl font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Pinewood One
        </motion.div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="space-x-6">
            {["About", "Team", "Sponsors"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-blue-400 transition-colors"
                variants={linkVariants}
                custom={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <motion.button
            className="p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <div
              className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300"
              style={{
                transform: isMenuOpen ? "rotate(45deg) translateY(6px)" : "",
              }}
            />
            <div
              className="w-6 h-0.5 bg-white mb-1.5 transition-all duration-300"
              style={{ opacity: isMenuOpen ? 0 : 1 }}
            />
            <div
              className="w-6 h-0.5 bg-white transition-all duration-300"
              style={{
                transform: isMenuOpen ? "rotate(-45deg) translateY(-6px)" : "",
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
            className="flex flex-col space-y-4 bg-black/70 p-4 rounded-lg"
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {["About", "Team", "Sponsors"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block py-2 hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
