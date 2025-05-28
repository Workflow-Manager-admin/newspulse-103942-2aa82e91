import React from "react";
import PropTypes from "prop-types";
import "./NewsCard.css";

// PUBLIC_INTERFACE
/**
 * News card for individual article with image, headline, category tag, and bookmark.
 */
export default function NewsCard({ article, onClick, onBookmark, categories }) {
  const catData = categories.find(c => c.name === article.category);
  const tagColor = catData ? `var(--${catData.colorVar}-category)` : 'var(--gray-category)';
  const icon = catData ? catData.icon : "📰";

  return (
    <div className="news-card" tabIndex={0} role="button" onClick={onClick}>
      <div className="news-img-wrap">
        <img src={article.image} alt={article.title} className="news-img" />
      </div>
      <div className="news-card-body">
        <div className="news-cat-tag" style={{background: tagColor}}>
          <span className="cat-icon">{icon}</span>
          <span>{article.category}</span>
        </div>
        <h3 className="news-title">{article.title}</h3>
        <div className="news-meta">
          <span className="news-source">{article.source}</span>
          <span className="news-date">{article.publishedAt}</span>
        </div>
      </div>
      <button
        className={`bookmark-btn${article.isBookmarked ? " active" : ""}`}
        aria-label={article.isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
        onClick={e => {
          e.stopPropagation();
          onBookmark();
        }}
        title="Bookmark"
        tabIndex={0}
      >
        {article.isBookmarked ? "★" : "☆"}
      </button>
    </div>
  );
}

NewsCard.propTypes = {
  article: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onBookmark: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};
