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

import React, { useState } from 'react';
// ...rest imports...

import NotificationSettingsModal from './components/NotificationSettingsModal';

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

  // State for custom summarizer
  const [customText, setCustomText] = useState('');
  const [customSummary, setCustomSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  // Push notification modal, simulation logic & prefs (simulate, no actual push in this demo)
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState(() => {
    // Try to retrieve from localStorage
    try {
      return JSON.parse(window.localStorage.getItem('np-notif-prefs') || "{}");
    } catch {
      return {};
    }
  });

  // Handlers
  const handleOpenArticle = (article) => setModalArticle(article);
  const handleCloseModal = () => setModalArticle(null);
  const handleBookmarkClick = (articleId) => {
    // Find article
    const article = articles.find(a => a.id === articleId);
    if (article) toggleBookmark(article);
  };
  const handleToggleBookmarks = () => setBookmarksOpen(b => !b);

  // Toggle notification category
  const handleNotifPrefChange = (cat) => {
    setNotifPrefs(prev => {
      const updated = { ...prev };
      if (cat === "breaking") {
        updated.breaking = !prev.breaking;
      } else {
        updated[cat] = !prev[cat];
      }
      window.localStorage.setItem("np-notif-prefs", JSON.stringify(updated));
      return updated;
    });
  };

  // Simulate "request" for push notification permissions
  const handleRequestPushPermission = () => {
    // Simulate prompt/permission granted
    setNotification("Push notifications enabled! (simulation)");
    setNotifModalOpen(false);
  };

  // Simulate AI summarization for user input, or would call API
  const handleCustomSummarize = () => {
    setSummarizing(true);
    setTimeout(() => {
      // Use demo summarizer from utils/generateSummary
      import('./utils/generateSummary').then(mod => {
        setCustomSummary(mod.generateSummary(customText));
        setSummarizing(false);
      });
    }, 600);
  };

  return (
    <div className={`app ${theme}`}>
      <Navbar
        openBookmarks={handleToggleBookmarks}
        ThemeToggle={<ThemeToggle theme={theme} onToggle={toggleTheme} />}
      />
      <button
        className="btn"
        style={{
          position: "fixed",
          bottom: 34,
          right: 24,
          zIndex: 1100,
          borderRadius: "50%",
          boxShadow: "0 1.5px 8px 0 #1117",
          width: 56,
          height: 56,
          background: "var(--accent)"
        }}
        aria-label="Notification Preferences"
        title="Notification Preferences"
        onClick={() => setNotifModalOpen(true)}
      >
        <span style={{fontSize: "1.36rem"}} role="img" aria-label="bell">🔔</span>
      </button>
      <NotificationSettingsModal
        open={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        categories={categories}
        preferences={preferences}
        notifPrefs={notifPrefs}
        onChange={handleNotifPrefChange}
        onRequestPermission={handleRequestPushPermission}
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

          {/* --- Custom Summarizer Section --- */}
          <section style={{
            margin: "42px 0 32px 0",
            background: "var(--card-bg)",
            borderRadius: 14,
            padding: "30px 20px",
            boxShadow: "0 2px 20px 0 rgba(30,30,40,0.11)",
            maxWidth: 650
          }}>
            <h2 style={{marginTop:0, fontSize:"1.29rem", fontWeight: 600}}>Custom AI Summarizer</h2>
            <p style={{color:"var(--text-secondary)", marginBottom: 15}}>Paste any article or text below and get a short, AI-powered summary instantly.</p>
            <textarea
              style={{
                width: "100%",
                minHeight: 88,
                fontSize: "1rem",
                borderRadius: 7,
                padding: 10,
                marginBottom: 12,
                background: "var(--modal-bg)",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                resize: "vertical"
              }}
              placeholder="Paste text or article content here..."
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              disabled={summarizing}
            />
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom: 10}}>
              <button
                className="btn"
                style={{marginRight:8}}
                disabled={!customText || summarizing}
                onClick={handleCustomSummarize}
              >
                {summarizing ? "Summarizing..." : "Summarize"}
              </button>
              <span style={{ color: "var(--accent)" }}>{summarizing && '⏳ Generating summary...'}</span>
              {customSummary && <span style={{
                marginLeft: 8,
                color:"var(--accent)",
                fontWeight:500
              }}>✔️ Summary Ready</span>}
            </div>
            {customSummary &&
              <div style={{
                background: "var(--modal-bg)",
                borderRadius:8,
                padding:"12px 15px",
                color:"var(--text-secondary)",
                lineHeight:1.5,
                border:"1px solid var(--border-color)"
              }}>
                <span style={{color:"var(--accent)", fontWeight:600}}>AI Summary:{" "}</span>
                {customSummary}
              </div>
            }
          </section>
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