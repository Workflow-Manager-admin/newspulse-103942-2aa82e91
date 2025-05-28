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
   * Fetch news articles from NewsAPI.org based on category.
   * Fallback to demo data if network fails or rate limited.
   * 
   * Configuration: 
   * Use .env file at project root with REACT_APP_NEWSAPI_KEY for secret key injection.
   * If key not set, clear user-facing message is shown and demo mode used.
   * Do NOT hardcode a real API key in public code!
   */
  const NEWS_API_KEY =
    typeof process !== "undefined" && process.env && process.env.REACT_APP_NEWSAPI_KEY
      ? process.env.REACT_APP_NEWSAPI_KEY
      : "YOUR_NEWSAPI_KEY_HERE";
  const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";

  const [error, setError] = useState(null); // error message for feed/UI

  async function fetchArticles(categoryPref = []) {
    setLoading(true);
    setError(null);

    // Check API key precondition
    if (
      !NEWS_API_KEY ||
      NEWS_API_KEY === "" ||
      NEWS_API_KEY === "YOUR_NEWSAPI_KEY_HERE"
    ) {
      setArticles([]);
      setError(
        "⚠️ NewsAPI is not configured! Please create a .env file with 'REACT_APP_NEWSAPI_KEY=your_real_api_key' at the root, then restart. [Get free API key: https://newsapi.org/register] Demo articles are shown below."
      );
      setLoading(false);
      return;
    }

    let category =
      categoryPref && categoryPref.length === 1
        ? categoryPref[0]
        : (selectedCategory && selectedCategory !== "All" ? selectedCategory : "");
    let url = `${NEWS_API_URL}?country=us&apiKey=${NEWS_API_KEY}`;
    if (category && category !== "All") {
      const catMap = {
        Technology: "technology",
        Politics: "general", // NewsAPI has no explicit 'politics'; use 'general'
        Health: "health",
        Sports: "sports",
        Entertainment: "entertainment",
      };
      const apiCat = catMap[category] || "general";
      url += `&category=${apiCat}`;
    }

    try {
      let data;
      const resp = await fetch(url);

      if (!resp.ok) {
        // Auth or quota errors
        let errorMsg = `API error (${resp.status}): ${resp.statusText}`;
        if (resp.status === 401 || resp.status === 403) {
          errorMsg =
            "⚠️ NewsAPI authentication failed (401/403). Check API key, plan, and quota at https://newsapi.org/account. Demo articles shown below.";
        }
        throw new Error(errorMsg);
      }
      data = await resp.json();
      if (data.status !== "ok") {
        let msg = data.message || "Unknown NewsAPI error";
        if (
          /api key|invalid key|over quota|authentication|not allowed/i.test(msg)
        ) {
          msg =
            "⚠️ NewsAPI returned authentication/config error: " +
            msg +
            ". Visit https://newsapi.org/account for help. Demo articles below.";
        }
        throw new Error(msg);
      }

      const mapped = (data.articles ?? []).map((item, idx) => ({
        id: item.url || idx + "-" + (item.title || ""),
        title: item.title,
        image: item.urlToImage || "https://placehold.co/600x360/23272f/fff?text=No+Image",
        category: category || "General",
        summary: item.description || "",
        content: item.content || "",
        source: item.source?.name || "Unknown",
        publishedAt: item.publishedAt ? formatDate(item.publishedAt) : "",
        isBookmarked: bookmarks.some(b => b.title === item.title),
        url: item.url
      }));
      setArticles(mapped);
      if (mapped.length === 0) {
        setError("No articles found for this category.");
      }
    } catch (e) {
      let msg =
        "Could not fetch news from NewsAPI.org. Showing demo articles. " +
        (e?.message ? `(${e.message})` : "");

      // Detect auth/plan errors for improved guidance
      if (
        typeof e?.message === "string" &&
        (/api key|authentication|over quota|not allowed|401|403/i.test(e.message))
      ) {
        msg =
          "⚠️ Unable to authenticate with NewsAPI.org. Check your API key and quota. Demo articles shown. " +
          e.message;
      }
      setError(msg);
      const demo = [
        {
          id: 1,
          title: "Tech Giants Merge to Form New Era in AI",
          image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?fit=crop&w=600&q=80",
          category: "Technology",
          summary: "The world’s largest tech companies announced a merger that will have sweeping consequences for global AI.",
          content: "Full article content here...",
          source: "TechCrunch",
          publishedAt: "2024-06-28",
          isBookmarked: false,
          url: "#"
        },
        {
          id: 2,
          title: "World Health Organization Announces Breakthrough",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=600&q=80",
          category: "Health",
          summary: "A new medical breakthrough could change the future of healthcare.",
          content: "Full article content here...",
          source: "BBC Health",
          publishedAt: "2024-06-28",
          isBookmarked: false,
          url: "#"
        }
      ];
      setArticles(demo);
    } finally {
      setLoading(false);
    }
  }

  // Fetch data at app load or when onboarding is complete or category changes
  useEffect(() => {
    if (onboarded) {
      if (selectedCategory && selectedCategory !== "All") {
        fetchArticles([selectedCategory]);
      } else {
        fetchArticles(preferences);
      }
    }
    // eslint-disable-next-line
  }, [onboarded, selectedCategory]); // refetch on onboarding or tab/cat change

  // PUBLIC_INTERFACE
  /** Add or remove bookmark for a news article. Persists to localStorage. */
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
  /** Remove an article from bookmarks */
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

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  // PUBLIC_INTERFACE
  /** Select a news category. */
  const handleCategorySelect = cat => {
    setSelectedCategory(cat);
    setNotification(cat === "All" ? "" : `Showing ${cat} news`);
  };

  // PUBLIC_INTERFACE
  /** Complete onboarding, persist preferences. */
  const completeOnboarding = (prefs) => {
    setPreferences(prefs);
    setOnboarded(true);
    setSelectedCategory(prefs.length > 0 ? prefs[0] : "All");
    window.localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
    window.localStorage.setItem(STORAGE_KEYS.ONBOARDED, "true");
    fetchArticles(prefs);
  };

  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function formatDate(str) {
    if (!str) return "";
    const d = new Date(str);
    return d.toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric"
    });
  }

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter(a => a.category === selectedCategory);

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
