"use client";

import { useEffect, useState } from "react";
import { Award, Medal, Trophy } from "lucide-react";
import { api } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

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

function LeaderboardSkeleton() {
  return (
    <div className="sqlwhale-leaderboard-list" aria-label="Loading rankings" role="status">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="sqlwhale-leaderboard-row" key={index}>
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="sqlwhale-leaderboard-user flex-1 space-y-2">
            <Skeleton className="h-4 w-32 max-w-full" />
            <Skeleton className="h-3 w-24 max-w-full" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading rankings...</span>
    </div>
  );
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
          <p>Earn Chai Points by completing SQL tasks and climb the leaderboard.</p>
        </div>
        <div className="sqlwhale-leaderboard-scale">
          <span>EASY <b>10</b></span>
          <span>MEDIUM <b>15</b></span>
          <span>HARD <b>20</b></span>
        </div>
      </div>

      {loading ? (
        <LeaderboardSkeleton />
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
                <span>CHAI POINTS</span>
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
        <div className="account-ranking-summary" role="status" aria-label="Loading your rank">
          <div className="account-ranking-position space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-14" />
          </div>
          <div className="account-ranking-stat space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-6 w-10" />
          </div>
          <div className="account-ranking-stat space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-10" />
          </div>
          <span className="sr-only">Loading your rank...</span>
        </div>
      ) : currentUser ? (
        <div className="account-ranking-summary">
          <div className="account-ranking-position">
            <span>YOUR RANK</span>
            <strong>#{currentUser.rank}</strong>
          </div>
          <div className="account-ranking-stat">
            <span>CHAI POINTS</span>
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
