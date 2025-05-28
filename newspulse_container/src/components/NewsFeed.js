import React from "react";
import PropTypes from "prop-types";
import NewsCard from "./NewsCard";

import "./NewsFeed.css";

// PUBLIC_INTERFACE
/**
 * Displays a list of news articles as cards.
 */
export default function NewsFeed({ articles, onOpenArticle, onBookmark, categories }) {
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
