"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

// Outlined "AKSH FINSERV" in General Sans, generated with the logo files (Desktop/Aksh Finserv Logo).
const WORDMARK =
  "M58.7 0H66.6L38.8 -71.8H30.6L2.7 0H10.1L17.7 -19.9H51.2ZM34.5 -63.8 48.8 -26H20ZM106.9 0V-33.7L140.9 0H150.6L114.6 -36L149.6 -71.8H140.9L106.9 -37.2V-71.8H99.4V0ZM233.3 -19.9C233.3 -30.7 226.4 -35.7 214.3 -38.2L205.2 -40.1C197.2 -41.7 190 -44.3 190 -52.8C190 -60 195.9 -66.7 206.9 -66.7C217.2 -66.7 224.2 -59.8 224.7 -50.3H232.4C231.6 -64 220.8 -72.8 206.8 -72.8C192.5 -72.8 182.4 -63.9 182.4 -52.4C182.4 -39.9 192.4 -35.5 201.9 -33.6L211 -31.8C221.2 -29.7 225.4 -26.3 225.4 -18.9C225.4 -10.3 217.4 -5.1 207.2 -5.1C194.8 -5.1 188.4 -11.7 187.7 -21.9H180.1C180.8 -8.3 190.6 1 207.3 1C224 1 233.3 -8.5 233.3 -19.9ZM276.8 0V-33.8H317.6V0H325.1V-71.8H317.6V-40.3H276.8V-71.8H269.3V0ZM413.7 0V-30.8H442.7V-37.3H413.7V-65.3H447.4V-71.8H406.2V0ZM488 0V-71.8H480.5V0ZM575.1 0H583.1V-71.8H576V-11.4L534.5 -71.8H526.2V0H533.2V-61.2ZM671.6 -19.9C671.6 -30.7 664.7 -35.7 652.6 -38.2L643.5 -40.1C635.5 -41.7 628.3 -44.3 628.3 -52.8C628.3 -60 634.2 -66.7 645.2 -66.7C655.5 -66.7 662.5 -59.8 663 -50.3H670.7C669.9 -64 659.1 -72.8 645.1 -72.8C630.8 -72.8 620.7 -63.9 620.7 -52.4C620.7 -39.9 630.7 -35.5 640.2 -33.6L649.3 -31.8C659.5 -29.7 663.7 -26.3 663.7 -18.9C663.7 -10.3 655.7 -5.1 645.5 -5.1C633.1 -5.1 626.7 -11.7 626 -21.9H618.4C619.1 -8.3 628.9 1 645.6 1C662.3 1 671.6 -8.5 671.6 -19.9ZM750.7 -6.5H715.1V-33.8H747V-40.3H715.1V-65.3H750V-71.8H707.6V0H750.7ZM794.1 0V-28.4H810.5L829.8 0H838.8L818.5 -29.3C829.8 -31.2 836.9 -39.3 836.9 -50.1C836.9 -63.9 827.4 -71.8 812.2 -71.8H786.6V0ZM794.1 -65.5H811.6C822.6 -65.5 829.4 -60.1 829.4 -50.1C829.4 -40.1 822.6 -34.7 811.6 -34.7H794.1ZM928.3 -71.8H920.8L897.4 -8.6L874.2 -71.8H866.4L893.2 0H901.4Z";

const EASE = [0.22, 1, 0.36, 1] as const;

// Each stroke grows from where a pen would start it; the gold crossbar lands last.
const grow = (origin: string, delay: number): Variants => ({
  hidden: { scaleX: origin.includes("left") ? 0 : 1, scaleY: origin.includes("bottom") ? 0 : 1, opacity: 0 },
  shown: { scaleX: 1, scaleY: 1, opacity: 1, transition: { duration: 0.7, delay, ease: EASE } },
});

const crossbar: Variants = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 0.6, delay: 0.95, ease: EASE } },
  hover: { scaleX: [0, 1], transition: { duration: 0.55, ease: EASE } },
};

const word: Variants = {
  hidden: { opacity: 0, x: -12 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.6, ease: EASE } },
  hover: { x: 4, transition: { duration: 0.4, ease: EASE } },
};

// Framer owns transform-origin on animated SVG, so set it through originX / originY.
const box = (origin: string) => ({
  transformBox: "fill-box" as const,
  originX: origin.includes("left") ? 0 : origin.includes("right") ? 1 : 0.5,
  originY: origin.includes("bottom") ? 1 : 0.5,
});

/**
 * Animated AF logo for the header. Draws itself once on load; on hover the gold
 * crossbar redraws and the name eases right. Static when reduced motion is on.
 */
export function BrandLogo({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const initial = reduce ? false : "hidden";

  return (
    <motion.svg
      viewBox="0 0 1224 222"
      role="img"
      aria-label="Aksh Finserv"
      className={className}
      initial={initial}
      animate="shown"
      whileHover={reduce ? undefined : "hover"}
    >
      <g transform="translate(-44,-40)" fill="currentColor">
        <motion.polygon points="58,260 70.6,260 182.6,40 170,40" variants={grow("left bottom", 0.15)} style={box("left bottom")} />
        <motion.rect x="44" y="254" width="34" height="6" variants={grow("left center", 0.45)} style={box("left center")} />
        <motion.rect x="170" y="40" width="16" height="220" variants={grow("center bottom", 0)} style={box("center bottom")} />
        <motion.rect x="160" y="254" width="36" height="6" variants={grow("left center", 0.3)} style={box("left center")} />
        <motion.path
          d="M186,40 L266,40 L266,40 L272,40 L272,66 C270,55 263,52 252,46 L186,46 Z"
          variants={grow("left center", 0.55)}
          style={box("left center")}
        />
        <motion.path
          d="M186,146 L249.4,146 L249.4,160 C243,154 239,154 232,152 L186,152 Z"
          variants={grow("left center", 0.7)}
          style={box("left center")}
        />
        <motion.polygon
          points="94.1,190 170,190 170,196 92.8,196"
          fill="#C9A36B"
          variants={crossbar}
          style={box("right center")}
        />
      </g>
      <g transform="translate(290,146)">
        {/* Animate an inner group: Framer's style transform would replace an SVG transform attribute. */}
        <motion.g variants={word}>
          <path fill="currentColor" d={WORDMARK} />
        </motion.g>
      </g>
    </motion.svg>
  );
}
