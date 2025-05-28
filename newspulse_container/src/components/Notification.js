import React from "react";
import PropTypes from "prop-types";
import "./Notification.css";

// PUBLIC_INTERFACE
/**
 * Toast-like notification for category and info messages.
 */
export default function Notification({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="notification">
      <span>{message}</span>
      <button className="notif-dismiss" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};
