import React from "react";
import PropTypes from "prop-types";

import "./CategoryFilter.css";

// PUBLIC_INTERFACE
/**
 * Displays selectable news categories with icons and colors.
 */
export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="category-filter-bar">
      <button
        className={`category-btn${selected === "All" ? " active" : ""}`}
        style={{ "--cat-color": "var(--gray-category)" }}
        onClick={() => onSelect("All")}
        tabIndex={0}
      >
        <span className="cat-icon">🌐</span> All
      </button>
      {categories.map(({ name, icon, colorVar }) => (
        <button
          key={name}
          className={`category-btn${selected === name ? " active" : ""}`}
          style={{ "--cat-color": `var(--${colorVar}-category)` }}
          onClick={() => onSelect(name)}
          tabIndex={0}
        >
          <span className="cat-icon" aria-hidden>{icon}</span>
          {name}
        </button>
      ))}
    </div>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.array.isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
