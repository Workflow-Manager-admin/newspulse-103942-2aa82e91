import { useState, useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * React hook for dark/light theme toggle.
 * Remembers user choice via localStorage.
 */
export default function useDarkMode() {
  const getInitTheme = () => {
    if (window.localStorage && window.localStorage.getItem("news-theme"))
      return window.localStorage.getItem("news-theme");
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
      return "dark";
    return "light";
  };

  const [theme, setTheme] = useState(getInitTheme());

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("light", theme === "light");
    window.localStorage && window.localStorage.setItem("news-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((cur) => (cur === "dark" ? "light" : "dark"));

  return [theme, toggleTheme];
}
