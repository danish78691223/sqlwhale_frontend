import Link from "next/link";
import { ArrowRight, Award, CalendarDays, CheckCircle2, Code2, Medal, ShieldCheck, Trophy, Users } from "lucide-react";
import "./competition.css";
import CompetitionList from "./competition-list";

export const metadata = {
  title: "SQLWhale SQL Challenge 2026 | WEBXWHALE",
  description: "Take on 30 practical SQL tasks across seven days. Learn by solving, compete individually and earn a Top 3 certificate on SQLWhale.",
  alternates: { canonical: "https://sqlwhale.webxwhale.com/competition" },
};

const levels = [
  { name: "Easy", count: 10, points: 5, total: 50, detail: "SELECT, WHERE, ORDER BY and LIMIT" },
  { name: "Medium", count: 10, points: 10, total: 100, detail: "JOIN, GROUP BY, HAVING and aggregates" },
  { name: "Hard", count: 10, points: 15, total: 150, detail: "Subqueries and multi-step query logic" },
];

const schedule = [
  ["Day 1", "Welcome & platform orientation", "Get familiar with the SQLWhale workspace and challenge rules."],
  ["Day 2", "Easy SQL challenges", "Solve the 10 beginner-level tasks."],
  ["Day 3–4", "Medium SQL challenges", "Work through joins, grouping and aggregate queries."],
  ["Day 5–6", "Hard SQL challenges", "Put your query reasoning to the test."],
  ["Day 7", "Final evaluation & results", "Submissions close, scores are verified and the top three are announced."],
];

