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
  { icon: CalendarDays, label: "Open today's query", shortcut: "⌘1" },
  { icon: FileCode2, label: "Jump to SQL editor", shortcut: "⌘2" },
  { icon: Database, label: "Explore database canvas", shortcut: "⌘3" },
  { icon: Play, label: "Run a SQL query", shortcut: "⌘4" },
];

export function SQLWhaleHero() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 text-neutral-950 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[55%] top-[-20%] h-[620px] w-[620px] rounded-full bg-neutral-100 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.42] [background-image:linear-gradient(to_right,rgba(23,23,23,.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,.055)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[610px] max-w-[1280px] items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative z-10 max-w-[590px]"
        >
          <div className="mb-7 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            SQLWHALE
          </div>

          <h1 className="max-w-[680px] text-[clamp(3.4rem,6.8vw,6.9rem)] font-medium leading-[0.9] tracking-[-0.065em]">
            See what your
            <br />
            <span className="text-neutral-400">SQL actually does.</span>
          </h1>

          <p className="mt-8 max-w-[510px] text-base leading-7 text-neutral-500 sm:text-lg">
            Write queries, run them, and follow the data through the database.
            SQLWhale makes SQL execution visible so you can understand what
            your query is doing instead of just memorizing syntax.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/run-query"
              className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Run your first query
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400"
            >
              How it works
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[720px]"
        >
          <div className="absolute -inset-16 -z-10 rounded-full bg-neutral-200/60 blur-3xl" />

          <div className="relative rounded-[22px] border border-neutral-200 bg-neutral-100 p-2 shadow-[0_35px_90px_rgba(0,0,0,0.14)]">
            <div className="overflow-hidden rounded-[17px] border border-neutral-200 bg-[#111111] text-white">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <span className="text-sm font-medium tracking-[-0.01em]">Launcher</span>
                <span className="text-[10px] text-neutral-500">SQLWHALE</span>
              </div>

              <div className="p-5 sm:p-7">
                <div className="mb-5 flex items-center justify-between text-xs text-neutral-500">
                  <span>Thu 08 October</span>
                  <span>11:57 PM</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.045] p-2">
                  <div className="flex items-center gap-3 rounded-lg px-3 py-3.5">
                    <Search className="h-4 w-4 shrink-0 text-neutral-500" />
                    <span className="flex-1 text-sm text-neutral-400">
                      Search SQL, tables, and actions
                    </span>
                  </div>

                  <div className="mt-1 space-y-1">
                    {commands.map((command, index) => {
                      const Icon = command.icon;

                      return (
                        <motion.div
                          key={command.label}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.35,
                            delay: 0.45 + index * 0.07,
                            ease: "easeOut",
                          }}
                          className={[
                            "flex items-center gap-3 rounded-lg px-3 py-3.5",
                            index === 0 ? "bg-white/[0.08]" : "",
                          ].join(" ")}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-neutral-500" />
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
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-between px-1 text-[9px] uppercase tracking-[0.2em] text-neutral-400">
            <span>WRITE</span>
            <span>EXECUTE</span>
            <span>UNDERSTAND</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
