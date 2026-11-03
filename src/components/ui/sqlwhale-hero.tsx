"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Play, Check, Zap, Code2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./SQLWhaleHero.module.css";

const employeeRows = [
  { id: 1, name: "Aarav", role: "Developer", salary: 72000 },
  { id: 2, name: "Maya", role: "Designer", salary: 48000 },
  { id: 3, name: "Kabir", role: "Analyst", salary: 85000 },
  { id: 4, name: "Sara", role: "Engineer", salary: 64000 },
];

export function SQLWhaleHero() {
  const [ran, setRan] = useState(false);
  const reducedMotion = useReducedMotion();
  const visibleRows = ran ? employeeRows.filter((employee) => employee.salary > 50000) : employeeRows;

  return (
    <section className={styles.hero} id="top">
      <div className={styles.glowOne} aria-hidden="true" />
      <div className={styles.glowTwo} aria-hidden="true" />
      <div className={styles.inner}>
        <motion.div
          className={styles.copy}
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className={styles.eyebrow}><span /> VISUAL SQL LEARNING PLATFORM <span className={styles.eyebrowLine} /></div>
          <h1 className={styles.title}>
            SQL seekho
            <br />
            <span className={styles.titleAccent}>dekh kar,</span>
            <br />
            ratta maar kar nahi.
          </h1>
          <p className={styles.lede}>
            SQLWhale is a visual SQL learning platform for students, beginners and interview prep.
            Understand queries, make JOINs click, and see how results are built — step by step.
          </p>
          <div className={styles.actions}>
            <Link href="/run-query" className={styles.primary}>
              Free me pehli query chalao <ArrowRight size={17} />
            </Link>
            <a href="#mini-demo" className={styles.secondary}>
              <Play size={15} /> Demo dekho
            </a>
          </div>
          <div className={styles.trustLine}>
            <span><Check size={13} /> No signup needed to explore</span>
            <i />
            <span><Check size={13} /> Free to start</span>
            <i />
            <span><Zap size={13} /> 2 min to first query</span>
          </div>
        </motion.div>

        <motion.div
          className={styles.heroVisual}
          initial={reducedMotion ? false : { opacity: 0, y: 22, scale: .985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: .12, ease: "easeOut" }}
        >
          <div className={styles.visualTop}>
            <div className={styles.windowDots}><i /><i /><i /></div>
            <span><Code2 size={13} /> SQL WORKSPACE PREVIEW</span>
            <b><i /> LIVE DEMO</b>
          </div>
          <div className={styles.heroCode}>
            <div className={styles.codeMeta}><span>query.sql</span><span>MySQL · demo data</span></div>
            <pre><span className={styles.lineNo}>1</span>  <b>SELECT</b> name, role, salary{"\n"}<span className={styles.lineNo}>2</span>  <b>FROM</b> employees{"\n"}<span className={styles.lineNo}>3</span>  <b>WHERE</b> salary &gt; <em>50000</em>;</pre>
          </div>
          <div className={styles.visualFlow}>
            <span className={styles.flowNode}><Code2 size={14} /> QUERY</span>
            <span className={styles.flowConnector} />
            <span className={styles.flowNode}><Zap size={14} /> FILTER</span>
            <span className={styles.flowConnector} />
            <span className={styles.flowNode}><Check size={14} /> RESULT</span>
          </div>
          <div className={styles.previewTable}>
            <div className={styles.tableHead}>
              <span>RESULT PREVIEW</span>
              <small>{visibleRows.length} rows</small>
            </div>
            <div className={styles.tableHeader}><span>NAME</span><span>ROLE</span><span>SALARY</span></div>
            {visibleRows.map((employee, index) => (
              <motion.div
                className={styles.tableRow}
                key={employee.id}
                initial={ran && !reducedMotion ? { opacity: 0, x: -12 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: .28, delay: index * .07 }}
              >
                <span>{employee.name}</span><span>{employee.role}</span><b>₹{employee.salary.toLocaleString("en-IN")}</b>
              </motion.div>
            ))}
            {ran && <div className={styles.filterNote}><Check size={13} /> Salary greater than ₹50,000 — 3 matching rows</div>}
          </div>
          <div className={styles.visualActions}>
            <span>{ran ? "QUERY EXECUTED" : "Try the query on sample data"}</span>
            <button type="button" onClick={() => setRan((value) => !value)}>
              {ran ? "Reset demo" : "Run query"} <ArrowRight size={14} />
            </button>
          </div>
          <div className={styles.visualFoot}><span>ILLUSTRATIVE SAMPLE DATA</span><span>SQLWhale · Learn by seeing</span></div>
        </motion.div>
      </div>
      <a href="#mini-demo" className={styles.scrollCue} aria-label="Scroll to interactive SQL demo">SCROLL TO EXPLORE <span>↓</span></a>
    </section>
  );
}
