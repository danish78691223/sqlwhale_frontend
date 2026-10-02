"use client";

const skeletonTables = [
  { name: "departments", rows: 4 },
  { name: "employees", rows: 5 },
  { name: "projects", rows: 4 },
  { name: "salary", rows: 4 },
];

export default function DatabaseCanvasSkeleton() {
  return (
    <div className="database-canvas-skeleton" aria-label="Loading database schema" role="status">
      <div className="database-canvas-skeleton-grid" />
      <div className="database-canvas-skeleton-label">DATABASES</div>

      {skeletonTables.map((table) => (
        <div key={table.name} className="database-table-skeleton">
          <div className="database-table-skeleton-header">
            <span className="database-table-skeleton-icon" />
            <span className="database-table-skeleton-title" />
            <span className="database-table-skeleton-menu" />
          </div>

          <div className="database-table-skeleton-body">
            {Array.from({ length: table.rows }).map((_, index) => (
              <div className="database-table-skeleton-row" key={index}>
                <span className="database-table-skeleton-key" />
                <span className="database-table-skeleton-column" />
                <span className="database-table-skeleton-type" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <style jsx>{`
        .database-canvas-skeleton {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 320px;
          overflow: hidden;
          background: #fff;
        }

        .database-canvas-skeleton-grid {
          position: absolute;
          inset: 0;
          opacity: 0.55;
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .database-canvas-skeleton-label {
          position: absolute;
          top: 12px;
          left: 14px;
          z-index: 2;
          padding: 5px 8px;
          border: 1px solid #dbe3ee;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.9);
          color: #94a3b8;
          font: 800 9px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
          letter-spacing: 0.12em;
        }

        .database-table-skeleton {
          position: absolute;
          left: 7%;
          width: min(260px, 34%);
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
        }

        .database-table-skeleton:nth-of-type(3) { top: 8%; }
        .database-table-skeleton:nth-of-type(4) { top: 32%; }
        .database-table-skeleton:nth-of-type(5) { top: 56%; }
        .database-table-skeleton:nth-of-type(6) { top: 80%; }

        .database-table-skeleton-header {
          display: flex;
          align-items: center;
          gap: 9px;
          height: 42px;
          padding: 0 12px;
          border-bottom: 1px solid #edf2f7;
        }

        .database-table-skeleton-icon,
        .database-table-skeleton-title,
        .database-table-skeleton-menu,
        .database-table-skeleton-key,
        .database-table-skeleton-column,
        .database-table-skeleton-type {
          display: block;
          background: #e8edf3;
          animation: databaseSkeletonPulse 1.35s ease-in-out infinite;
        }

        .database-table-skeleton-icon {
          width: 18px;
          height: 18px;
          border-radius: 5px;
        }

        .database-table-skeleton-title {
          width: 82px;
          height: 10px;
          border-radius: 999px;
        }

        .database-table-skeleton-menu {
          width: 18px;
          height: 8px;
          margin-left: auto;
          border-radius: 999px;
        }

        .database-table-skeleton-body {
          padding: 8px 12px 10px;
        }

        .database-table-skeleton-row {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 27px;
        }

        .database-table-skeleton-key {
          width: 10px;
          height: 10px;
          border-radius: 3px;
        }

        .database-table-skeleton-column {
          width: 52%;
          height: 8px;
          border-radius: 999px;
        }

        .database-table-skeleton-type {
          width: 25%;
          height: 7px;
          margin-left: auto;
          border-radius: 999px;
        }

        @keyframes databaseSkeletonPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }

        @media (max-width: 600px) {
          .database-table-skeleton {
            left: 5%;
            width: 44%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .database-table-skeleton-icon,
          .database-table-skeleton-title,
          .database-table-skeleton-menu,
          .database-table-skeleton-key,
          .database-table-skeleton-column,
          .database-table-skeleton-type {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
