"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_SHIFT = 6; // px, per the motion rules

type CardProps = {
  className: string;
  depth: number; // 0..1 share of MAX_SHIFT
  px: MotionValue<number>;
  py: MotionValue<number>;
  delay: number;
  z?: number;
  children: React.ReactNode;
};

function FloatingCard({ className, depth, px, py, delay, z = 0, children }: CardProps) {
  const x = useTransform(px, (v) => v * MAX_SHIFT * depth);
  const y = useTransform(py, (v) => v * MAX_SHIFT * depth);
  return (
    <motion.div
      style={{ x, y, z }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className={cn(
        "absolute flex flex-col justify-between rounded-card p-[6cqw]",
        "shadow-[0_50px_90px_-30px_rgba(0,0,0,0.85),0_18px_36px_-18px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function HeroCardStack() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 });
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanHover(mq.matches && !reduce.matches);
    update();
    mq.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!canHover) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      // Normalise pointer position to -1..1 across the viewport.
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [canHover, rawX, rawY]);

  return (
    <div
      aria-label="Aksh Finserv in numbers"
      role="group"
      className="relative mx-auto w-full max-w-[560px] [container-type:inline-size] [perspective:1800px]"
    >
      <div className="relative aspect-[1/1.02] w-full [transform-style:preserve-3d] [transform:rotateY(-8deg)_rotateX(5deg)_rotateZ(-0.5deg)]">
        {/* Card 1: charcoal */}
        <FloatingCard
          px={px}
          py={py}
          depth={0.5}
          delay={0.05}
          className="left-0 top-[2%] h-[40%] w-[64%] border border-line bg-elevated"
        >
          <div className="flex items-start justify-between">
            <span className="text-[3.1cqw] text-ink-secondary">Clients</span>
            <span className="text-[2.6cqw] tracking-[0.2em] text-ink-muted">EST. 1998</span>
          </div>
          <p className="flex items-baseline gap-[2cqw]">
            <span className="display-num text-[13cqw] text-ink">1,500</span>
            <span className="font-display text-[4.6cqw] font-light text-ink-secondary">families</span>
          </p>
        </FloatingCard>

        {/* Card 3: off-white, sits behind the gold card */}
        <FloatingCard
          px={px}
          py={py}
          depth={0.75}
          delay={0.15}
          z={20}
          className="bottom-[2%] left-[6%] h-[34%] w-[52%] bg-surface-light text-ink-dark"
        >
          <div className="flex items-start justify-between">
            <span className="text-[3.1cqw] text-[#5c574f]">Recognition</span>
            <span className="grid size-[7cqw] place-items-center rounded-full bg-[#14110c]/[0.06]">
              <ArrowUpRight className="size-[3.4cqw]" strokeWidth={1.5} />
            </span>
          </div>
          <p className="flex items-baseline gap-[2cqw]">
            <span className="display-num text-[11.5cqw]">100+</span>
            <span className="font-display text-[4.4cqw] font-light text-[#5c574f]">awards</span>
          </p>
        </FloatingCard>

        {/* Card 2: gold, the standout */}
        <FloatingCard
          px={px}
          py={py}
          depth={1}
          delay={0.1}
          className="right-0 top-[33%] h-[44%] w-[48%] bg-gold text-ink-dark"
          z={60}
        >
          <span className="text-[3.4cqw] leading-tight text-[#3d2f1a]">In practice</span>
          <p className="flex flex-col">
            <span className="display-num text-[19cqw]">28</span>
            <span className="mt-[1.5cqw] font-display text-[4.6cqw] font-light leading-none text-[#3d2f1a]">
              years
            </span>
          </p>
        </FloatingCard>
      </div>
    </div>
  );
}
