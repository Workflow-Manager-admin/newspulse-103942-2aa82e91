import React from "react";
import PropTypes from "prop-types";

// PUBLIC_INTERFACE
/**
 * Modal for adjusting push notification preferences.
 */
export default function NotificationSettingsModal({ open, onClose, categories, preferences, notifPrefs, onChange, onRequestPermission }) {
  if (!open) return null;
  return (
    <div
      style={{
        zIndex: 2200,
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(18, 18, 23, 0.84)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--modal-bg)",
          color: "var(--text-color)",
          borderRadius: 15,
          width: 370,
          maxWidth: "97vw",
          padding: "29px 24px 21px 24px",
          boxShadow: "0 4px 28px 0 #11182a33",
          border: "1.5px solid var(--border-color)"
        }}
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: "1.13rem", fontWeight: 600 }}>Notification Preferences</h2>
          <button style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "1.35rem",
            borderRadius: 11,
            padding: "2px 8px",
            cursor: "pointer"
          }} onClick={onClose} aria-label="Close">×</button>
        </div>
        <div style={{ marginBottom: 10, color: "var(--text-secondary)", fontSize: ".98rem" }}>
          Choose which categories you want to get breaking news notifications for.
        </div>
        <div style={{ marginBottom: 13 }}>
          {categories.map(cat => (
            <div key={cat.name} style={{ display: "flex", alignItems: "center", marginBottom: 7 }}>
              <input
                type="checkbox"
                id={`notif-cat-${cat.name}`}
                checked={notifPrefs?.[cat.name] ?? preferences.includes(cat.name)}
                onChange={() => onChange(cat.name)}
                style={{ accentColor: "var(--accent)", marginRight: 9 }}
              />
              <label htmlFor={`notif-cat-${cat.name}`} style={{ fontSize: ".99rem", color: "var(--text-color)" }}>
                <span style={{ marginRight: 7 }}>{cat.icon}</span>
                {cat.name}
              </label>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 19 }}>
          <input
            type="checkbox"
            id="notif-breaking"
            checked={notifPrefs?.breaking || false}
            onChange={() => onChange("breaking")}
            style={{ accentColor: "var(--secondary)", marginRight: 9 }}
          />
          <label htmlFor="notif-breaking" style={{ fontSize: ".99rem", color: "var(--text-color)" }}>
            🔥 Breaking News Alerts
          </label>
        </div>
        <button
          className="btn"
          style={{ width: "100%", marginBottom: 2 }}
          onClick={onRequestPermission}
        >
          Enable Push Notifications
        </button>
      </div>
    </div>
  );
}

NotificationSettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  preferences: PropTypes.array.isRequired,
  notifPrefs: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onRequestPermission: PropTypes.func.isRequired
};
