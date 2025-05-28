import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Onboarding.css";

// PUBLIC_INTERFACE
/**
 * Onboarding wizard for setting user news category preferences.
 */
export default function Onboarding({ categories, onComplete }) {
  const [selected, setSelected] = useState([]);

  const handleToggle = (name) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );

  const handleStart = () => onComplete(selected);

  return (
    <div className="onboard-overlay">
      <div className="onboard-modal" tabIndex={-1}>
        <h2>Welcome to NewsPulse!</h2>
        <p>Choose your favorite news categories to personalize your feed:</p>
        <div className="onboard-category-list">
          {categories.map(({ name, icon, colorVar }) => (
            <button
              key={name}
              className={`onboard-cat-btn${selected.includes(name) ? " selected" : ""}`}
              style={{ "--cat-color": `var(--${colorVar}-category)` }}
              onClick={() => handleToggle(name)}
              tabIndex={0}
            >
              <span className="cat-icon" aria-hidden>{icon}</span>
              {name}
            </button>
          ))}
        </div>
        <button className="btn btn-large" onClick={handleStart} disabled={selected.length === 0}>Start Reading</button>
      </div>
    </div>
  );
}

Onboarding.propTypes = {
  categories: PropTypes.array.isRequired,
  onComplete: PropTypes.func.isRequired,
};
