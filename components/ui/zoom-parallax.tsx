"use client";

import { motion } from "framer-motion";

interface ImageItem {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: ImageItem[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  return (
    <div className="relative h-[120vh] md:h-[140vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt }, index) => {
          return (
            <motion.div
              key={`${src}-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.04, ease: "easeOut" }}
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
              <div className="relative h-[24vh] w-[24vw] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
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
