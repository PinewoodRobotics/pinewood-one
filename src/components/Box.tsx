"use client";

import { motion } from "framer-motion";

interface BoxProps {
  title: string;
  description: string;
  color?: string;
  num?: number;
}

export default function Box({ title, description, color, num = 0 }: BoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay: num * 0.2, // Delay based on num prop
      }}
      className="p-4 rounded-lg bg-black/70 backdrop-blur-lg w-full h-full flex flex-col justify-center items-center m-12 min-h-[300px]"
      style={{ borderTop: `4px solid ${color || "#70cd35"}` }}
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-lg">{description}</p>
    </motion.div>
  );
}
