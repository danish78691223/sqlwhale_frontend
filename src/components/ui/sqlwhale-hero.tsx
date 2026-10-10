"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./SQLWhaleHero.module.css";
import SoftAurora from "./SoftAurora.jsx";

export function SQLWhaleHero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className={styles.hero}>
      <div className={styles.auroraBackground} aria-hidden="true">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1.0}
          color1="#f7f7f7"
          color2="#e100ff"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          bandHeight={0.5}
          bandSpread={1.0}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.25}
          lightMode={false}
        />
      </div>

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

        </div>

      </div>
    </section>
  );
}
