import React from "react";
import PropTypes from "prop-types";

import "./Navbar.css";

// PUBLIC_INTERFACE
/**
 * Primary navigation bar for NewsPulse.
 * Displays logo, dark mode toggle, and bookmarks button.
 */
export default function Navbar({ openBookmarks, ThemeToggle }) {
  return (
    <nav className="navbar">
      <div className="container navbar-flex">
        <div className="logo">
          <span className="logo-symbol">*</span> NewsPulse
        </div>
        <div className="navbar-actions">
          {ThemeToggle}
          <button aria-label="Bookmarks" className="icon-btn" onClick={openBookmarks} title="Bookmarks">
            <span role="img" aria-label="Bookmarks" style={{fontSize: 18}}>🔖</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  openBookmarks: PropTypes.func.isRequired,
  ThemeToggle: PropTypes.node.isRequired,
};
