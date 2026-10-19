"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./SQLWhaleHero.module.css";

export function SQLWhaleHero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
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
                className={styles.primary + " cursor-target"}
                data-cursor-label="Start learning"
              >
                Start learning
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.a
              href="#how-it-works"
              whileTap={reducedMotion ? undefined : { scale: 0.965 }}
              transition={{ type: "spring", bounce: 0, duration: 0.22 }}
              className={styles.secondary + " cursor-target"}
              data-cursor-label="Explore"
            >
              See how it works
            </motion.a>
          </div>
        </div>

        <div className={styles.videoShowcase}>
          <video
            className={styles.heroVideo}
            src="/main-vid(1).mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="SQLWhale product walkthrough"
          />
        </div>
      </div>
    </section>
  );
}
