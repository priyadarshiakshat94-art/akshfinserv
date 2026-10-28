"use client";

import { motion } from "framer-motion";

// Scroll fade per the motion rules: opacity only, 400ms ease-out, once.
export function FadeIn({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
    >
      {children}
    </Tag>
  );
}
