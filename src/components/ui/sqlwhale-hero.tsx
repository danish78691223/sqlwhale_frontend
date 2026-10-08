"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Database,
  FileCode2,
  Play,
  Search,
} from "lucide-react";
import { useRef } from "react";

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
  const rotateX = useSpring(pointerY, { stiffness: 260, damping: 30, mass: 0.7 });
  const rotateY = useSpring(pointerX, { stiffness: 260, damping: 30, mass: 0.7 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    pointerX.set(x * 5);
    pointerY.set(y * -5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 text-neutral-950 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[52%] top-[-18%] h-[620px] w-[620px] rounded-full bg-neutral-100 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.32] [background-image:radial-gradient(circle,rgba(23,23,23,.12)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[650px] max-w-[1280px] items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.55 }}
          className="relative z-10 max-w-[620px]"
        >
          <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
            SQLWHALE
          </div>

          <h1 className="max-w-[700px] text-[clamp(3.35rem,6.7vw,6.7rem)] font-medium leading-[0.91] tracking-[-0.07em]">
            Learn SQL by
            <br />
            <span className="text-neutral-400">seeing it happen.</span>
          </h1>

          <p className="mt-8 max-w-[510px] text-base leading-7 text-neutral-500 sm:text-lg">
            Write a query, run it, and watch the database respond. SQLWhale
            turns execution into something you can see, follow, and understand.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <motion.div
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", bounce: 0, duration: 0.25 }}
            >
              <Link
                href="/run-query"
                className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
              >
                Run your first query
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            <motion.a
              href="#how-it-works"
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", bounce: 0, duration: 0.25 }}
              className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 shadow-sm"
            >
              See how it works
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: 26 }}
          animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.7, delay: 0.06 }}
          className="relative mx-auto w-full max-w-[730px]"
        >
          <div
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
            className="relative [perspective:1200px]"
          >
            <motion.div
              style={{ rotateX, rotateY }}
              className="relative rounded-[28px] border border-white/80 bg-white/60 p-2 shadow-[0_35px_100px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
            >
              <div className="overflow-hidden rounded-[21px] border border-neutral-200 bg-[#111111] text-white">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    <span className="text-sm font-medium tracking-[-0.01em]">
                      SQLWhale
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                    Learn by doing
                  </span>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="mb-5 flex items-center justify-between text-xs text-neutral-500">
                    <span>Query workspace</span>
                    <span>Ready</span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-2">
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-3.5">
                      <Search className="h-4 w-4 shrink-0 text-neutral-500" />
                      <span className="flex-1 text-sm text-neutral-400">
                        What do you want to understand?
                      </span>
                      <span className="hidden rounded-md border border-white/10 px-2 py-1 text-[10px] text-neutral-500 sm:block">
                        ⌘K
                      </span>
                    </div>

                    <div className="mt-2 space-y-1">
                      {commands.map((command, index) => {
                        const Icon = command.icon;

                        return (
                          <motion.div
                            key={command.label}
                            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                            transition={{
                              type: "spring",
                              bounce: 0,
                              duration: 0.42,
                              delay: reducedMotion ? 0 : 0.32 + index * 0.055,
                            }}
                            whileTap={reducedMotion ? undefined : { scale: 0.985 }}
                            className="group flex items-center gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-white/[0.07]"
                          >
                            <Icon className="h-4 w-4 shrink-0 text-neutral-500 transition-colors group-hover:text-white" />
                            <span className="flex-1 text-sm text-neutral-300">
                              {command.label}
                            </span>
                            <kbd className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-neutral-500">
                              {command.shortcut}
                            </kbd>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                      <span className="block text-[9px] uppercase tracking-[0.16em] text-neutral-600">
                        Write
                      </span>
                      <span className="mt-2 block text-xs text-neutral-300">
                        SQL
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                      <span className="block text-[9px] uppercase tracking-[0.16em] text-neutral-600">
                        See
                      </span>
                      <span className="mt-2 block text-xs text-neutral-300">
                        Data flow
                      </span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                      <span className="block text-[9px] uppercase tracking-[0.16em] text-neutral-600">
                        Understand
                      </span>
                      <span className="mt-2 block text-xs text-neutral-300">
                        Why
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-5 flex justify-between px-1 text-[9px] uppercase tracking-[0.2em] text-neutral-400">
            <span>WRITE</span>
            <span>FOLLOW</span>
            <span>UNDERSTAND</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
