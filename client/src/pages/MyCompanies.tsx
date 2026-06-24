import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Company = {
  _id: string;
  name: string;
  url: string;
  keywords: string[];
  notes: string;
};

export default function MyCompanies() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/companies`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load companies");
          return;
        }
        setCompanies(data);
      } catch (err) {
        setError("Server error, please try again");
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, [token]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/companies/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) return;
      setCompanies(companies.filter((c) => c._id !== id));
    } catch (err) {
      setError("Failed to delete company");
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
      </div>
      <main>
        <h1>My Companies</h1>

        {error && <p className="auth-error">{error}</p>}
        {loading && <p>Loading...</p>}

        {!loading && companies.length === 0 && (
          <p>You haven't added any companies yet.</p>
        )}

        <div className="company-list">
          {companies.map((company) => (
            <div className="company-card" key={company._id}>
              <h3>{company.name}</h3>
              <p>
                <span className="card-label">Website:</span>{" "}
                <a href={company.url} target="_blank" rel="noopener noreferrer">
                  {company.url}
                </a>
              </p>
              {company.keywords.length > 0 && (
                <p>
                  <span className="card-label">Keywords:</span>{" "}
                  <span className="card-value">
                    {company.keywords.join(", ")}
                  </span>
                </p>
              )}
              {company.notes && (
                <p>
                  <span className="card-label">Notes:</span>{" "}
                  <span className="card-value">{company.notes}</span>
                </p>
              )}
              <button onClick={() => handleDelete(company._id)}>Delete</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
