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
  visual?: ReactNode;
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
  visual,
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
    <section className="relative overflow-hidden px-5 pb-18 pt-14 md:px-8 lg:px-10 lg:pb-24 lg:pt-20">
      <div className="absolute inset-0 z-0 opacity-70">
        <LiquidMetal
          {...liquidMetalPresets[2]}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,252,0.24),transparent_28%),radial-gradient(circle_at_78%_20%,rgba(56,217,245,0.16),transparent_24%),linear-gradient(180deg,rgba(8,8,16,0.18),rgba(8,8,16,0.84))]" />

      <motion.div
        className="relative z-10 mx-auto grid max-w-[1360px] items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
        variants={containerVariants as never}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-7">
          {badge && (
            <motion.div variants={itemVariants as never}>
              <Badge className="rounded-full border border-[#7c5cfc]/30 bg-[#7c5cfc]/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d7cfff] backdrop-blur-md">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#38d9f5] shadow-[0_0_12px_#38d9f5]" />
                {badge}
              </Badge>
            </motion.div>
          )}

          <motion.div variants={itemVariants as never} className="space-y-5">
            <h1 className="max-w-[9ch] text-5xl font-extrabold leading-[0.95] tracking-[-0.08em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
              {title}
            </h1>
            <p className="max-w-[42ch] text-base leading-8 text-white/68 sm:text-lg">
              {subtitle}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants as never}
            className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
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
            <motion.p variants={itemVariants as never} className="text-sm text-white/46">
              {meta}
            </motion.p>
          )}

          {stats.length > 0 && (
            <motion.div
              variants={itemVariants as never}
              className="grid max-w-xl grid-cols-3 gap-4 border-t border-white/8 pt-6"
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
        </div>

        <motion.div variants={itemVariants as never} className="relative">
          <div className="pointer-events-none absolute left-[4%] top-[8%] z-0 h-[82%] w-[86%] rounded-full bg-[radial-gradient(circle,rgba(124,92,252,0.34),rgba(232,79,188,0.12),transparent_72%)] blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-[12%] z-0 h-[58%] w-[44%] rounded-full bg-[radial-gradient(circle,rgba(56,217,245,0.2),transparent_70%)] blur-3xl" />

          {visual ? (
            <div className="relative z-10">{visual}</div>
          ) : (
            <Card className="relative z-10 overflow-hidden rounded-[28px] border border-white/10 bg-white/6 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <div className="rounded-[22px] border border-white/8 bg-[#090910] p-10 text-center text-white/70">
                Add a custom visual panel here.
              </div>
            </Card>
          )}
        </motion.div>

        {features.length > 0 && (
          <motion.div variants={itemVariants as never} className="lg:col-span-2">
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
      </motion.div>
    </section>
  );
}
