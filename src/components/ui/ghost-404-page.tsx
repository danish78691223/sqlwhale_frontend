"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.43, 0.13, 0.23, 0.96],
      delayChildren: 0.08,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.43, 0.13, 0.23, 0.96] },
  },
};

const numberVariants: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 28,
    y: 12,
    rotate: direction * 4,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] },
  },
};

const ghostVariants: Variants = {
  hidden: { scale: 0.82, opacity: 0, y: 12, rotate: -5 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
  },
  hover: {
    scale: 1.08,
    y: -8,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.7,
      ease: "easeInOut",
      rotate: { duration: 1.8, ease: "linear", repeat: Infinity, repeatType: "reverse" },
    },
  },
  floating: {
    y: [-5, 5],
    transition: { y: { duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" } },
  },
};

export function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#07070b] px-5 py-16 text-center text-[#f5f5f7]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[18%] h-72 w-72 -translate-x-1/2 rounded-full bg-[#1862fd]/10 blur-[100px]" />
        <div className="absolute bottom-[8%] right-[12%] h-56 w-56 rounded-full bg-cyan-400/[0.06] blur-[90px]" />
      </div>

      <motion.div
        className="relative z-10 flex w-full max-w-2xl flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/55"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#4b83ff]" />
          SQLWHALE · ERROR 404
        </motion.div>

        <div className="mb-8 flex items-center justify-center gap-3 sm:mb-10 sm:gap-6">
          <motion.span
            custom={-1}
            variants={numberVariants}
            className="select-none text-[104px] font-extrabold leading-none tracking-[-0.09em] text-white sm:text-[144px]"
          >
            4
          </motion.span>

          <motion.div
            variants={ghostVariants}
            animate={["visible", "floating"]}
            whileHover="hover"
            className="shrink-0"
          >
            <Image
              src="https://cdn.21st.dev/assets/mirror/88/8848c4fd858052c49c5a5d7267489c02b021c6cf3e31bfec02787e16f1ab7d0e.png"
              alt="A friendly ghost representing a missing page"
              width={120}
              height={120}
              className="h-[82px] w-[82px] select-none object-contain sm:h-[120px] sm:w-[120px]"
              draggable={false}
              priority
            />
          </motion.div>

          <motion.span
            custom={1}
            variants={numberVariants}
            className="select-none text-[104px] font-extrabold leading-none tracking-[-0.09em] text-white sm:text-[144px]"
          >
            4
          </motion.span>
        </div>

        <motion.h1
          variants={itemVariants}
          className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Whale, this page is missing.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mb-9 max-w-lg text-base leading-7 text-white/55 sm:text-lg"
        >
          The page may have moved, or the link might be incorrect. Let’s get you
          back to exploring SQLWhale.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <Link
            href="/"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#1862fd] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(24,98,253,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#3477ff] sm:w-auto"
          >
            Back to home <span aria-hidden="true" className="ml-2">↗</span>
          </Link>
          <Link
            href="/learn"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-3 text-sm font-semibold text-white/85 transition duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08] sm:w-auto"
          >
            Explore SQL lessons
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 text-sm text-white/35">
          Need a fresh start?{" "}
          <Link href="/run-query" className="text-[#82aaff] underline decoration-[#82aaff]/40 underline-offset-4 transition hover:text-white">
            Open SQL Editor
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
