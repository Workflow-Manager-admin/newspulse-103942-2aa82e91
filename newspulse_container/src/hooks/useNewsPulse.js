import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Default set of categories (should match what's used in App.js and CategoryFilter)
export const NEWS_CATEGORIES = [
  { name: 'Technology', icon: '💻', colorVar: 'tech' },
  { name: 'Politics', icon: '🗳️', colorVar: 'politics' },
  { name: 'Health', icon: '🩺', colorVar: 'health' },
  { name: 'Sports', icon: '🏆', colorVar: 'sports' },
  { name: 'Entertainment', icon: '🎬', colorVar: 'entertainment' }
];

// LocalStorage keys
const STORAGE_KEYS = {
  BOOKMARKS: "np-bookmarks",
  PREFS: "np-preferences",
  ONBOARDED: "np-onboarding-complete",
  THEME: "news-theme",
};

const NewsPulseContext = createContext();

export function NewsPulseProvider({ children }) {
  // Theme/dark mode
  const getInitialTheme = () => {
    // Use useDarkMode implementation pattern.
    if (window.localStorage && window.localStorage.getItem(STORAGE_KEYS.THEME))
      return window.localStorage.getItem(STORAGE_KEYS.THEME);
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
      return "dark";
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("light", theme === "light");
    window.localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme(cur => (cur === "dark" ? "light" : "dark")),
    []
  );

  // Onboarding state
  const [onboarded, setOnboarded] = useState(
    !!window.localStorage.getItem(STORAGE_KEYS.ONBOARDED)
  );
  const [preferences, setPreferences] = useState(() => {
    const raw = window.localStorage.getItem(STORAGE_KEYS.PREFS);
    if (raw) return JSON.parse(raw);
    return [];
  });

  // News state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [articles, setArticles] = useState([]); // all news
  const [loading, setLoading] = useState(false);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    // bookmarks is array of article objects
    const raw = window.localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  // Notification (for showing UI messages)
  const [notification, setNotification] = useState("");

  // Article Modal
  const [modalArticle, setModalArticle] = useState(null);

  // Bookmark sidebar
  const [bookmarksOpen, setBookmarksOpen] = useState(false);

  // ----------- Data Fetching --------------
  // PUBLIC_INTERFACE
  /**
   * Fetch news articles from a mock/public API.
   * Fallback to mock data if no network access.
   * Only fetch once per load (refresh to force again).
   */
  async function fetchArticles(categoryPref = []) {
    setLoading(true);
    let url =
      "https://inshortsapi.vercel.app/news?category=" +
      ((categoryPref && categoryPref.length === 1) ? categoryPref[0].toLowerCase() : "all");
    try {
      let data;
      const resp = await fetch(url);
      data = await resp.json();
      // Map to internal article format:
      const mapped = (data.data ?? []).map((item, idx) => ({
        id: (item?.id || item?.url || idx + "-" + (item?.title||"")),
        title: item.title,
        image: item.imageUrl,
        category: capitalize(item.category || "General"),
        summary: item.content || "",
        content: item.content || "",
        source: item.source || "Unknown",
        publishedAt: item.date ? formatDate(item.date) : "",
        isBookmarked: bookmarks.some(b => b.title === item.title) // by title match
      }));
      setArticles(mapped);
    } catch (e) {
      // fallback demo data if no API
      const demo = [
        {
          id: 1,
          title: "Tech Giants Merge to Form New Era in AI", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?fit=crop&w=600&q=80",
          category: "Technology", summary: "The world’s largest tech companies announced a merger that will have sweeping consequences for global AI.",
          content: "Full article content here...", source: "TechCrunch", publishedAt: "2024-06-28", isBookmarked: false
        },
        {
          id: 2,
          title: "World Health Organization Announces Breakthrough", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=600&q=80",
          category: "Health", summary: "A new medical breakthrough could change the future of healthcare.",
          content: "Full article content here...", source: "BBC Health", publishedAt: "2024-06-28", isBookmarked: false
        }
      ];
      setArticles(demo);
      setNotification("Could not fetch news. Showing demo articles.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch data at app load or when onboarding is complete
  useEffect(() => {
    if (onboarded) {
      fetchArticles(preferences);
    }
    // eslint-disable-next-line
  }, [onboarded]);

  // ------------- Bookmarks Logic ---------------
  // PUBLIC_INTERFACE
  /**
   * Add or remove bookmark for a news article. Persists to localStorage.
   */
  const toggleBookmark = useCallback(article => {
    const existing = bookmarks.find(b => b.title === article.title);
    let updated;
    if (existing) {
      updated = bookmarks.filter(b => b.title !== article.title);
    } else {
      updated = bookmarks.concat(article);
    }
    setBookmarks(updated);
    window.localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    setArticles(prevArticles =>
      prevArticles.map(a =>
        a.id === article.id ? { ...a, isBookmarked: !a.isBookmarked } : a
      )
    );
  }, [bookmarks]);

  // PUBLIC_INTERFACE
  /**
   * Remove an article from bookmarks
   */
  const removeBookmark = (articleId) => {
    const updated = bookmarks.filter(a => a.id !== articleId);
    setBookmarks(updated);
    window.localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    setArticles(prevArticles =>
      prevArticles.map(a =>
        a.id === articleId ? { ...a, isBookmarked: false } : a
      )
    );
  };

  // Save bookmarks to localStorage when changed
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  // ------------- Category ----------------
  // PUBLIC_INTERFACE
  /**
   * Select a news category.
   */
  const handleCategorySelect = cat => {
    setSelectedCategory(cat);
    setNotification(cat === "All" ? "" : `Showing ${cat} news`);
  };

  // ------------- Onboarding Logic ---------
  // PUBLIC_INTERFACE
  /**
   * Complete onboarding, persist preferences.
   */
  const completeOnboarding = (prefs) => {
    setPreferences(prefs);
    setOnboarded(true);
    setSelectedCategory(prefs.length > 0 ? prefs[0] : "All");
    window.localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
    window.localStorage.setItem(STORAGE_KEYS.ONBOARDED, "true");
    fetchArticles(prefs);
  };

  // ----------- Utilities -----------
  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function formatDate(str) {
    // e.g. 2024-06-20T07:18:31.000Z or similar
    if (!str) return "";
    const d = new Date(str);
    return d.toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric"
    });
  }

  // ------------- Filtered Data ---------------
  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter(a => a.category === selectedCategory);

  // --------------- Context Value ---------------
  const value = {
    theme, toggleTheme,
    onboarded, preferences,
    completeOnboarding,
    selectedCategory, setSelectedCategory: handleCategorySelect,
    categories: NEWS_CATEGORIES,
    articles, setArticles,
    filteredArticles,
    bookmarks, toggleBookmark, removeBookmark, bookmarksOpen, setBookmarksOpen,
    notification, setNotification,
    modalArticle, setModalArticle,
    loading,
    fetchArticles
  };

  return (
    <NewsPulseContext.Provider value={value}>
      {children}
    </NewsPulseContext.Provider>
  );
}

// PUBLIC_INTERFACE
/**
 * Access NewsPulse context from any component.
 */
export function useNewsPulse() {
  const ctx = useContext(NewsPulseContext);
  if (!ctx) throw new Error("useNewsPulse must be used within NewsPulseProvider");
  return ctx;
}
