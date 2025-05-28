import React from "react";
import PropTypes from "prop-types";
import NewsCard from "./NewsCard";

import "./NewsFeed.css";
import { useNewsPulse } from "../hooks/useNewsPulse";

// PUBLIC_INTERFACE
/**
 * Displays a list of news articles as cards, with shimmer and errors.
 */
export default function NewsFeed({ articles, onOpenArticle, onBookmark, categories }) {
  const { loading, error } = useNewsPulse();

  if (loading) {
    // Render a shimmer for loading state
    return (
      <div className="news-feed">
        {[0, 1, 2, 3].map(i => (
          <div className="card-shimmer" key={i}>
            <div className="shimmer-img" />
            <div className="shimmer-line shimmer-title" />
            <div className="shimmer-line shimmer-meta" />
            <div className="shimmer-line shimmer-desc" />
            <div className="shimmer-line shimmer-desc short" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-feed">
        <div className="feed-error-msg">{error}</div>
        {/* Optionally show articles (if fallback demo displayed) */}
        {articles.length > 0 &&
          articles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onClick={() => onOpenArticle(article)}
              onBookmark={() => onBookmark(article.id)}
              categories={categories}
            />
          ))}
      </div>
    );
  }

  return (
    <div className="news-feed">
      {articles.length === 0 ? (
        <div className="empty-feed-msg">No articles found.</div>
      ) : (
        articles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onClick={() => onOpenArticle(article)}
            onBookmark={() => onBookmark(article.id)}
            categories={categories}
          />
        ))
      )}
    </div>
  );
}

NewsFeed.propTypes = {
  articles: PropTypes.array.isRequired,
  onOpenArticle: PropTypes.func.isRequired,
  onBookmark: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};
