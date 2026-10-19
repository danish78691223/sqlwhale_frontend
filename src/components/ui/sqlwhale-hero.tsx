"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import styles from "./SQLWhaleHero.module.css";

export function SQLWhaleHero() {
  const reducedMotion = useReducedMotion();
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const lastPointerX = useRef<number | null>(null);

  const handleVideoPointerEnter = (event: React.PointerEvent<HTMLVideoElement>) => {
    if (event.pointerType === "touch") return;
    lastPointerX.current = event.clientX;
    heroVideoRef.current?.pause();
  };

  const handleVideoPointerMove = (event: React.PointerEvent<HTMLVideoElement>) => {
    const video = heroVideoRef.current;
    if (!video || event.pointerType === "touch" || lastPointerX.current === null) return;

    const deltaX = event.clientX - lastPointerX.current;
    lastPointerX.current = event.clientX;
    if (!Number.isFinite(video.duration) || video.duration <= 0 || Math.abs(deltaX) < 0.5) return;

    // Horizontal cursor movement scrubs the clip: right advances, left rewinds.
    const scrubSecondsPerPixel = 0.045;
    const nextTime = video.currentTime + deltaX * scrubSecondsPerPixel;
    video.currentTime = Math.max(0, Math.min(video.duration, nextTime));
  };

  const handleVideoPointerLeave = () => {
    lastPointerX.current = null;
    const video = heroVideoRef.current;
    if (video) {
      void video.play().catch(() => {
        // Autoplay may be blocked by the browser; the user can still play the video.
      });
    }
  };

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
            ref={heroVideoRef}
            className={styles.heroVideo}
            src="/main-vid.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onPointerEnter={handleVideoPointerEnter}
            onPointerMove={handleVideoPointerMove}
            onPointerLeave={handleVideoPointerLeave}
            aria-label="SQLWhale product walkthrough. Move the cursor right to advance and left to rewind."
          />
        </div>
      </div>
    </section>
  );
}
