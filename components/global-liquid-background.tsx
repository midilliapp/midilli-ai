"use client";

import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function GlobalLiquidBackground() {
  const { scrollYProgress } = useScroll();
  const objectY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 220]), {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  });
  const objectX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 48]), {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  });
  const objectRotate = useSpring(useTransform(scrollYProgress, [0, 1], [22, 30]), {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 opacity-28">
        <LiquidMetal
          {...liquidMetalPresets[2]}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,120,214,0.38),transparent_26%),radial-gradient(circle_at_82%_16%,rgba(103,232,249,0.12),transparent_22%),radial-gradient(circle_at_50%_54%,rgba(168,85,247,0.14),transparent_30%),linear-gradient(180deg,#1a1220_0%,#110d18_46%,#09070f_100%)]" />

      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[18vh] h-[38vw] max-h-[620px] min-h-[320px] w-[38vw] max-w-[620px] min-w-[320px] -translate-x-1/2 rounded-[64px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] shadow-[0_40px_140px_rgba(0,0,0,0.48)] backdrop-blur-[10px]"
        style={{ x: objectX, y: objectY, rotate: objectRotate }}
      >
        <div className="absolute inset-[1px] rounded-[63px] bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01)_40%,rgba(6,5,13,0.74))]" />
        <div className="absolute inset-0 rounded-[64px] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" />
        <div className="absolute -left-[12%] top-[22%] h-[26%] w-[26%] rounded-full bg-[rgba(255,120,214,0.24)] blur-3xl" />
        <div className="absolute -right-[8%] bottom-[18%] h-[24%] w-[24%] rounded-full bg-[rgba(103,232,249,0.14)] blur-3xl" />
      </motion.div>
    </div>
  );
}
