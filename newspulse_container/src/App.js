import React, { useState } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import CategoryFilter from './components/CategoryFilter';
import NewsFeed from './components/NewsFeed';
import ArticleModal from './components/ArticleModal';
import BookmarkSection from './components/BookmarkSection';
import Onboarding from './components/Onboarding';
import Notification from './components/Notification';
import ThemeToggle from './components/ThemeToggle';

import useDarkMode from './hooks/useDarkMode';

// Dummy initial data to showcase components (would be replaced by API)
const initialArticles = [
  {
    id: 1,
    title: 'Tech Giants Merge to Form New Era in AI',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?fit=crop&w=600&q=80',
    category: 'Technology',
    summary: 'The world’s largest tech companies announced a merger that will have sweeping consequences for global AI.',
    content: 'Full article content here...',
    source: 'TechCrunch',
    publishedAt: '2024-06-28',
    isBookmarked: false
  },
  {
    id: 2,
    title: 'World Health Organization Announces Breakthrough',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=600&q=80',
    category: 'Health',
    summary: 'A new medical breakthrough could change the future of healthcare.',
    content: 'Full article content here...',
    source: 'BBC Health',
    publishedAt: '2024-06-28',
    isBookmarked: false
  },
  // Add more sample articles as needed
];

const categories = [
  { name: 'Technology', icon: '💻', colorVar: 'tech' },
  { name: 'Politics', icon: '🗳️', colorVar: 'politics' },
  { name: 'Health', icon: '🩺', colorVar: 'health' },
  { name: 'Sports', icon: '🏆', colorVar: 'sports' },
  { name: 'Entertainment', icon: '🎬', colorVar: 'entertainment' },
];

function App() {
  // Theme and dark mode
  const [theme, toggleTheme] = useDarkMode();

  // News state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles, setArticles] = useState(initialArticles);
  const [modalArticle, setModalArticle] = useState(null);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [onboardingVisible, setOnboardingVisible] = useState(false);

  // Onboarding (simulate first run for demo)
  React.useEffect(() => {
    if (window.localStorage && !window.localStorage.getItem('hasVisited')) {
      setOnboardingVisible(true);
    }
  }, []);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setNotification(cat === 'All' ? '' : `Showing ${cat} news`);
  };

  const handleOpenArticle = (article) => setModalArticle(article);

  const handleCloseModal = () => setModalArticle(null);

  const handleBookmark = (articleId) => {
    setArticles(prev =>
      prev.map(article =>
        article.id === articleId ? { ...article, isBookmarked: !article.isBookmarked } : article
      )
    );
  };

  const handleToggleBookmarks = () => setBookmarksOpen(b => !b);

  const handleOnboardingComplete = (prefs) => {
    setSelectedCategory(prefs.length > 0 ? prefs[0] : 'All');
    setOnboardingVisible(false);
    window.localStorage.setItem('hasVisited', 'true');
  };

  // Filter articles for feed and bookmarks
  const filteredArticles =
    selectedCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const bookmarkedArticles = articles.filter((a) => a.isBookmarked);

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
            onSelect={handleCategorySelect}
          />
          {notification && (
            <Notification message={notification} onClose={() => setNotification('')} />
          )}
          <NewsFeed
            articles={filteredArticles}
            onOpenArticle={handleOpenArticle}
            onBookmark={handleBookmark}
            categories={categories}
          />
        </div>
      </main>
      <ArticleModal
        article={modalArticle}
        categories={categories}
        onClose={handleCloseModal}
        onBookmark={handleBookmark}
      />
      <BookmarkSection
        open={bookmarksOpen}
        articles={bookmarkedArticles}
        onClose={handleToggleBookmarks}
        onOpenArticle={handleOpenArticle}
        categories={categories}
      />
      {onboardingVisible && (
        <Onboarding categories={categories} onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}

export default App;