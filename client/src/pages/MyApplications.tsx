import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Application {
  _id: string;
  companyId: { _id: string; name: string };
  jobTitle: string;
  status: string;
  notes?: string;
  lastUpdated: string;
}

interface CompanyGroup {
  companyId: string;
  companyName: string;
  applications: Application[];
}

export default function MyApplications() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [groups, setGroups] = useState<CompanyGroup[]>([]);
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
        const data: Application[] = await res.json();
        if (!res.ok) {
          setError("Failed to load applications");
          return;
        }

        // Group applications by company
        const grouped = new Map<string, CompanyGroup>();
        for (const app of data) {
          const companyId = app.companyId?._id ?? "unknown";
          const companyName = app.companyId?.name ?? "Unknown Company";
          if (!grouped.has(companyId)) {
            grouped.set(companyId, {
              companyId,
              companyName,
              applications: [],
            });
          }
          grouped.get(companyId)!.applications.push(app);
        }
        setGroups(Array.from(grouped.values()));
      } catch (err) {
        setError("Server error, please try again");
      }
    };
    fetchApplications();
  }, [token]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) {
        setError("Failed to delete application");
        return;
      }
      setGroups((prev) =>
        prev
          .map((group) => ({
            ...group,
            applications: group.applications.filter((app) => app._id !== id),
          }))
          .filter((group) => group.applications.length > 0),
      );
    } catch (err) {
      setError("Server error, please try again");
    }
  };

  return (
    <>
      <div className="tabs">
        <button className="tab" onClick={() => navigate("/")}>
          Dashboard
        </button>
        <button className="tab" onClick={() => navigate("/companies")}>
          My Companies
        </button>
        <button className="tab" onClick={() => navigate("/add-company")}>
          Add Company
        </button>
        <button className="tab active">My Applications</button>
        <button className="tab" onClick={() => navigate("/add-application")}>
          Add Application
        </button>
      </div>
      <main>
        <h1>My Applications</h1>

        {error && <p className="auth-error">{error}</p>}

        {groups.length === 0 && !error && (
          <p className="empty-state">No applications yet.</p>
        )}

        <div className="applications-page">
          {groups.map((group) => (
            <div key={group.companyId} className="application-group">
              <h2 className="company-heading">{group.companyName}</h2>
              <ul className="application-sublist">
                {group.applications.map((app) => (
                  <li key={app._id} className="application-row">
                    <div>
                      <strong>{app.jobTitle}</strong>
                      <span className={`status-badge status-${app.status}`}>
                        {app.status}
                      </span>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(app._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