export default function CompetitionPage() {
  return (
    <main className="sw-competition">\n      <CompetitionList />
      <section className="swc-hero">
        <div className="swc-orb swc-orb-one" /><div className="swc-orb swc-orb-two" />
        <div className="swc-wrap">
          <div className="swc-eyebrow"><span /> WEBXWHALE PRESENTS <span className="swc-sep">/</span> SQLWHALE</div>
          <div className="swc-hero-grid">
            <div className="swc-hero-copy">
              <div className="swc-status"><span className="swc-status-dot" /> FIRST EDITION · 7-DAY INDIVIDUAL CHALLENGE</div>
              <h1>Think in SQL.<br /><em>Compete with skill.</em></h1>
              <p className="swc-lead">A practical SQL challenge built around real query writing. Explore datasets, solve progressively harder tasks and show what you can do in the SQLWhale workspace.</p>
              <div className="swc-actions">
                <a className="swc-button primary" href="#competitions">View competitions <ArrowRight size={17}/></a>
                <a className="swc-button secondary" href="#challenge-details">Explore challenge <span>↓</span></a>
              </div>
              <p className="swc-note">Free to participate · Individual format · Top 3 receive achievement certificates</p>
            </div>
            <div className="swc-score-card">
              <div className="swc-card-top"><span>CHALLENGE SNAPSHOT</span><Code2 size={18}/></div>
              <div className="swc-card-title">SQLWHALE <b>01</b></div>
              <div className="swc-metrics">
                <div><strong>30</strong><span>SQL tasks</span></div><div><strong>300</strong><span>Max points</span></div>
                <div><strong>7</strong><span>Days</span></div><div><strong>3</strong><span>Winners</span></div>
              </div>
              <div className="swc-card-progress"><span>SKILL LEVEL</span><div><i/><i/><i/></div><b>BEGINNER → ADVANCED</b></div>
              <div className="swc-card-footer"><span>POWERED BY SQLWHALE</span><span>ORGANIZED BY WEBXWHALE</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="swc-trust"><div className="swc-wrap swc-trust-inner"><span><ShieldCheck size={17}/> Practical SQL, not multiple-choice guessing</span><span><Users size={17}/> Individual participation</span><span><Award size={17}/> Top 3 achievement certificates</span></div></section>

      <section className="swc-section" id="challenge-details"><div className="swc-wrap">
        <div className="swc-section-head"><div><div className="swc-kicker">01 / THE CHALLENGE</div><h2>Learn by solving.<br/><em>Compete by doing.</em></h2></div><p>SQLWhale’s purpose stays the same: help people understand SQL through hands-on practice. The challenge simply gives that practice a shared goal.</p></div>
        <div className="swc-levels">{levels.map((level, index)=><article className="swc-level" key={level.name}><div className="swc-level-top"><span>0{index+1} / LEVEL</span><b>{level.points} PTS EACH</b></div><h3>{level.name}</h3><p>{level.detail}</p><div className="swc-level-bottom"><strong>{level.count} tasks</strong><span>{level.total} points</span></div><div className="swc-level-bar"><i style={{width: (level.total/300*100)+"%"}}/></div></article>)}</div>
        <div className="swc-total"><span>30 challenges across three difficulty levels</span><strong>300 total points</strong></div>
      </div></section>

      <section className="swc-section swc-section-muted"><div className="swc-wrap">
        <div className="swc-section-head"><div><div className="swc-kicker">02 / SEVEN-DAY FORMAT</div><h2>A clear path<br/><em>from warm-up to winners.</em></h2></div><p>Each stage builds on the previous one. Participants use the same SQLWhale learning and query workspace throughout.</p></div>
        <div className="swc-timeline">{schedule.map(([day,title,description],index)=><article key={day} className="swc-timeline-row"><div className="swc-timeline-day"><span>{day}</span><i>{String(index+1).padStart(2,"0")}</i></div><div className="swc-timeline-content"><h3>{title}</h3><p>{description}</p></div><CheckCircle2 size={18}/></article>)}</div>
        <p className="swc-date-notice"><CalendarDays size={17}/> Exact start date, daily opening times and submission deadline will be published on the official Unstop listing before registration opens.</p>
      </div></section>

      <section className="swc-section"><div className="swc-wrap">
        <div className="swc-section-head"><div><div className="swc-kicker">03 / RECOGNITION</div><h2>Three ranks.<br/><em>One SQL podium.</em></h2></div><p>The final leaderboard determines the top three. Every winner is reviewed before their certificate is issued.</p></div>
        <div className="swc-awards"><article className="gold"><Trophy/><span>01 / FIRST PLACE</span><h3>SQL Champion</h3><p>Certificate of Excellence · First Place</p></article><article className="silver"><Medal/><span>02 / SECOND PLACE</span><h3>SQL Expert</h3><p>Certificate of Excellence · Second Place</p></article><article className="bronze"><Award/><span>03 / THIRD PLACE</span><h3>SQL Achiever</h3><p>Certificate of Excellence · Third Place</p></article></div>
        <p className="swc-certificate-note">Certificates will carry the participant’s verified name, rank, challenge title, issue date, unique certificate ID and a verification link. Participation certificates are not included in this edition.</p>
      </div></section>

      <section className="swc-section swc-section-muted"><div className="swc-wrap swc-rules-grid">
        <div><div className="swc-kicker">04 / FAIR PLAY</div><h2>Challenge<br/><em>rules.</em></h2><p className="swc-rules-intro">A fair competition depends on consistent evaluation and respectful participation.</p></div>
        <ol className="swc-rules"><li><b>One person, one account.</b><span>Use your own verified SQLWhale account. Duplicate accounts or impersonation can lead to disqualification.</span></li><li><b>Submit your own work.</b><span>Do not copy another participant’s submissions, share answers during the contest or use someone else’s account.</span></li><li><b>Use the official workspace.</b><span>Complete tasks through the SQLWhale challenge workflow. Only recorded, eligible submissions count. Answer reveals and hints are unavailable for contest tasks while the challenge is live.</span></li><li><b>Respect the clock.</b><span>Only submissions received before the published deadline are eligible. Late submissions are not scored.</span></li><li><b>Keep the platform safe.</b><span>Do not attempt to access other users’ data, exploit the evaluator or disrupt service availability.</span></li><li><b>Final verification applies.</b><span>WEBXWHALE may review suspicious activity and verify winner identity before publishing results and certificates.</span></li><li><b>Ranking and ties.</b><span>Rank by total points, then by the number of correctly solved tasks. If still tied, the participant who reached the final score earlier ranks higher; an exact remaining tie shares rank.</span></li></ol>
      </div></section>

      <section className="swc-final"><div className="swc-wrap swc-final-inner"><div className="swc-kicker">YOUR NEXT QUERY COULD BE THE ONE</div><h2>Build SQL confidence.<br/><em>One challenge at a time.</em></h2><p>Start learning SQL with SQLWhale today. The official competition registration window and dates will be announced soon.</p><div className="swc-actions"><a className="swc-button primary" href="#competitions">Register for a competition <ArrowRight size={17}/></a><Link className="swc-button secondary" href="/run-query">Explore Run Query</Link></div></div></section>
      <footer className="swc-footer"><div className="swc-wrap"><span>SQLWHALE · POWERED BY WEBXWHALE</span><Link href="/">Back to SQLWhale home ↑</Link></div></footer>
    </main>
  );
}
