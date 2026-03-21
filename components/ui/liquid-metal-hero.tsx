"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

interface LiquidMetalHeroProps {
  title: ReactNode;
}

export default function LiquidMetalHero({
  title,
}: LiquidMetalHeroProps) {
  return (
    <section className="relative flex min-h-[84vh] items-center justify-center overflow-hidden px-6 pb-10 pt-24 md:px-10 lg:min-h-[92vh]">
      <motion.div
        className="relative z-10 mx-auto max-w-[1180px] text-center"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="mx-auto max-w-[8.5ch] text-[clamp(4.5rem,12vw,11rem)] font-extrabold leading-[0.88] tracking-[-0.09em] text-white [text-wrap:balance]">
          {title}
        </h1>
      </motion.div>
    </section>
  );
}
