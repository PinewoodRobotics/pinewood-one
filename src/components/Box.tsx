"use client";

import { motion } from "framer-motion";

// usage:
// <Box title="About" description="This is the about section." color="#56B97F" />

export default function Box({ title, description, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 rounded-lg bg-black/70 backdrop-blur-lg w-full h-full flex flex-col justify-center items-center m-12 min-h-[300px]"
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-lg">{description}</p>
    </motion.div>
  );
}
