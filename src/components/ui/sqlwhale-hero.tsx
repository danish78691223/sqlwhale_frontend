"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import styles from "./SQLWhaleHero.module.css";
import SoftAurora from "./SoftAurora.jsx";
import PaperCrumple from "./PaperCrumple.jsx";

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

          <div className={styles.steps}>
            <span>WRITE</span>
            <span className={styles.line} />
            <span>TRACE</span>
            <span className={styles.line} />
            <span>UNDERSTAND</span>
          </div>
        </div>

        <div className={styles.visual}>
          <motion.div
            className={styles.glow}
            style={reducedMotion ? undefined : { x: glowX, y: glowY }}
          />

          <div className={styles.perspective}>
            <PaperCrumple
              src="/sqlwhale-workspace-card.svg"
              alt="SQLWhale Workspace. SQL Editor 01 / QUERY. SELECT e.name, d.name. FROM employees e. JOIN departments d. ON e.department_id = d.id. WHERE e.active = 1. Query ready to run. Tables 02. Steps 04. Execution VISIBLE. FROM employees. JOIN departments. WHERE active = 1. RESULT 24 rows. Database employees and departments. SQLWHALE Write to Trace to Understand."
              width={1000} height={760} sceneHeight={600}
              releaseBehavior="restore" crumpleAmount={0.85}
              crumpleDuration={0.55} releaseDuration={0.4}
              foldCount={6} foldSharpness={0.6} wrinkleDepth={0.65}
              creaseStrength={0.18} paperColor="#f4f0e8"
              paperTexture={0.08} draggable returnToOrigin
              className={styles.paperCrumple}
            />
          </div>
        </div>
        <div className={styles.sideSteps} aria-label="SQLWhale learning flow">
          <span>WRITE</span>
          <span className={styles.sideArrow}>→</span>
          <span>TRACE</span>
          <span className={styles.sideArrow}>→</span>
          <span>UNDERSTAND</span>
        </div>
      </div>
    </section>
  );
}
