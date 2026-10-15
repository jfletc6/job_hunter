import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

type Decision = "APPROVED" | "REJECTED";

interface Job {
  _id: string;
  company: string;
  jobTitle: string;
  location?: string;
  workType?: string;
  url: string;
  dateFound?: string;
  validationStatus?: string;
}

const API = import.meta.env.VITE_API_URL;

// Only render real web links — scraped data could contain javascript: or junk
function safeUrl(raw: string): URL | null {
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:" ? u : null;
  } catch {
    return null;
  }
}

export default function JobReviewModule() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API}/api/jobs?validationStatus=VALID`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError("Failed to load jobs");
          return;
        }
        setJobs(data);
      } catch {
        setError("Server error, please try again");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  const reviewJob = async (job: Job, decision: Decision) => {
    if (
      decision === "REJECTED" &&
      !window.confirm(`Reject "${job.jobTitle}" at ${job.company}?`)
    ) {
      return;
    }

    setBusyId(job._id);
    setError("");
    try {
      const res = await fetch(`${API}/api/jobs/${job._id}/validation`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ validationStatus: decision }),
      });
      if (!res.ok) {
        setError(`Couldn't update "${job.jobTitle}". Try again.`);
        return;
      }
      // Reviewed jobs (either decision) leave the pending list
      setJobs((prev) => prev.filter((j) => j._id !== job._id));
    } catch {
      setError("Server error, please try again");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="dashboard-card job-review-card">
      <div className="job-review-header">
        <h2>Jobs to Review</h2>
        <span className="job-review-badge">{jobs.length}</span>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <p className="empty-state">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="empty-state">Nothing waiting for review.</p>
      ) : (
        <div className="job-table-wrap">
          <table className="job-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Job Title</th>
                <th>Location</th>
                <th>Work Type</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const url = safeUrl(job.url);
                const busy = busyId === job._id;
                return (
                  <tr key={job._id} className={busy ? "row-busy" : undefined}>
                    <td data-label="Company">{job.company}</td>
                    <td data-label="Job Title">{job.jobTitle}</td>
                    <td data-label="Location">{job.location || "—"}</td>
                    <td data-label="Work Type">{job.workType || "—"}</td>
                    <td data-label="Link">
                      {url ? (
                        <a
                          href={url.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={url.href}
                        >
                          {url.hostname.replace(/^www\./, "")}
                        </a>
                      ) : (
                        <span className="job-invalid-url" title={job.url}>
                          Invalid URL
                        </span>
                      )}
                    </td>
                    <td data-label="Actions">
                      <div className="job-actions">
                        <button
                          className="job-btn job-btn-approve"
                          disabled={busy}
                          onClick={() => reviewJob(job, "APPROVED")}
                        >
                          Approve
                        </button>
                        <button
                          className="job-btn job-btn-deny"
                          disabled={busy}
                          onClick={() => reviewJob(job, "REJECTED")}
                        >
                          Deny
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
