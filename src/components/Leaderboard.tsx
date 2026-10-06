"use client";

import { useEffect, useState } from "react";
import { Award, LoaderCircle, Medal, Trophy } from "lucide-react";
import { api } from "@/services/api";

type LeaderboardEntry = {
  rank: number;
  name: string;
  completedTasks: number;
  points: number;
};

type LeaderboardResponse = {
  success: boolean;
  top10: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
  totalRankedUsers: number;
  pointsScale: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
};

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy size={17} />;
  if (rank === 2) return <Medal size={17} />;
  if (rank === 3) return <Award size={17} />;
  return <span>{rank}</span>;
}

export function LeaderboardSection() {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api
      .get("/rankings")
      .then((response) => {
        if (mounted) setData(response.data || null);
      })
      .catch(() => {
        if (mounted) setData(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="home-section sqlwhale-leaderboard-section">
      <div className="sqlwhale-leaderboard-head">
        <div>
          <div className="agency-section-index">06 / SQLWHALE RANKINGS</div>
          <h2>Top 10 <em>SQL learners.</em></h2>
          <p>Earn points by completing SQL tasks and climb the leaderboard.</p>
        </div>
        <div className="sqlwhale-leaderboard-scale">
          <span>EASY <b>10</b></span>
          <span>MEDIUM <b>15</b></span>
          <span>HARD <b>20</b></span>
        </div>
      </div>

      {loading ? (
        <div className="sqlwhale-leaderboard-empty">
          <LoaderCircle size={18} className="sqlwhale-spin" />
          Loading rankings...
        </div>
      ) : !data || data.top10.length === 0 ? (
        <div className="sqlwhale-leaderboard-empty">
          <Trophy size={20} />
          <div>
            <strong>No ranked learners yet</strong>
            <span>Complete a SQL task to appear on the leaderboard.</span>
          </div>
        </div>
      ) : (
        <div className="sqlwhale-leaderboard-list">
          {data.top10.map((entry) => (
            <div
              className={
                "sqlwhale-leaderboard-row " +
                (entry.rank <= 3 ? "is-top-rank" : "")
              }
              key={entry.rank + "-" + entry.name}
            >
              <div className={"sqlwhale-rank-badge rank-" + entry.rank}>
                <RankIcon rank={entry.rank} />
              </div>
              <div className="sqlwhale-leaderboard-user">
                <strong>{entry.name}</strong>
                <span>
                  {entry.completedTasks} completed task
                  {entry.completedTasks === 1 ? "" : "s"}
                </span>
              </div>
              <div className="sqlwhale-leaderboard-points">
                <strong>{entry.points}</strong>
                <span>POINTS</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProfileRankCard() {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api
      .get("/rankings")
      .then((response) => {
        if (mounted) setData(response.data || null);
      })
      .catch(() => {
        if (mounted) setData(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const currentUser = data?.currentUser;

  return (
    <section className="account-dashboard-section account-ranking-section">
      <div className="account-history-header">
        <div>
          <span className="account-card-label">LEADERBOARD</span>
          <h2>Your SQLWhale ranking</h2>
        </div>
        <span className="account-history-count">
          {data?.totalRankedUsers || 0} ranked learner
          {data?.totalRankedUsers === 1 ? "" : "s"}
        </span>
      </div>

      {loading ? (
        <div className="account-history-empty">
          <LoaderCircle size={17} className="sqlwhale-spin" />
          Loading your rank...
        </div>
      ) : currentUser ? (
        <div className="account-ranking-summary">
          <div className="account-ranking-position">
            <span>YOUR RANK</span>
            <strong>#{currentUser.rank}</strong>
          </div>
          <div className="account-ranking-stat">
            <span>POINTS</span>
            <strong>{currentUser.points}</strong>
          </div>
          <div className="account-ranking-stat">
            <span>COMPLETED TASKS</span>
            <strong>{currentUser.completedTasks}</strong>
          </div>
        </div>
      ) : (
        <div className="account-history-empty">
          Complete your first SQL task to receive a ranking.
        </div>
      )}

      <div className="account-ranking-scale">
        <span>Easy <b>10 pts</b></span>
        <span>Medium <b>15 pts</b></span>
        <span>Hard <b>20 pts</b></span>
      </div>
    </section>
  );
}
