import ProfileSettings from "../components/ProfileSettings";
import ConnectedAccountsSettings from "../components/ConnectedAccountsSettings";
import SecuritySettings from "../components/SecuritySettings";

const settingsSections = [
  { id: "profile", label: "Profile" },
  { id: "connections", label: "Connected Accounts" },
  { id: "security", label: "Security" },
  { id: "danger-zone", label: "Delete Account" },
];

export default function Settings() {
  return (
    <main className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Manage your profile, connected services, and account security.</p>
      </header>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <nav aria-label="Settings sections">
            {settingsSections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="settings-sections">
          <section id="profile" className="settings-section">
            <header>
              <h2>Profile</h2>
              <p>Update the personal information for your account.</p>
            </header>

            <ProfileSettings />
          </section>

          <section id="connections" className="settings-section">
            <header>
              <h2>Connected Accounts</h2>
              <p>Connect services that help manage your job search.</p>
            </header>

            <ConnectedAccountsSettings />
          </section>

          <section id="security" className="settings-section">
            <header>
              <h2>Security</h2>
              <p>Update your password and manage active sessions.</p>
            </header>

            <SecuritySettings />
          </section>

          <section id="danger-zone" className="settings-section danger-zone">
            <header>
              <h2>Delete Account</h2>
              <p>Permanently remove your account and all associated data.</p>
            </header>
            <button type="submit" className="danger-button">
              Delete account
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
