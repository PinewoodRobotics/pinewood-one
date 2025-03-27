"use client";

import { useState, Fragment, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface BoxProps {
  title: string;
  description: string;
  color?: string;
  num?: number;
  extendedDescription?: string;
  image?: string;
}

export default function Box({
  title,
  description,
  color,
  num = 0,
  extendedDescription = "",
  image,
}: BoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Function to render text with line breaks
  const renderWithLineBreaks = (text: string) => {
    return text.split("\n").map((line, i) => (
      <Fragment key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </Fragment>
    ));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: isMobile ? 0 : num * 0.2,
        }}
        viewport={{ once: false, margin: "-100px" }}
        className="p-4 rounded-lg bg-black/70 backdrop-blur-lg w-full h-full flex flex-col justify-center items-center m-12 min-h-[300px] cursor-pointer"
        style={{
          borderTop: `${isHovered ? 8 : 4}px solid ${color || "#70cd35"}`,
          transform: `translateY(${isHovered ? -5 : 0}px)`,
          transition: "border-top-width 0.2s, transform 0.2s",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-lg">{description}</p>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-black/90 p-8 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              style={{
                borderTop: `4px solid ${color || "#70cd35"}`,
                minHeight: "400px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setIsModalOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {image && (
                <div className="mb-6 flex justify-center">
                  <Image
                    src={image}
                    alt={title}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
              )}

              <h2 className="text-3xl font-bold mb-4 text-white">{title}</h2>
              <div className="text-lg text-gray-200">
                {renderWithLineBreaks(extendedDescription || description)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
