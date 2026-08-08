import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SecuritySettings() {
  const { token } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Your password must contain at least eight characters.");
      return;
    }

    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to change password",
        );
      }

      setPassword("");
      setConfirmation("");
      setSuccess("Password changed successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to change your password",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      {error && <p className="settings-message error">{error}</p>}
      {success && <p className="settings-message success">{success}</p>}

      <label>
        New password
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      <label>
        Confirm new password
        <input
          type="password"
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
        />
      </label>

      <div className="settings-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Changing password..." : "Change password"}
        </button>
      </div>
    </form>
  );
}
