import { useTheme } from "@/context/ThemeProvider";
import { MdDarkMode, MdLightMode } from "react-icons/md";

import { Button } from "./ui/button";

export function ThemeToggle({ size = 20 }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <div className="relative">
        <MdLightMode
          size={size}
          className={`
            transition-all duration-300 ease-in-out
            ${
              theme === "dark"
                ? "opacity-0 rotate-90 scale-0"
                : "opacity-100 rotate-0 scale-100"
            }
          `}
        />
        <MdDarkMode
          size={size}
          className={`
            absolute inset-0 transition-all duration-300 ease-in-out
            ${
              theme === "dark"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-0"
            }
          `}
        />
      </div>
    </Button>
  );
}
