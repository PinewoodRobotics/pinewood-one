"use client";

import { useState, useEffect } from "react";
import { motion, MotionValue } from "framer-motion";
import Link from "next/link";

interface NavbarProps {
  scrollProgress?: MotionValue<number>;
}

export function Navbar({ scrollProgress }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle navbar background opacity based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Team Name */}
        <Link href="/" className="text-2xl font-bold text-white">
          <span className="text-red-500">FRC</span> 4765
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-10">
          <NavItem href="#about">About</NavItem>
          <NavItem href="#team">Team</NavItem>
          <NavItem href="#robots">Robots</NavItem>
          <NavItem href="#sponsors">Sponsors</NavItem>
          <NavItem href="#contact">Contact</NavItem>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md py-4 px-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4">
            <MobileNavItem href="#about" onClick={() => setIsOpen(false)}>
              About
            </MobileNavItem>
            <MobileNavItem href="#team" onClick={() => setIsOpen(false)}>
              Team
            </MobileNavItem>
            <MobileNavItem href="#robots" onClick={() => setIsOpen(false)}>
              Robots
            </MobileNavItem>
            <MobileNavItem href="#sponsors" onClick={() => setIsOpen(false)}>
              Sponsors
            </MobileNavItem>
            <MobileNavItem href="#contact" onClick={() => setIsOpen(false)}>
              Contact
            </MobileNavItem>
          </div>
        </motion.div>
      )}

      {/* Progress indicator */}
      {scrollProgress && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"
          style={{ scaleX: scrollProgress, transformOrigin: "0%" }}
        />
      )}
    </motion.nav>
  );
}

function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors duration-300 uppercase text-sm font-semibold tracking-wider"
    >
      {children}
    </Link>
  );
}

function MobileNavItem({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white py-2 text-lg font-semibold uppercase tracking-wider"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
