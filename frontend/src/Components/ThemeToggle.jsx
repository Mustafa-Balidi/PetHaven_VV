import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme.js";
import Icon from "./Icon.jsx";

export default function ThemeToggle({ className = "" }) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={t(isDark ? "theme.switchToLight" : "theme.switchToDark")}
      title={t(isDark ? "theme.switchToLight" : "theme.switchToDark")}
      aria-pressed={isDark}
    >
      <Icon name={isDark ? "light_mode" : "dark_mode"} />
    </button>
  );
}

