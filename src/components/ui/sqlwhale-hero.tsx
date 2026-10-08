"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowRight, Database, FileCode2, Play, Search } from "lucide-react";
import { useRef } from "react";
import styles from "./SQLWhaleHero.module.css";

const commands = [
  { icon: FileCode2, label: "Write a SQL query", shortcut: "⌘1" },
  { icon: Database, label: "See your database", shortcut: "⌘2" },
  { icon: Play, label: "Run the query", shortcut: "⌘3" },
  { icon: Search, label: "Understand each step", shortcut: "⌘4" },
];

export function SQLWhaleHero() {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 220, damping: 28, mass: 0.8 });
  const rotateY = useSpring(pointerX, { stiffness: 220, damping: 28, mass: 0.8 });
  const glowX = useSpring(pointerX, { stiffness: 160, damping: 30 });
  const glowY = useSpring(pointerY, { stiffness: 160, damping: 30 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(x * 7);
    pointerY.set(y * -7);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section className={`${styles.hero} px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-16`}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-40 right-[-8%] h-[560px] w-[560px] rounded-full bg-neutral-200/70 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.28] [background-image:linear-gradient(to_right,rgba(23,23,23,.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,.045)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className={`${styles.inner} grid items-center gap-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12`}>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          className="relative z-10 max-w-[650px]"
        >
          <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
            <span className="h-2 w-2 rounded-full bg-neutral-950 shadow-[0_0_0_5px_rgba(23,23,23,.06)]" />
            Interactive SQL learning
          </div>

          <h1 className="text-[clamp(3.5rem,7vw,7.2rem)] font-medium leading-[0.86] tracking-[-0.075em]">
            SQL, but you
            <br />
            <span className="text-neutral-400">can actually see it.</span>
          </h1>

          <p className="mt-9 max-w-[530px] text-[17px] leading-7 tracking-[-0.01em] text-neutral-500 sm:text-[19px]">
            Write the query. Follow the tables. Watch the data move. Learn what
            SQL is doing while it happens.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <motion.div
              whileTap={reducedMotion ? undefined : { scale: 0.965 }}
              transition={{ type: "spring", bounce: 0, duration: 0.22 }}
            >
              <Link
                href="/run-query"
                className="group inline-flex items-center gap-3 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,.16)]"
              >
                Start learning
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.a
              href="#how-it-works"
              whileTap={reducedMotion ? undefined : { scale: 0.965 }}
              transition={{ type: "spring", bounce: 0, duration: 0.22 }}
              className="inline-flex items-center rounded-full border border-neutral-300/80 bg-white/70 px-6 py-3.5 text-sm font-medium text-neutral-700 backdrop-blur-xl"
            >
              See how it works
            </motion.a>
          </div>

          <div className="mt-12 flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            <span>WRITE</span>
            <span className="h-px w-8 bg-neutral-300" />
            <span>TRACE</span>
            <span className="h-px w-8 bg-neutral-300" />
            <span>UNDERSTAND</span>
          </div>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: 36, scale: 0.97 }}
          animate={reducedMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0, duration: 0.75, delay: 0.05 }}
          className="relative mx-auto w-full max-w-[790px]"
        >
          <motion.div
            className="absolute left-1/2 top-1/2 h-[75%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-[80px]"
            style={reducedMotion ? undefined : { x: glowX, y: glowY }}
          />

          <div
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
            className="relative [perspective:1400px]"
          >
            <motion.div
              style={{ rotateX, rotateY }}
              className="relative rounded-[30px] border border-white bg-white/65 p-2 shadow-[0_45px_120px_rgba(0,0,0,.18)] backdrop-blur-2xl will-change-transform"
            >
              <div className="overflow-hidden rounded-[23px] border border-neutral-800 bg-[#0b0b0c] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                <div className="flex h-14 items-center justify-between border-b border-white/[0.08] px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="ml-2 text-xs font-medium text-neutral-300">
                      SQLWhale Workspace
                    </span>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] text-neutral-500">
                    Live
                  </span>
                </div>

                <div className="grid min-h-[510px] grid-cols-[1.12fr_.88fr]">
                  <div className="border-r border-white/[0.07] p-5 sm:p-7">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                        SQL Editor
                      </span>
                      <span className="text-[10px] text-neutral-600">01 / QUERY</span>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 font-mono text-xs leading-7 sm:text-sm">
                      <div><span className="text-neutral-600">01</span> <span className="text-white">SELECT</span> <span className="text-neutral-300">e.name, d.name</span></div>
                      <div><span className="text-neutral-600">02</span> <span className="text-white">FROM</span> <span className="text-neutral-300">employees e</span></div>
                      <div><span className="text-neutral-600">03</span> <span className="text-white">JOIN</span> <span className="text-neutral-300">departments d</span></div>
                      <div><span className="text-neutral-600">04</span> <span className="text-white">ON</span> <span className="text-neutral-300">e.department_id = d.id</span></div>
                      <div><span className="text-neutral-600">05</span> <span className="text-white">WHERE</span> <span className="text-neutral-300">e.active = 1</span></div>
                      <div className="mt-3 h-px bg-white/[0.07]" />
                      <div className="mt-3 flex items-center gap-2 text-[10px] text-neutral-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Query ready to run
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                        <span className="block text-[9px] uppercase tracking-[0.16em] text-neutral-600">Tables</span>
                        <span className="mt-2 block text-lg text-neutral-200">02</span>
                      </div>
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                        <span className="block text-[9px] uppercase tracking-[0.16em] text-neutral-600">Steps</span>
                        <span className="mt-2 block text-lg text-neutral-200">04</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#101011] p-5 sm:p-7">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                        Execution
                      </span>
                      <span className="text-[10px] text-neutral-600">VISIBLE</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        ["01", "FROM", "employees"],
                        ["02", "JOIN", "departments"],
                        ["03", "WHERE", "active = 1"],
                        ["04", "RESULT", "24 rows"],
                      ].map(([num, op, detail], index) => (
                        <motion.div
                          key={op}
                          initial={reducedMotion ? false : { opacity: 0, x: 10 }}
                          animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                          transition={{ type: "spring", bounce: 0, duration: 0.4, delay: 0.3 + index * 0.08 }}
                          className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3.5"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] text-neutral-600">{num}</span>
                            <span className="text-xs font-semibold text-neutral-200">{op}</span>
                            <span className="ml-auto text-[10px] text-neutral-500">{detail}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                      <div className="mb-3 text-[9px] uppercase tracking-[0.16em] text-neutral-600">
                        Database
                      </div>
                      <div className="relative h-24">
                        <div className="absolute left-1 top-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-[9px] text-neutral-300">employees</div>
                        <div className="absolute right-1 top-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-[9px] text-neutral-300">departments</div>
                        <div className="absolute left-1/2 top-12 h-px w-[76%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                        <div className="absolute left-1/2 top-[43px] h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,.8)]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.08] px-5 py-3 text-[9px] uppercase tracking-[0.16em] text-neutral-600">
                  <span>SQLWHALE</span>
                  <span>Write → Trace → Understand</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
