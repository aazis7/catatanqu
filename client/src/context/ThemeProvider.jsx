import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({
  storageKey = "catatanqu_ui_theme",
  initialTheme = "dark",
  children,
}) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored) return stored;

      // Check if dark class is already on documentElement (from HTML script)
      if (document.documentElement.classList.contains("dark")) {
        return "dark";
      }

      return initialTheme;
    }
    return initialTheme;
  });

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, isHydrated, storageKey]);

  useEffect(() => {
    const controller = new AbortController();
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      // Only auto-switch if user hasn't explicitly set a theme
      const storedTheme = localStorage.getItem(storageKey);
      if (!storedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", handleChange, {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [storageKey]);

  const value = {
    theme,
    setTheme,
    toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
