"use client";

import type { ReactNode } from "react";

import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HeroStat {
  label: string;
  value: string;
}

interface LiquidMetalHeroProps {
  badge?: string;
  title: ReactNode;
  subtitle: ReactNode;
  primaryCtaLabel: string;
  secondaryCtaLabel?: string;
  onPrimaryCtaClick: () => void;
  onSecondaryCtaClick?: () => void;
  features?: string[];
  stats?: HeroStat[];
  meta?: string;
}

export default function LiquidMetalHero({
  badge,
  title,
  subtitle,
  primaryCtaLabel,
  secondaryCtaLabel,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  features = [],
  stats = [],
  meta,
}: LiquidMetalHeroProps) {
  const containerVariants: Record<string, unknown> = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: Record<string, unknown> = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section className="relative overflow-hidden bg-transparent px-5 pb-18 pt-14 md:px-8 lg:px-10 lg:pb-24 lg:pt-20">
      <div className="absolute inset-0 z-0 opacity-30">
        <LiquidMetal
          {...liquidMetalPresets[2]}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,120,214,0.34),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(103,232,249,0.14),transparent_24%),radial-gradient(circle_at_50%_56%,rgba(192,132,252,0.12),transparent_30%),linear-gradient(180deg,rgba(44,16,46,0.06),rgba(14,8,18,0.16))]" />

      <motion.div
        className="relative z-10 mx-auto max-w-[1100px]"
        variants={containerVariants as never}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-7 text-center">
          {badge && (
            <motion.div variants={itemVariants as never} className="flex justify-center">
              <Badge className="rounded-full border border-[#7c5cfc]/30 bg-[#7c5cfc]/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d7cfff] backdrop-blur-md">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#38d9f5] shadow-[0_0_12px_#38d9f5]" />
                {badge}
              </Badge>
            </motion.div>
          )}

          <motion.div variants={itemVariants as never} className="space-y-5">
            <h1 className="mx-auto max-w-[9ch] text-5xl font-extrabold leading-[0.95] tracking-[-0.08em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
              {title}
            </h1>
            <p className="mx-auto max-w-[42ch] text-base leading-8 text-white/72 sm:text-lg">
              {subtitle}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants as never}
            className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:items-center"
          >
            <Button
              onClick={onPrimaryCtaClick}
              size="lg"
              className="h-auto rounded-full border-0 bg-[linear-gradient(135deg,#7c5cfc,#e84fbc,#38d9f5)] px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(124,92,252,0.35)] hover:brightness-110"
            >
              {primaryCtaLabel}
            </Button>

            {secondaryCtaLabel && onSecondaryCtaClick && (
              <Button
                onClick={onSecondaryCtaClick}
                variant="outline"
                size="lg"
                className="h-auto rounded-full border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/10"
              >
                {secondaryCtaLabel}
              </Button>
            )}
          </motion.div>

          {meta && (
            <motion.p variants={itemVariants as never} className="text-sm text-white/52">
              {meta}
            </motion.p>
          )}

          {stats.length > 0 && (
            <motion.div
              variants={itemVariants as never}
              className="mx-auto grid max-w-xl grid-cols-3 gap-4 border-t border-white/8 pt-6"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="bg-[linear-gradient(135deg,#a78bff,#38d9f5)] bg-clip-text font-['Syne',sans-serif] text-2xl font-extrabold leading-none text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          {features.length > 0 && (
            <motion.div variants={itemVariants as never}>
              <Card className="rounded-[26px] border border-white/12 bg-white/7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="grid gap-3 px-6 py-6 md:grid-cols-3 md:px-8">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-2xl border border-white/8 bg-black/18 px-4 py-4 text-center text-sm font-medium text-white/88"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
