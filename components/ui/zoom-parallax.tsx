"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ImageItem {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: ImageItem[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[220vh] md:h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,252,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(56,217,245,0.12),transparent_22%),linear-gradient(180deg,rgba(8,8,16,0.12),rgba(8,8,16,0.86))]" />
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={`${src}-${index}`}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${
                index === 1 ? "[&>div]:!-top-[26vh] [&>div]:!left-[7vw] [&>div]:!h-[28vh] [&>div]:!w-[34vw]" : ""
              } ${
                index === 2 ? "[&>div]:!-top-[8vh] [&>div]:!-left-[23vw] [&>div]:!h-[42vh] [&>div]:!w-[20vw]" : ""
              } ${
                index === 3 ? "[&>div]:!left-[28vw] [&>div]:!h-[24vh] [&>div]:!w-[24vw]" : ""
              } ${
                index === 4 ? "[&>div]:!top-[25vh] [&>div]:!left-[7vw] [&>div]:!h-[24vh] [&>div]:!w-[20vw]" : ""
              } ${
                index === 5 ? "[&>div]:!top-[28vh] [&>div]:!-left-[20vw] [&>div]:!h-[24vh] [&>div]:!w-[30vw]" : ""
              } ${
                index === 6 ? "[&>div]:!top-[20vh] [&>div]:!left-[24vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]" : ""
              }`}
            >
              <div className="relative h-[24vh] w-[24vw] overflow-hidden rounded-[28px] border border-white/10 bg-black/40 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src || "/placeholder.svg"}
                  alt={alt || `Parallax image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.42),transparent_55%)]" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
