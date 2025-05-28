import React from "react";
import PropTypes from "prop-types";
import "./ArticleModal.css";

// PUBLIC_INTERFACE
/**
 * Modal dialog to read the full article, show summary, and manage bookmark.
 */
export default function ArticleModal({ article, categories, onClose, onBookmark }) {
  if (!article) return null;

  const catData = categories.find(c => c.name === article.category);
  const tagColor = catData ? `var(--${catData.colorVar}-category)` : 'var(--gray-category)';
  const icon = catData ? catData.icon : "📰";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} tabIndex={-1}>
        <button className="modal-close-btn" onClick={onClose} tabIndex={0} aria-label="Close">×</button>
        <div className="modal-header">
          <span className="news-cat-tag" style={{background: tagColor}}>
            <span className="cat-icon">{icon}</span>
            <span>{article.category}</span>
          </span>
          <span style={{flex: 1}} />
          <button
            className={`bookmark-btn${article.isBookmarked ? " active" : ""}`}
            onClick={() => onBookmark(article.id)}
            aria-label={article.isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
            tabIndex={0}
          >{article.isBookmarked ? "★" : "☆"}</button>
        </div>
        <h2 className="modal-title">{article.title}</h2>
        <div className="modal-meta">
          <span>{article.source}</span>
          <span>·</span>
          <span>{article.publishedAt}</span>
        </div>
        <img src={article.image} alt={article.title} className="modal-article-img" />
        <div className="modal-content">
          {article.summary && (
            <div className="ai-summary">
              <span className="ai-label">AI Summary:</span> {article.summary}
            </div>
          )}
          <div className="article-full">{article.content}</div>
        </div>
      </div>
    </div>
  );
}

ArticleModal.propTypes = {
  article: PropTypes.object,
  categories: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onBookmark: PropTypes.func.isRequired,
};
