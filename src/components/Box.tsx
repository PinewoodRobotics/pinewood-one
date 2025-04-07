"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface BoxProps {
  title: string;
  description: string;
  color?: string;
  extendedDescription?: string;
  image?: string;
}

export default function Box({
  title,
  description,
  color,
  extendedDescription = "",
  image,
}: BoxProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.1,
        }}
        viewport={{ once: false, margin: "-100px" }}
        className="p-4 rounded-lg bg-black/70 backdrop-blur-lg w-full h-full flex flex-col justify-center items-center m-12 min-h-[300px] cursor-pointer"
        style={{
          // boxShadow: !isModalOpen ? `0 0 8px ${color}` : `0 0 0px ${color}`,
          border: !isModalOpen ? `2px solid ${color}` : "none",
        }}
        whileHover={{ border: `4px solid ${color}` }}
        onClick={() => setIsModalOpen(true)}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: color }}>
          {title}
        </h2>
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
              className="absolute inset-0 bg-black/30"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="relative bg-black/90 p-8 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              style={{
                minHeight: "400px",
                border: `2px solid ${color}`,
              }}
            >
              <motion.button
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => setIsModalOpen(false)}
                initial={{ transform: "rotate(0deg)", color: color }}
                whileHover={{ transform: "rotate(90deg)", color: "white" }}
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
              </motion.button>

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

              <h2 className="text-3xl font-bold mb-4" style={{ color: color }}>
                {title}
              </h2>
              <div className="text-lg text-gray-200">
                <p
                  dangerouslySetInnerHTML={{
                    __html: extendedDescription,
                  }}
                ></p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
