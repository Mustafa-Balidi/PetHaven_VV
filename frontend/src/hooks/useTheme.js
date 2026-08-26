import { useCallback, useEffect, useState } from "react";

const THEME_KEY = "pethaven-theme";
const THEME_EVENT = "pethaven-theme-change";

function getTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme, persist = true) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;

  if (persist) localStorage.setItem(THEME_KEY, nextTheme);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: nextTheme }));
}

export default function useTheme() {
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const syncTheme = () => setTheme(getTheme());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystemTheme = (event) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(event.matches ? "dark" : "light", false);
      }
    };

    window.addEventListener(THEME_EVENT, syncTheme);
    window.addEventListener("storage", syncTheme);
    media.addEventListener("change", followSystemTheme);

    return () => {
      window.removeEventListener(THEME_EVENT, syncTheme);
      window.removeEventListener("storage", syncTheme);
      media.removeEventListener("change", followSystemTheme);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(getTheme() === "dark" ? "light" : "dark");
  }, []);

  return { theme, toggleTheme };
}

