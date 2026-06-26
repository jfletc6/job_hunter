import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ApplicationStatus =
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected";

interface Application {
  _id: string;
  companyId: { _id: string; name: string };
  jobTitle: string;
  status: ApplicationStatus;
  lastUpdated: string; // ISO date
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
};

const NEEDS_ATTENTION_THRESHOLD_DAYS = 7;
const TERMINAL_STATUSES: ApplicationStatus[] = ["rejected"];

function daysSince(dateStr: string): number {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (!res.ok) {
          setError("Failed to load applications");
          return;
        }
        setApplications(data);
      } catch (err) {
        setError("Server error, please try again");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  // ---------------------------------------------
  // DERIVED DATA
  // ---------------------------------------------
  const pipelineCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<ApplicationStatus, number>,
  );

  const needsAttention = applications.filter(
    (app) =>
      !TERMINAL_STATUSES.includes(app.status) &&
      daysSince(app.lastUpdated) >= NEEDS_ATTENTION_THRESHOLD_DAYS,
  );

  const recentActivity = [...applications]
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
    )
    .slice(0, 5);

  return (
    <>
      <div className="tabs">
        <button className="tab active">Dashboard</button>
        <button className="tab" onClick={() => navigate("/companies")}>
          My Companies
        </button>
        <button className="tab" onClick={() => navigate("/add-company")}>
          Add Company
        </button>
        <button className="tab" onClick={() => navigate("/applications")}>
          My Applications
        </button>
        <button className="tab" onClick={() => navigate("/add-application")}>
          Add Application
        </button>
      </div>
      <main>
        <h1>Dashboard</h1>

        {error && <p className="auth-error">{error}</p>}

        <div className="dashboard-grid">
          {/* PIPELINE COUNTS */}
          <section className="dashboard-card pipeline-card">
            <h2>Pipeline</h2>
            <div className="pipeline-row">
              {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(
                (status) => (
                  <div className="pipeline-stat" key={status}>
                    <span className="pipeline-count">
                      {pipelineCounts[status] ?? 0}
                    </span>
                    <span className="pipeline-label">
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* NEEDS ATTENTION */}
          <section className="dashboard-card attention-card">
            <h2>Needs Attention</h2>
            {needsAttention.length === 0 ? (
              <p className="empty-state">You're all caught up.</p>
            ) : (
              <ul className="attention-list">
                {needsAttention.map((app) => (
                  <li key={app._id} className="attention-item">
                    <div>
                      <strong>{app.companyId?.name}</strong> — {app.jobTitle}
                    </div>
                    <span className="attention-days">
                      {daysSince(app.lastUpdated)}d since activity
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ACTIVE APPLICATIONS LIST */}
          <section className="dashboard-card applications-card">
            <h2>Active Applications</h2>
            {applications.length === 0 ? (
              <p className="empty-state">No applications yet.</p>
            ) : (
              <ul className="applications-list">
                {applications.map((app) => (
                  <li key={app._id} className="application-item">
                    <div className="application-main">
                      <strong>{app.companyId?.name}</strong> — {app.jobTitle}
                    </div>
                    <span className={`status-badge status-${app.status}`}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* RECENT ACTIVITY */}
          <section className="dashboard-card activity-card">
            <h2>Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <p className="empty-state">No recent activity.</p>
            ) : (
              <ul className="activity-list">
                {recentActivity.map((app) => (
                  <li key={app._id} className="activity-item">
                    <span>
                      {app.companyId?.name} → {STATUS_LABELS[app.status]}
                    </span>
                    <span className="activity-date">
                      {new Date(app.lastUpdated).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
