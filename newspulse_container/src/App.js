import React from 'react';
import './App.css';

// Import NewsPulse Provider and hook
import { NewsPulseProvider, useNewsPulse } from './hooks/useNewsPulse';

// UI components
import Navbar from './components/Navbar';
import CategoryFilter from './components/CategoryFilter';
import NewsFeed from './components/NewsFeed';
import ArticleModal from './components/ArticleModal';
import BookmarkSection from './components/BookmarkSection';
import Onboarding from './components/Onboarding';
import Notification from './components/Notification';
import ThemeToggle from './components/ThemeToggle';

// App-level wiring using NewsPulseProvider and context
function AppContent() {
  const {
    theme, toggleTheme,
    onboarded, preferences, completeOnboarding,
    selectedCategory, setSelectedCategory,
    categories, filteredArticles, articles,
    bookmarks, toggleBookmark, removeBookmark, bookmarksOpen, setBookmarksOpen,
    notification, setNotification,
    modalArticle, setModalArticle,
    loading
  } = useNewsPulse();

  // Handlers
  const handleOpenArticle = (article) => setModalArticle(article);
  const handleCloseModal = () => setModalArticle(null);
  const handleBookmarkClick = (articleId) => {
    // Find article
    const article = articles.find(a => a.id === articleId);
    if (article) toggleBookmark(article);
  };
  const handleToggleBookmarks = () => setBookmarksOpen(b => !b);

  return (
    <div className={`app ${theme}`}>
      <Navbar
        openBookmarks={handleToggleBookmarks}
        ThemeToggle={<ThemeToggle theme={theme} onToggle={toggleTheme} />}
      />
      <main>
        <div className="container" style={{ paddingTop: 96 }}>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          {notification && (
            <Notification message={notification} onClose={() => setNotification('')} />
          )}
          <NewsFeed
            articles={filteredArticles}
            onOpenArticle={handleOpenArticle}
            onBookmark={handleBookmarkClick}
            categories={categories}
          />
        </div>
      </main>
      <ArticleModal
        article={modalArticle}
        categories={categories}
        onClose={handleCloseModal}
        onBookmark={handleBookmarkClick}
      />
      <BookmarkSection
        open={bookmarksOpen}
        articles={bookmarks}
        onClose={handleToggleBookmarks}
        onOpenArticle={handleOpenArticle}
        categories={categories}
      />
      {!onboarded && (
        <Onboarding categories={categories} onComplete={completeOnboarding} />
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * App root wrapped with NewsPulseProvider.
 */
function App() {
  return (
    <NewsPulseProvider>
      <AppContent />
    </NewsPulseProvider>
  );
}

export default App;