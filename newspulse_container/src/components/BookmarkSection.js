import React from "react";
import PropTypes from "prop-types";
import "./BookmarkSection.css";

// PUBLIC_INTERFACE
/**
 * Slide-in panel showing user’s bookmarked articles.
 */
export default function BookmarkSection({ open, articles, onClose, onOpenArticle, categories }) {
  return (
    <div className={`bookmark-section${open ? " open" : ""}`}>
      <div className="bookmark-header">
        <span style={{fontWeight:600, fontSize:'1.1rem'}}>Bookmarked Articles</span>
        <button className="bookmark-close-btn" onClick={onClose} aria-label="Close">×</button>
      </div>
      {articles.length === 0 ? (
        <div className="bookmark-empty">No bookmarks yet.</div>
      ) : (
        articles.map(article => (
          <div
            key={article.id}
            className="bookmark-item"
            role="button"
            tabIndex={0}
            onClick={() => {
              onOpenArticle(article);
              onClose();
            }}
          >
            <img src={article.image} alt={article.title} className="bookmark-thumb" />
            <div className="bookmark-info">
              <div className="bookmark-title">{article.title}</div>
              <div className="bookmark-cat" style={{background: categories.find(c=>c.name===article.category)?`var(--${categories.find(c=>c.name===article.category).colorVar}-category)`:'var(--gray-category)'}}>
                {categories.find(c=>c.name===article.category)?.icon ?? "📰"} {article.category}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

BookmarkSection.propTypes = {
  open: PropTypes.bool.isRequired,
  articles: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenArticle: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};
