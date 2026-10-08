"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Database,
  FileCode2,
  Play,
  Search,
} from "lucide-react";

const commands = [
  {
    icon: CalendarDays,
    label: "Open today's query",
    shortcut: "⌘1",
  },
  {
    icon: FileCode2,
    label: "Jump to SQL editor",
    shortcut: "⌘2",
  },
  {
    icon: Database,
    label: "Explore database",
    shortcut: "⌘3",
  },
  {
    icon: Play,
    label: "Run a SQL query",
    shortcut: "⌘4",
  },
];

export function SQLWhaleHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#080808] px-5 pb-20 pt-10 text-white sm:px-8 sm:pb-24 sm:pt-14 lg:px-10 lg:pb-28 lg:pt-16">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(255,255,255,0.075),transparent_34%)]" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      </div>

      <div className="mx-auto max-w-[1320px]">
        <div className="grid min-h-[650px] items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 max-w-[610px]"
          >
            <div className="mb-7 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              SQLWHALE
              <span className="text-neutral-700">/</span>
              INTERACTIVE SQL LEARNING
            </div>

            <h1 className="text-[clamp(3.25rem,6.5vw,6.6rem)] font-medium leading-[0.91] tracking-[-0.065em] text-white">
              Understand
              <br />
              <span className="text-neutral-500">SQL at a glance.</span>
            </h1>

            <p className="mt-8 max-w-[500px] text-base leading-7 text-neutral-400 sm:text-lg">
              Write SQL, run it, and see what happens inside the database.
              SQLWhale turns query execution into a visual learning experience.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/run-query"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                Run your first query
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-5 py-3 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
              >
                How it works
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6 text-[10px] uppercase tracking-[0.18em] text-neutral-600">
              <span>WRITE</span>
              <span>→</span>
              <span>EXECUTE</span>
              <span>→</span>
              <span>UNDERSTAND</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 35, y: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[720px] lg:-mr-2"
          >
            <div className="absolute -inset-16 -z-10 bg-white/[0.035] blur-3xl" />

            <div className="relative rotate-[0.4deg] rounded-[22px] border border-white/[0.11] bg-[#111111] p-2 shadow-[0_45px_120px_rgba(0,0,0,0.65)]">
              <div className="rounded-[17px] border border-white/[0.07] bg-[#0d0d0d]">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  </div>
                  <span className="text-[10px] tracking-[0.2em] text-neutral-600">
                    SQLWHALE
                  </span>
                  <span className="text-[10px] text-neutral-600">⌘K</span>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="mb-5 flex items-center justify-between text-xs text-neutral-600">
                    <span>Thu 08 October</span>
                    <span>11:57 PM</span>
                  </div>

                  <div className="rounded-xl border border-white/[0.1] bg-white/[0.035] p-2">
                    <div className="flex items-center gap-3 rounded-lg px-3 py-3.5">
                      <Search className="h-4 w-4 text-neutral-500" />
                      <span className="flex-1 text-sm text-neutral-500">
                        Search SQL, tables, and actions
                      </span>
                      <kbd className="rounded-md border border-white/[0.09] bg-white/[0.035] px-2 py-1 text-[10px] text-neutral-600">
                        ⌘K
                      </kbd>
                    </div>

                    <div className="mt-1 space-y-1">
                      {commands.map((command, index) => {
                        const Icon = command.icon;
                        return (
                          <motion.div
                            key={command.label}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.55 + index * 0.08,
                              ease: "easeOut",
                            }}
                            className={[
                              "group flex items-center gap-3 rounded-lg px-3 py-3.5",
                              index === 0
                                ? "bg-white/[0.07]"
                                : "hover:bg-white/[0.04]",
                            ].join(" ")}
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.035] text-neutral-400 transition group-hover:text-white">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="flex-1 text-sm text-neutral-300">
                              {command.label}
                            </span>
                            <kbd className="rounded-md border border-white/[0.08] px-2 py-1 text-[10px] text-neutral-600">
                              {command.shortcut}
                            </kbd>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {[
                      ["EDITOR", "SELECT *"],
                      ["CANVAS", "4 TABLES"],
                      ["RESULT", "3 ROWS"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-3"
                      >
                        <div className="text-[9px] tracking-[0.16em] text-neutral-600">
                          {label}
                        </div>
                        <div className="mt-1 truncate font-mono text-[10px] text-neutral-400">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-between px-2 text-[9px] uppercase tracking-[0.2em] text-neutral-700">
              <span>COMMAND</span>
              <span>QUERY</span>
              <span>UNDERSTAND</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
