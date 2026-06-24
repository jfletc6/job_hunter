import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// ---------------------------------------------
// TYPES — match these to your future Application model
// ---------------------------------------------
type ApplicationStatus =
  | "interested"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn";

interface Application {
  _id: string;
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  dateApplied: string; // ISO date
  lastActivityDate: string; // ISO date
}

// ---------------------------------------------
// MOCK DATA — delete once API is wired up
// ---------------------------------------------
const MOCK_APPLICATIONS: Application[] = [
  {
    _id: "1",
    companyName: "Acme Corp",
    jobTitle: "Backend Engineer",
    status: "interviewing",
    dateApplied: "2026-06-01",
    lastActivityDate: "2026-06-10",
  },
  {
    _id: "2",
    companyName: "Acme Corp",
    jobTitle: "Frontend Engineer",
    status: "rejected",
    dateApplied: "2026-05-15",
    lastActivityDate: "2026-05-22",
  },
  {
    _id: "3",
    companyName: "Globex",
    jobTitle: "Full Stack Developer",
    status: "applied",
    dateApplied: "2026-06-05",
    lastActivityDate: "2026-06-05",
  },
  {
    _id: "4",
    companyName: "Initech",
    jobTitle: "Software Engineer I",
    status: "offer",
    dateApplied: "2026-05-01",
    lastActivityDate: "2026-06-15",
  },
];

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  interested: "Interested",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const NEEDS_ATTENTION_THRESHOLD_DAYS = 7;
const TERMINAL_STATUSES: ApplicationStatus[] = ["rejected", "withdrawn"];

function daysSince(dateStr: string): number {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const navigate = useNavigate();
  // const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with real fetch, e.g.:
    // fetch(`${import.meta.env.VITE_API_URL}/api/applications`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // })
    //   .then(res => res.json())
    //   .then(data => setApplications(data))
    //   .finally(() => setLoading(false))

    setApplications(MOCK_APPLICATIONS);
    setLoading(false);
  }, []);

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
      daysSince(app.lastActivityDate) >= NEEDS_ATTENTION_THRESHOLD_DAYS,
  );

  const recentActivity = [...applications]
    .sort(
      (a, b) =>
        new Date(b.lastActivityDate).getTime() -
        new Date(a.lastActivityDate).getTime(),
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
      </div>
      <main>
        <h1>Dashboard</h1>
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
                      <strong>{app.companyName}</strong> — {app.jobTitle}
                    </div>
                    <span className="attention-days">
                      {daysSince(app.lastActivityDate)}d since activity
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ACTIVE APPLICATIONS LIST */}
          <section className="dashboard-card applications-card">
            <h2>Active Applications</h2>
            <ul className="applications-list">
              {applications.map((app) => (
                <li key={app._id} className="application-item">
                  <div className="application-main">
                    <strong>{app.companyName}</strong> — {app.jobTitle}
                  </div>
                  <span className={`status-badge status-${app.status}`}>
                    {STATUS_LABELS[app.status]}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* RECENT ACTIVITY */}
          <section className="dashboard-card activity-card">
            <h2>Recent Activity</h2>
            <ul className="activity-list">
              {recentActivity.map((app) => (
                <li key={app._id} className="activity-item">
                  <span>
                    {app.companyName} → {STATUS_LABELS[app.status]}
                  </span>
                  <span className="activity-date">
                    {new Date(app.lastActivityDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
