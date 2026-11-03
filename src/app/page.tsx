"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Floating3DParticles } from "@/components/ui/floating-3d-particles";
import { LeaderboardSection } from "@/components/Leaderboard";
import { SQLWhaleHero } from "@/components/ui/sqlwhale-hero";
import "./home-redesign.css";

function SqlWhaleLoader({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const keywords = ["SELECT", "WHERE", "FROM", "HAVING", "JOIN", "ORDER BY"];

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(1), 650),
      window.setTimeout(() => setStep(2), 1500),
      window.setTimeout(() => setStep(3), 2350),
      window.setTimeout(() => setStep(4), 3200),
      window.setTimeout(() => setStep(5), 4050),
      window.setTimeout(() => setStep(6), 4900),
      window.setTimeout(() => setStep(7), 5900),
      window.setTimeout(onDone, 6600),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [onDone]);

  const activeKeyword = step >= 1 && step <= 6 ? keywords[step - 1] : null;
  const clearedKeywords = keywords.slice(0, Math.min(step, keywords.length));

  return (
    <div className="sql-loader" role="status" aria-label="Loading SQLWhale">
      <div className="sql-loader-grid" />
      <div className="sql-loader-topline"><span>SQLWHALE / SYSTEM BOOT</span><span>ONLINE</span></div>

      <div className="sql-loader-stage">
        <div className="loader-shot-status">
          <span className="loader-shot-dot" />
          {step >= 7 ? "QUERY SYNTAX CLEARED" : activeKeyword ? "TARGETING " + activeKeyword : "TARGETING SQL KEYWORDS"}
        </div>

        <div className="loader-keyword-console" aria-hidden="true">
          <div className="loader-console-head">
            <span>SQL KEYWORD BUFFER</span>
            <i />
          </div>
          <div className="loader-console-body">
            {clearedKeywords.map((keyword, index) => (
              <div className="loader-console-keyword" key={keyword}>
                <span className="loader-console-index">0{index + 1}</span>
                <span>{keyword}</span>
                <b>✓</b>
              </div>
            ))}
            {step === 0 ? (
              <div className="loader-console-empty">AWAITING TARGETS...</div>
            ) : null}
          </div>
          <div className="loader-console-scan" />
        </div>

        {activeKeyword ? (
          <div className="loader-incoming-keyword" key={activeKeyword}>
            <span>{activeKeyword}</span>
          </div>
        ) : null}

        <div className={"loader-user " + (step >= 1 ? "loader-user-active" : "")}>
          <div className="loader-user-head"><span className="loader-user-eye loader-user-eye-left" /><span className="loader-user-eye loader-user-eye-right" /></div>
          <div className="loader-user-neck" />
          <div className="loader-user-body" />
          <div className="loader-user-arm loader-user-arm-back" />
          <div className="loader-user-arm loader-user-arm-gun" />
          <div className="loader-user-hand" />
          <div className="loader-user-leg loader-user-leg-left" /><div className="loader-user-leg loader-user-leg-right" />
          <div className="loader-user-foot loader-user-foot-left" /><div className="loader-user-foot loader-user-foot-right" />
          <div className="loader-gun"><span className="loader-gun-barrel" /><span className="loader-gun-grip" /><span className="loader-gun-core" /></div>
          {step >= 1 && step <= 6 ? <span key={"flash-" + step} className="loader-muzzle-flash" /> : null}
        </div>

        <div className={"loader-route " + (step >= 7 ? "loader-route-active" : "")}><span /></div>
        <div className={"loader-database " + (step >= 7 ? "loader-database-active" : "")}>
          <div className="loader-db-top"><span>DATABASE</span><i /></div>
          <div className="loader-db-body"><span>SELECT</span><span>FROM</span><span>WHERE</span></div>
          <div className="loader-db-scan" />
        </div>

        <div className={"loader-message " + (step >= 7 ? "loader-message-show" : "")}>
          <span className="loader-check">✓</span>
          <div><strong>Connection ready.</strong><span>You can go — happy learning!</span></div>
        </div>
      </div>

      <div className="sql-loader-footer">
        <div className="loader-progress"><span style={{ width: Math.min(step * (100 / 7), 100) + "%" }} /></div>
        <span>{step >= 7 ? "READY" : "BREAKING SQL KEYWORDS..."}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [demoRan, setDemoRan] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [audience, setAudience] = useState(0);

  useEffect(() => {
    // The intro loader is only for the first homepage visit in this browser tab.
    // Navigation, refreshes and returning to "/" must not replay it.
    const loaderSeen = window.sessionStorage.getItem("sqlwhale_home_loader_seen");

    if (!loaderSeen) {
      window.sessionStorage.setItem("sqlwhale_home_loader_seen", "1");
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("sql-loader-lock", loading);
    return () => document.body.classList.remove("sql-loader-lock");
  }, [loading]);


  useEffect(() => {
    if (loading) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("scroll-reveal-visible")),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  if (loading) return <SqlWhaleLoader onDone={() => setLoading(false)} />;

  return (
    <main className="sqlwhale-home">
      <div className="agency-particle-background" aria-hidden="true">
        <Floating3DParticles
          quantity={260}
          color="#0a0b0d"
          size={2.4}
          opacity={0.22}
          drift={0.18}
          depth={0.7}
        />
      </div>

      <SQLWhaleHero />

      <section id="mini-demo" className="home-section sw-section sw-demo-section">
        <div className="sw-section-inner">
          <div className="sw-kicker">01 / TRY IT YOURSELF</div>
          <div className="sw-demo-heading"><h2>Don't just read SQL.<br /><em>Run it and see.</em></h2><p>A tiny interactive preview with sample employee data. No account or backend connection needed.</p></div>
          <div className="sw-demo-shell">
            <div className="sw-demo-editor"><div className="sw-demo-toolbar"><span>query.sql</span><span>MySQL · sample data</span></div><pre><b>SELECT</b> name, role, salary{"\n"}<b>FROM</b> employees{"\n"}<b>WHERE</b> salary &gt; <i>50000</i>;</pre><div className="sw-demo-editor-footer"><span><i /> Ready to execute</span><button type="button" onClick={() => setDemoRan(true)}>Run query <ArrowRight size={14}/></button></div></div>
            <div className="sw-demo-result"><div className="sw-demo-result-head"><span>QUERY RESULT</span><strong>{demoRan ? "3 rows returned" : "Preview · 4 sample rows"}</strong></div><div className="sw-demo-table-head"><span>NAME</span><span>ROLE</span><span>SALARY</span></div>{(demoRan ? [{name:"Aarav",role:"Developer",salary:"₹72,000"},{name:"Kabir",role:"Analyst",salary:"₹85,000"},{name:"Sara",role:"Engineer",salary:"₹64,000"}] : [{name:"Aarav",role:"Developer",salary:"₹72,000"},{name:"Maya",role:"Designer",salary:"₹48,000"},{name:"Kabir",role:"Analyst",salary:"₹85,000"},{name:"Sara",role:"Engineer",salary:"₹64,000"}]).map((row,index)=><motion.div key={row.name} initial={false} animate={{opacity:1,x:0}} transition={{delay:index*.06}} className="sw-demo-table-row"><span>{row.name}</span><span>{row.role}</span><b>{row.salary}</b></motion.div>)}{demoRan&&<p className="sw-demo-filter-note">✓ Rows with salary greater than ₹50,000 are kept. Maya's row is filtered out.</p>}</div>
          </div>
          <div className="sw-demo-note"><span>ILLUSTRATIVE DATASET</span><button type="button" onClick={()=>setDemoRan(false)}>Reset preview</button></div>
        </div>
      </section>

      <section className="home-section sw-trust-section">
        <div className="sw-trust-strip"><div><span className="sw-trust-icon">↗</span><strong>Building in public</strong><small>A growing SQL learning project</small></div><div><span className="sw-trust-icon">✦</span><strong>Product Hunt</strong><small>Discover the WEBXWHALE launch</small></div><a href="https://www.producthunt.com/products/webxwhale" target="_blank" rel="noopener noreferrer">View launch <ArrowRight size={14}/></a></div>
      </section>

      <section id="about" className="home-section sw-section sw-problem-section">
        <div className="sw-section-inner">
          <div className="sw-kicker">02 / THE LEARNING GAP</div>
          <div className="sw-section-heading"><h2>Reading SQL is not<br /><em>the same as understanding it.</em></h2><p>SQLWhale makes the invisible parts of query execution easier to follow.</p></div>
          <div className="sw-problem-grid">
            <article><span>01</span><h3>Reading ≠ understanding</h3><p>A tutorial can show syntax. You still need to know why and when to use it.</p><small>SQLWhale: write queries and practice in a hands-on workspace.</small></article>
            <article><span>02</span><h3>Tables are connected</h3><p>JOINs feel confusing when relationships and keys stay hidden in plain text.</p><small>SQLWhale: explore database structure with a visual schema map.</small></article>
            <article><span>03</span><h3>Results hide the process</h3><p>A result set shows what came back, not always how the query got there.</p><small>SQLWhale: follow the query flow and inspect the output.</small></article>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="home-section sw-section sw-steps-section">
        <div className="sw-section-inner">
          <div className="sw-kicker">03 / HOW IT WORKS</div>
          <div className="sw-section-heading"><h2>Three steps from query<br /><em>to clarity.</em></h2><p>Choose a starting point and see how the SQLWhale workflow fits together.</p></div>
          <div className="sw-step-tabs">{["Choose a table","Write SQL","See the flow"].map((label,index)=><button key={label} className={activeStep===index?"active":""} onClick={()=>setActiveStep(index)}><span>0{index+1}</span>{label}</button>)}</div>
          <div className="sw-step-preview"><div><span className="sw-step-tag">STEP 0{activeStep+1}</span><h3>{["Start with the data","Build your query","See what happened"][activeStep]}</h3><p>{["Pick a sample table and inspect its columns, keys and relationships before you write a query.","Write a SQL statement in the editor. Start simple, then add filters, sorting or JOINs.","Run the statement and inspect the returned rows alongside the query's visual execution context."][activeStep]}</p><Link href="/run-query">Try this in the workspace <ArrowRight size={15}/></Link></div><div className="sw-step-art">{activeStep===0?<><div className="sw-schema-table"><b>employees</b><span>🔑 id</span><span>name</span><span>department_id</span><span>salary</span></div><div className="sw-schema-table secondary"><b>departments</b><span>🔑 id</span><span>department_name</span></div><span className="sw-schema-link">department_id ↔ id</span></>:activeStep===1?<div className="sw-code-card"><span>SQL EDITOR</span><pre><b>SELECT</b> name, department_id{"\n"}<b>FROM</b> employees{"\n"}<b>WHERE</b> salary &gt; <i>50000</i>;</pre><span className="sw-code-ready">● QUERY READY</span></div>:<div className="sw-flow-card"><span>SELECT</span><i>↓</i><span>FILTER · salary &gt; 50000</span><i>↓</i><span className="success">RESULT · matching rows</span></div>}</div></div>
        </div>
      </section>

      <section className="home-section sw-section sw-benefits-section">
        <div className="sw-section-inner">
          <div className="sw-kicker">04 / LEARN BY SEEING</div><div className="sw-section-heading"><h2>Features that turn into<br /><em>real learning wins.</em></h2></div>
          <div className="sw-benefit-grid"><article><span>01 / SCHEMA MAP</span><h3>JOINs ka darr khatam.</h3><p>See how tables connect so keys and relationships make more sense.</p></article><article><span>02 / LIVE TRACE</span><h3>Understand the result.</h3><p>Follow the query flow and inspect how your SQL shapes the output.</p></article><article><span>03 / LEARN</span><h3>Basics se advanced tak.</h3><p>Explore SQL concepts, examples and practice in one learning destination.</p><Link href="/learn">Explore Learn <ArrowRight size={14}/></Link></article><article><span>04 / CHAI POINTS</span><h3>Practice ko game banao.</h3><p>Complete tasks, collect points and track your place on the leaderboard.</p><Link href="#leaderboard">See rankings <ArrowRight size={14}/></Link></article></div>
        </div>
      </section>

      <section className="home-section sw-section sw-audience-section">
        <div className="sw-section-inner"><div className="sw-kicker">05 / MADE FOR YOUR NEXT STEP</div><div className="sw-section-heading"><h2>Where are you in<br /><em>your SQL journey?</em></h2></div><div className="sw-audience-tabs">{[{label:"Student",headline:"Build strong SQL fundamentals.",copy:"Understand SELECT, filters, grouping and JOINs with visual examples.",query:"SELECT name, marks FROM students WHERE marks > 80;",cta:"Start learning"},{label:"Interview prep",headline:"Practice the SQL questions that matter.",copy:"Refresh joins, aggregations, subqueries and query reasoning before your next interview.",query:"SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;",cta:"Practice queries"},{label:"Working professional",headline:"Make everyday data queries clearer.",copy:"Sharpen practical query skills and understand how your results are produced.",query:"SELECT department_id, AVG(salary) FROM employees GROUP BY department_id;",cta:"Open workspace"}].map((item,index)=><button key={item.label} onClick={()=>setAudience(index)} className={audience===index?"active":""}>{item.label}</button>)}</div><div className="sw-audience-panel"><div><span className="sw-step-tag">FOR {["STUDENTS","INTERVIEW PREP","WORKING PROFESSIONALS"][audience]}</span><h3>{[{headline:"Build strong SQL fundamentals.",copy:"Understand SELECT, filters, grouping and JOINs with visual examples."},{headline:"Practice the SQL questions that matter.",copy:"Refresh joins, aggregations, subqueries and query reasoning before your next interview."},{headline:"Make everyday data queries clearer.",copy:"Sharpen practical query skills and understand how your results are produced."}][audience].headline}</h3><p>{[{copy:"Understand SELECT, filters, grouping and JOINs with visual examples."},{copy:"Refresh joins, aggregations, subqueries and query reasoning before your next interview."},{copy:"Sharpen practical query skills and understand how your results are produced."}][audience].copy}</p><Link href={audience===0?"/learn":"/run-query"}>{audience===0?"Start learning":audience===1?"Practice queries":"Open workspace"} <ArrowRight size={15}/></Link></div><pre>{["SELECT name, marks FROM students WHERE marks > 80;","SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;","SELECT department_id, AVG(salary) FROM employees GROUP BY department_id;"][audience]}</pre></div></div>
      </section>

      <section id="leaderboard" className="home-section sw-section sw-leaderboard-wrap"><div className="sw-section-inner"><div className="sw-kicker">06 / COMMUNITY PROGRESS</div><LeaderboardSection/><p className="sw-leaderboard-cta">Want to see your name here? <Link href="/run-query">Complete your first SQL task <ArrowRight size={14}/></Link></p></div></section>

      <section className="home-section sw-section sw-testimonial-section"><div className="sw-section-inner"><div className="sw-kicker">07 / EARLY FEEDBACK</div><div className="sw-section-heading"><h2>Built around a simple idea:<br /><em>SQL should make sense.</em></h2><p>We're growing with learners. Real learner stories will appear here as beta feedback is collected.</p></div><div className="sw-beta-card"><span>BUILDING IN PUBLIC</span><h3>Your learning story could be next.</h3><p>Have tried SQLWhale? Share honest feedback about what clicked, what felt confusing and what should improve.</p><a href="mailto:hello@webxwhale.com?subject=SQLWhale%20beta%20feedback">Share beta feedback <ArrowRight size={14}/></a></div></div></section>

      <section id="pricing" className="home-section sw-section sw-pricing-section"><div className="sw-section-inner"><div className="sw-kicker">08 / SIMPLE PRICING</div><div className="sw-section-heading"><h2>Start free.<br /><em>Upgrade when ready.</em></h2><p>Try the learning workspace first, then choose a Premium plan when you need more.</p></div><div className="sw-pricing-grid"><article><span>FREE TO START</span><h3>Explore SQLWhale</h3><ul><li>Try the SQL workspace</li><li>Explore beginner lessons</li><li>Practice and learn the basics</li></ul><Link href="/run-query">Start free <ArrowRight size={14}/></Link></article><article className="featured"><span>PREMIUM ACCESS</span><h3>From ₹49 / month</h3><ul><li>Unlock Premium learning content</li><li>Reveal Premium answers</li><li>Choose a plan that fits your pace</li></ul><Link href="/subscribe">View Premium plans <ArrowRight size={14}/></Link></article></div><div className="sw-bargain"><span>🐳 BARGAIN WITH THE WHALE</span><p>Feeling lucky? Make a deal with the Whale on the subscription page.</p><Link href="/subscribe">Try your bargain <ArrowRight size={14}/></Link></div></div></section>

      <section className="home-section sw-section sw-faq-section"><div className="sw-section-inner"><div className="sw-kicker">09 / FAQ</div><div className="sw-section-heading"><h2>Questions? <em>Answered.</em></h2></div><div className="sw-faq-list">{[{q:"Is SQLWhale free to use?",a:"You can start exploring the SQL workspace and learning experience for free. Some Premium learning content and answer reveals require a paid plan."},{q:"Is it suitable for complete beginners?",a:"Yes. Start with SQL fundamentals and work your way through queries, filters, grouping and joins."},{q:"Which SQL database does it use?",a:"SQLWhale currently presents a MySQL-style learning and query experience. Check the workspace for the available database options."},{q:"Do I need to sign up first?",a:"You can explore the homepage demo without an account. Some features, saved progress and account-linked activity require signing in."},{q:"Can I use SQLWhale on mobile?",a:"The site is responsive and can be opened on mobile. A larger screen is more comfortable for writing and exploring longer queries."},{q:"What is the refund policy?",a:"Please read the Refund & Cancellation Policy before purchasing. The policy page explains applicable terms and eligibility."}].map((item,index)=><details key={item.q}><summary><span>0{index+1}</span>{item.q}<b>+</b></summary><p>{item.a}</p></details>)}</div></div></section>

      <section className="home-section sw-final-cta"><div><span>READY WHEN YOU ARE</span><h2>Apni pehli query<br /><em>abhi chalao.</em></h2><Link href="/run-query">Start free <ArrowRight size={17}/></Link></div></section>

      <div className="sw-mobile-sticky-cta"><Link href="/run-query">Start Free <span>↗</span></Link></div>


    </main>
  );
}