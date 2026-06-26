import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AddCompany() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "",
    url: "",
    keywords: "",
    notes: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.url) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          url: form.url,
          keywords: form.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to add company");
        return;
      }
      setForm({ name: "", url: "", keywords: "", notes: "" });
    } catch (err) {
      setError("Server error, please try again");
    }
  };

  return (
    <>
      <div className="tabs">
        <button className="tab" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
        <button className="tab" onClick={() => navigate("/companies")}>
          My Companies
        </button>
        <button className="tab active">Add Company</button>
        <button className="tab" onClick={() => navigate("/applications")}>
          My Applications
        </button>
        <button className="tab active">Add Application</button>
      </div>
      <main>
        <h1>Add a Company</h1>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="company">Company Name</label>
          <input
            type="text"
            id="company"
            placeholder="e.g. Google"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label htmlFor="url">Job Board URL</label>
          <input
            type="url"
            id="url"
            placeholder="e.g. https://careers.google.com"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />

          <label htmlFor="keywords">Keywords</label>
          <input
            type="text"
            id="keywords"
            placeholder="e.g. Software Engineer, Python, Remote"
            value={form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
          />

          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            placeholder="e.g. Check every Monday..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button type="submit">Add Company</button>
        </form>
      </main>
    </>
  );
}
