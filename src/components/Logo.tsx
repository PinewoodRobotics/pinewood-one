"use client";

import { motion, MotionValue } from "framer-motion";
import Image from "next/image";

interface LogoProps {
  opacity?: MotionValue<number>;
}

export default function Logo({ opacity }: LogoProps = {}) {
  return (
    <motion.div
      style={{
        scale: 1.2,
        opacity: opacity,
      }}
      className="text-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-white text-8xl font-extrabold tracking-tighter drop-shadow-[0_0_15px_rgba(0,0,0,0.7)]"
      >
        <Image
          src="/PWR_UP.svg"
          alt="Pinewood Robotics"
          width={400}
          height={0}
          className="mx-auto"
        />
      </motion.h1>
    </motion.div>
  );
}
