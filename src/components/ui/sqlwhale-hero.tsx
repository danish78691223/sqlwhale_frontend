"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import styles from "./SQLWhaleHero.module.css";
import SoftAurora from "./SoftAurora.jsx";
import TargetCursor from "./TargetCursor.jsx";

export function SQLWhaleHero() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section ref={heroRef} className={styles.hero}>
      <TargetCursor container={heroRef} spinDuration={0} hideDefaultCursor parallaxOn />
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

        <div className={styles.cursorShowcase} aria-label="Interactive SQLWhale preview">
          <div className={styles.showcaseTopline}>
            <span className={styles.showcaseStatus}><i /> LIVE QUERY TRACE</span>
            <span className={styles.showcaseIndex}>01 — 03</span>
          </div>
          <div className={styles.showcaseQuery + " cursor-target"} data-cursor-label="Query">
            <div className={styles.showcaseCardHead}><span>SQL EDITOR</span><span>QUERY_01.SQL</span></div>
            <pre><span>SELECT</span> employee_name{"\n"}<span>FROM</span> employees{"\n"}<span>WHERE</span> department_id = <b>2</b>;</pre>
          </div>
          <div className={styles.showcaseConnector}><span /><i>↓</i><span /></div>
          <div className={styles.showcaseTables}>
            <div className={styles.showcaseTable + " cursor-target"} data-cursor-label="Employees">
              <div className={styles.showcaseTableHead}><i /> employees <small>TABLE</small></div>
              <div className={styles.showcaseRow}><span>id</span><b>PK</b></div>
              <div className={styles.showcaseRow}><span>employee_name</span><span>TEXT</span></div>
              <div className={styles.showcaseRow}><span>department_id</span><b>FK</b></div>
            </div>
            <div className={styles.showcaseTable + " cursor-target"} data-cursor-label="Departments">
              <div className={styles.showcaseTableHead}><i /> departments <small>TABLE</small></div>
              <div className={styles.showcaseRow}><span>id</span><b>PK</b></div>
              <div className={styles.showcaseRow}><span>department_name</span><span>TEXT</span></div>
            </div>
          </div>
          <div className={styles.showcaseResult + " cursor-target"} data-cursor-label="Results">
            <div><span className={styles.resultPulse} /> RESULT SET</div>
            <strong>12 <small>rows returned</small></strong>
            <span className={styles.resultBar}><i /></span>
          </div>
          <p className={styles.showcaseCaption}>FROM QUERY TO RESULT — FOLLOW EVERY STEP</p>
        </div>
      </div>
    </section>
  );
}
