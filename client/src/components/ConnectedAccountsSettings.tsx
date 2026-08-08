interface ConnectedAccount {
  provider: "gmail";
  name: string;
  description: string;
  connected: boolean;
  accountEmail?: string;
}

export default function ConnectedAccounts() {
  const gmail: ConnectedAccount = {
    provider: "gmail",
    name: "Gmail",
    description:
      "Detect job applications, interviews, offers, and rejection messages.",
    connected: false,
  };

  const handleConnect = () => {
    // Future Gmail OAuth flow:
    // 1. Request an authorization URL from the backend.
    // 2. Redirect the browser to that URL.
  };

  return (
    <div className="connected-accounts">
      <article className="integration-card">
        <div className="integration-details">
          <h3 className="gmail-title" aria-label="Gmail">
            <span className="gmail-blue">G</span>
            <span className="gmail-red">m</span>
            <span className="gmail-yellow">a</span>
            <span className="gmail-blue">i</span>
            <span className="gmail-green">l</span>
          </h3>
          <p>{gmail.description}</p>

          <span
            className={`connection-status ${
              gmail.connected ? "connected" : "disconnected"
            }`}
          >
            {gmail.connected
              ? `Connected as ${gmail.accountEmail}`
              : "Not connected"}
          </span>
        </div>

        <button type="button" onClick={handleConnect}>
          {gmail.connected ? "Manage" : "Connect Gmail"}
        </button>
      </article>

      <p className="settings-help">
        Connecting Gmail does not change how you sign in. Detected emails will
        require confirmation before changing your applications.
      </p>
    </div>
  );
}
