"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import "./ghost-404-page.css";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.43, 0.13, 0.23, 0.96], delayChildren: 0.08, staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.43, 0.13, 0.23, 0.96] } },
};

const numberVariants: Variants = {
  hidden: (direction: number) => ({ opacity: 0, x: direction * 28, y: 12, rotate: direction * 4 }),
  visible: { opacity: 1, x: 0, y: 0, rotate: 0, transition: { duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] } },
};

const ghostVariants: Variants = {
  hidden: { scale: 0.82, opacity: 0, y: 12, rotate: -5 },
  visible: { scale: 1, opacity: 1, y: 0, rotate: 0, transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } },
  hover: {
    scale: 1.08,
    y: -8,
    rotate: [0, -5, 5, -5, 0],
    transition: { duration: 0.7, ease: "easeInOut", rotate: { duration: 1.8, ease: "linear", repeat: Infinity, repeatType: "reverse" } },
  },
  floating: {
    y: [-5, 5],
    transition: { y: { duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" } },
  },
};

export function NotFound() {
  return (
    <main className="sqlwhale-not-found">
      <div aria-hidden="true" className="sqlwhale-not-found__glow sqlwhale-not-found__glow--blue" />
      <div aria-hidden="true" className="sqlwhale-not-found__glow sqlwhale-not-found__glow--cyan" />

      <motion.div
        className="sqlwhale-not-found__content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="sqlwhale-not-found__eyebrow">
          <span className="sqlwhale-not-found__dot" />
          SQLWHALE · ERROR 404
        </motion.div>

        <div className="sqlwhale-not-found__digits">
          <motion.span custom={-1} variants={numberVariants} className="sqlwhale-not-found__digit">4</motion.span>
          <motion.div
            variants={ghostVariants}
            animate={["visible", "floating"]}
            whileHover="hover"
            className="sqlwhale-not-found__ghost"
          >
            <Image
              src="https://cdn.21st.dev/assets/mirror/88/8848c4fd858052c49c5a5d7267489c02b021c6cf3e31bfec02787e16f1ab7d0e.png"
              alt="A friendly ghost representing a missing page"
              width={120}
              height={120}
              draggable={false}
              priority
            />
          </motion.div>
          <motion.span custom={1} variants={numberVariants} className="sqlwhale-not-found__digit">4</motion.span>
        </div>

        <motion.h1 variants={itemVariants} className="sqlwhale-not-found__title">
          Whale, this page is missing.
        </motion.h1>

        <motion.p variants={itemVariants} className="sqlwhale-not-found__description">
          The page may have moved, or the link might be incorrect. Let’s get you
          back to exploring SQLWhale.
        </motion.p>

        <motion.div variants={itemVariants} className="sqlwhale-not-found__actions">
          <Link href="/" className="sqlwhale-not-found__button sqlwhale-not-found__button--primary">
            Back to home <span aria-hidden="true" style={{ marginLeft: 8 }}>↗</span>
          </Link>
          <Link href="/learn" className="sqlwhale-not-found__button sqlwhale-not-found__button--secondary">
            Explore SQL lessons
          </Link>
        </motion.div>

        <motion.p variants={itemVariants} className="sqlwhale-not-found__editor">
          Need a fresh start?{" "}
          <Link href="/run-query">Open SQL Editor</Link>
        </motion.p>
      </motion.div>
    </main>
  );
}
