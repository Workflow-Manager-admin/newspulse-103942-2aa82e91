import React from "react";
import PropTypes from "prop-types";
import "./ThemeToggle.css";

// PUBLIC_INTERFACE
/** Toggle for dark/light mode. Changes parent theme on click. */
export default function ThemeToggle({ theme, onToggle }) {
  const label = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
  return (
    <button className="theme-toggle-btn" onClick={onToggle} title={label} aria-label={label}>
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}

ThemeToggle.propTypes = {
  theme: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
};
