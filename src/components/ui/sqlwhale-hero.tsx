"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Database, Play, Search, Table2 } from "lucide-react";

const commandItems = [
  {
    icon: Table2,
    title: "Explore database",
    shortcut: "⌘1",
    description: "See your tables and relationships",
  },
  {
    icon: Play,
    title: "Run a SQL query",
    shortcut: "⌘2",
    description: "Execute and inspect the result",
  },
  {
    icon: Database,
    title: "Show what happened",
    shortcut: "⌘3",
    description: "Follow the query step by step",
  },
];

export function SQLWhaleHero() {
  return (
    <section className="relative isolate overflow-hidden bg-white px-5 pb-16 pt-12 text-neutral-950 sm:px-8 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-purple-100/70 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-neutral-200" />
        <div
          className="absolute inset-0 opacity-[0.32]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(23,23,23,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(23,23,23,.07) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "linear-gradient(to bottom, black, rgba(0,0,0,.35) 62%, transparent)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3.5 py-2 text-xs font-medium tracking-wide text-neutral-600 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
              INTERACTIVE SQL LEARNING
              <ArrowRight className="h-3.5 w-3.5" />
            </div>

            <h1 className="max-w-[760px] text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[76px]">
              See what your
              <br />
              <span className="bg-gradient-to-r from-neutral-950 via-purple-700 to-neutral-950 bg-clip-text text-transparent">
                SQL actually does.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
              Write a query, run it, and follow the data through the database.
              SQLWhale turns SQL execution into something you can actually see
              and understand.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/run-query"
                className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-purple-700"
              >
                Run your first query
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400"
              >
                How it works
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
              <span>Write</span>
              <span>→</span>
              <span>Execute</span>
              <span>→</span>
              <span>Understand</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[720px] lg:pt-6"
          >
            <div className="absolute -inset-8 -z-10 rounded-[40px] bg-purple-200/45 blur-3xl" />

            <div className="overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-[0_30px_90px_rgba(23,23,23,.13)]">
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-neutral-400">
                  SQLWHALE / COMMAND
                </span>
                <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700">
                  READY
                </span>
              </div>

              <div className="p-5 sm:p-7">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                  <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
                    <Search className="h-4 w-4 text-neutral-400" />
                    <span className="flex-1 text-sm text-neutral-500">
                      What do you want to understand?
                    </span>
                    <kbd className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-semibold text-neutral-400">
                      ⌘K
                    </kbd>
                  </div>

                  <div className="mt-3 space-y-2">
                    {commandItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.45,
                            delay: 0.45 + index * 0.1,
                            ease: "easeOut",
                          }}
                          className="group flex items-center gap-3 rounded-xl border border-transparent bg-white px-4 py-3.5 transition hover:border-purple-200 hover:bg-purple-50/60"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 group-hover:bg-purple-100 group-hover:text-purple-700">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-neutral-900">
                              {item.title}
                            </span>
                            <span className="block text-xs text-neutral-400">
                              {item.description}
                            </span>
                          </span>
                          <kbd className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-semibold text-neutral-400">
                            {item.shortcut}
                          </kbd>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-950 p-4 text-white">
                    <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                      <span>Query</span>
                      <span>01</span>
                    </div>
                    <div className="space-y-1 font-mono text-xs leading-6 sm:text-sm">
                      <div><span className="text-purple-400">SELECT</span> name, salary</div>
                      <div><span className="text-purple-400">FROM</span> employees</div>
                      <div><span className="text-purple-400">WHERE</span> salary &gt; 50000;</div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      Query executed
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                      Result
                    </div>
                    <div className="space-y-2">
                      {[
                        ["Aisha", "$82k"],
                        ["Rohan", "$76k"],
                        ["Maya", "$64k"],
                      ].map(([name, salary]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between border-b border-neutral-100 pb-2 text-xs"
                        >
                          <span className="font-medium text-neutral-700">{name}</span>
                          <span className="font-mono text-purple-600">{salary}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-[10px] font-medium text-neutral-400">
                      3 rows returned
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              <span>SQL EDITOR</span>
              <span>DATABASE CANVAS</span>
              <span>QUERY OUTPUT</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
