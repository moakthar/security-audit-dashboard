import React, { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

const SearchBar = ({
  onSearch,
  initialValue = "",
  placeholder = "SEARCH LOGS BY ACTOR, ACTION, OR RESOURCE...",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef(null);
  const { theme } = useTheme();

  // Theme-aware classes
  const themeClasses = {
    border: theme === "light" ? "border-black" : "border-white",
    bg: theme === "light" ? "bg-white" : "bg-black",
    text: theme === "light" ? "text-black" : "text-white",
    placeholder:
      theme === "light"
        ? "placeholder:text-black/40"
        : "placeholder:text-white/40",
    focusBg: theme === "light" ? "focus:bg-yellow-50" : "focus:bg-gray-800",
    iconColor: theme === "light" ? "text-black" : "text-white",
    iconHover:
      theme === "light"
        ? "hover:bg-black hover:text-white"
        : "hover:bg-white hover:text-black",
    clearBtnBg: theme === "light" ? "hover:bg-black" : "hover:bg-white",
    clearBtnText: theme === "light" ? "hover:text-white" : "hover:text-black",
    shadow:
      theme === "light"
        ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        : "shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
  };

  // Debounce search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleKeyDown = (e) => {
    // Clear on Escape key
    if (e.key === "Escape") {
      handleClear();
      e.target.blur();
    }
    // Search on Enter key
    if (e.key === "Enter") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      onSearch(searchTerm);
    }
  };

  return (
    <div className={`relative group ${themeClasses.shadow}`}>
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
        <MagnifyingGlassIcon
          className={`h-7 w-7 sm:h-8 sm:w-8 ${themeClasses.iconColor} transition-colors duration-200`}
        />
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full border-4 ${themeClasses.border} ${themeClasses.bg} ${themeClasses.text} pl-16 sm:pl-20 pr-14 sm:pr-16 py-5 sm:py-6 text-xl sm:text-2xl font-mono ${themeClasses.placeholder} focus:outline-none ${themeClasses.focusBg} transition-all duration-200`}
        aria-label="Search logs"
      />

      {/* Clear Button with animation */}
      {searchTerm && (
        <button
          onClick={handleClear}
          className={`absolute inset-y-0 right-0 pr-4 sm:pr-6 flex items-center transition-all duration-200 ${themeClasses.clearBtnBg} ${themeClasses.clearBtnText} rounded-r-md group/clear`}
          aria-label="Clear search"
          title="Clear search (Esc)">
          <XMarkIcon
            className={`h-7 w-7 sm:h-8 sm:w-8 ${themeClasses.iconColor} transition-all duration-200 group-hover/clear:rotate-90`}
          />
        </button>
      )}

      {/* Search Stats - Optional */}
      {searchTerm && searchTerm.length > 0 && (
        <div
          className={`absolute -bottom-8 right-0 text-xs font-mono tracking-wider ${themeClasses.mutedText || "text-black/40 dark:text-white/40"} transition-all duration-200`}>
          {searchTerm.length} chars
        </div>
      )}

      {/* Keyboard shortcut hint - Optional */}
      {!searchTerm && !isFocused && (
        <div
          className={`absolute -bottom-8 right-0 text-xs font-mono tracking-wider ${themeClasses.mutedText || "text-black/30 dark:text-white/30"} opacity-50 transition-all duration-200 hidden sm:block`}>
          ⌘K to search
        </div>
      )}
    </div>
  );
};

// Custom hook for keyboard shortcut (⌘K)
export const useSearchShortcut = (searchRef) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchRef]);
};

export default SearchBar;
