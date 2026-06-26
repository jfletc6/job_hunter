import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Company {
  _id: string;
  name: string;
}

export default function AddApplication() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({
    companyId: "",
    jobTitle: "",
    status: "applied",
    notes: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/companies`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (res.ok) setCompanies(data);
      } catch (err) {
        setError("Failed to load companies");
      }
    };
    fetchCompanies();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.companyId || !form.jobTitle) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || "Failed to add application");
        return;
      }
      setForm({ companyId: "", jobTitle: "", status: "applied", notes: "" });
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
        <button className="tab" onClick={() => navigate("/applications")}>
          My Applications
        </button>
        <button className="tab active">Add Application</button>
      </div>
      <main>
        <h1>Add an Application</h1>

        {error && <p className="auth-error">{error}</p>}

        {companies.length === 0 && !error && (
          <p className="empty-state">
            You need to add a company before you can add an application.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="companyId">Company</label>
          <select
            id="companyId"
            value={form.companyId}
            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
          >
            <option value="">Select a company...</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>

          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            placeholder="e.g. Backend Engineer"
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
          />

          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>

          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            placeholder="e.g. Recruiter reached out on LinkedIn..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button type="submit">Add Application</button>
        </form>
      </main>
    </>
  );
}
