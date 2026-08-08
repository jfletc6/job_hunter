import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface ProfileForm {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  timezone: string;
}

export default function ProfileSettings() {
  const { token } = useAuth();

  const [form, setForm] = useState<ProfileForm>({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    timezone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your profile");
        }

        setForm({
          firstname: data.firstname ?? "",
          lastname: data.lastname ?? "",
          username: data.username ?? "",
          email: data.email ?? "",
          timezone: data.timezone ?? "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load your profile",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token]);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to save changes");
      }

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save your changes",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      {error && <p className="settings-message error">{error}</p>}
      {success && <p className="settings-message success">{success}</p>}

      <div className="settings-field-row">
        <label>
          First name
          <input
            type="text"
            value={form.firstname}
            onChange={(event) => updateField("firstname", event.target.value)}
          />
        </label>

        <label>
          Last name
          <input
            type="text"
            value={form.lastname}
            onChange={(event) => updateField("lastname", event.target.value)}
          />
        </label>
      </div>

      <label>
        Username
        <input
          type="text"
          value={form.username}
          onChange={(event) => updateField("username", event.target.value)}
        />
      </label>

      <label>
        Email address
        <input
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </label>

      <label>
        Time zone
        <input
          type="text"
          value={form.timezone}
          onChange={(event) => updateField("timezone", event.target.value)}
        />
      </label>

      <div className="settings-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
