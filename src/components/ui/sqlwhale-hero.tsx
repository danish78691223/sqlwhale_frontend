"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import styles from "./SQLWhaleHero.module.css";

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
    <section className={styles.hero}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-40 right-[-8%] h-[560px] w-[560px] rounded-full bg-neutral-200/70 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.28] [background-image:linear-gradient(to_right,rgba(23,23,23,.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,.045)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className={styles.inner}>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          className={styles.copy}
        >
          <div className={styles.eyebrow}>
            <span className={styles.dot} />
            Interactive SQL learning
          </div>

          <h1 className={styles.title}>
            SQL, but you
            <br />
            <span className={styles.titleMuted}>can actually see it.</span>
          </h1>

          <p className={styles.lede}>
            Write the query. Follow the tables. Watch the data move. Learn what
            SQL is doing while it happens.
          </p>

          <div className={styles.actions}>
            <motion.div
              whileTap={reducedMotion ? undefined : { scale: 0.965 }}
              transition={{ type: "spring", bounce: 0, duration: 0.22 }}
            >
              <Link
                href="/run-query"
                className={styles.primary}
              >
                Start learning
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.a
              href="#how-it-works"
              whileTap={reducedMotion ? undefined : { scale: 0.965 }}
              transition={{ type: "spring", bounce: 0, duration: 0.22 }}
              className={styles.secondary}
            >
              See how it works
            </motion.a>
          </div>

          <div className={styles.steps}>
            <span>WRITE</span>
            <span className={styles.line} />
            <span>TRACE</span>
            <span className="h-px w-8 bg-neutral-300" />
            <span>UNDERSTAND</span>
          </div>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: 36, scale: 0.97 }}
          animate={reducedMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", bounce: 0, duration: 0.75, delay: 0.05 }}
          className={styles.visual}
        >
          <motion.div
            className={styles.glow}
            style={reducedMotion ? undefined : { x: glowX, y: glowY }}
          />

          <div
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
            className={styles.perspective}
          >
            <motion.div
              style={{ rotateX, rotateY }}
              className={styles.shell}
            >
              <div className={styles.workspace}>
                <div className={styles.workspaceHeader}>
                  <div className={styles.workspaceBrand}>
                    <div className={styles.windowDots}>
                      <span className={`${styles.windowDot} ${styles.red}`} />
                      <span className={`${styles.windowDot} ${styles.yellow}`} />
                      <span className={`${styles.windowDot} ${styles.green}`} />
                    </div>
                    <span className={styles.workspaceName}>
                      SQLWhale Workspace
                    </span>
                  </div>
                  <span className={styles.live}>
                    Live
                  </span>
                </div>

                <div className={styles.workspaceGrid}>
                  <div className={styles.editorPane}>
                    <div className={styles.paneHeader}>
                      <span className={styles.paneLabel}>
                        SQL Editor
                      </span>
                      <span className="text-[10px] text-neutral-600">01 / QUERY</span>
                    </div>

                    <div className={styles.code}>
                      <div><span className={styles.lineNo}>01</span> <span className={styles.keyword}>SELECT</span> <span className={styles.codeText}>e.name, d.name</span></div>
                      <div><span className="text-neutral-600">02</span> <span className="text-white">FROM</span> <span className="text-neutral-300">employees e</span></div>
                      <div><span className="text-neutral-600">03</span> <span className="text-white">JOIN</span> <span className="text-neutral-300">departments d</span></div>
                      <div><span className="text-neutral-600">04</span> <span className="text-white">ON</span> <span className="text-neutral-300">e.department_id = d.id</span></div>
                      <div><span className="text-neutral-600">05</span> <span className="text-white">WHERE</span> <span className="text-neutral-300">e.active = 1</span></div>
                      <div className={styles.codeRule} />
                      <div className={styles.ready}>
                        <span className={styles.readyDot} />
                        Query ready to run
                      </div>
                    </div>

                    <div className={styles.stats}>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Tables</span>
                        <span className={styles.statValue}>02</span>
                      </div>
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                        <span className="block text-[9px] uppercase tracking-[0.16em] text-neutral-600">Steps</span>
                        <span className="mt-2 block text-lg text-neutral-200">04</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.executionPane}>
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                        Execution
                      </span>
                      <span className="text-[10px] text-neutral-600">VISIBLE</span>
                    </div>

                    <div className={styles.executionList}>
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
                          className={styles.executionItem}
                        >
                          <div className={styles.executionRow}>
                            <span className={styles.executionNum}>{num}</span>
                            <span className={styles.executionOp}>{op}</span>
                            <span className={styles.executionDetail}>{detail}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className={styles.database}>
                      <div className={styles.dbLabel}>
                        Database
                      </div>
                      <div className={styles.dbCanvas}>
                        <div className={`${styles.dbTable} ${styles.dbLeft}`}>employees</div>
                        <div className={`${styles.dbTable} ${styles.dbRight}`}>departments</div>
                        <div className={styles.dbLine} />
                        <div className={styles.dbNode} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.workspaceFooter}>
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
