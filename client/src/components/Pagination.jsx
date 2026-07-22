import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { theme } = useTheme();

  // Theme-aware classes
  const themeClasses = {
    border: theme === "light" ? "border-black" : "border-white",
    bg: theme === "light" ? "bg-white" : "bg-black",
    text: theme === "light" ? "text-black" : "text-white",
    mutedText: theme === "light" ? "text-black/60" : "text-white/60",
    disabledBg: theme === "light" ? "bg-gray-300" : "bg-gray-700",
    disabledText: theme === "light" ? "text-gray-500" : "text-gray-400",
    disabledBorder: theme === "light" ? "border-gray-400" : "border-gray-600",
    hoverBg: theme === "light" ? "hover:bg-yellow-100" : "hover:bg-gray-800",
    buttonPrimary:
      theme === "light"
        ? "bg-black text-white hover:bg-white hover:text-black"
        : "bg-white text-black hover:bg-black hover:text-white",
    pageActive:
      theme === "light"
        ? "bg-black text-white border-black"
        : "bg-white text-black border-white",
    pageInactive:
      theme === "light"
        ? "bg-white border-black hover:bg-yellow-100"
        : "bg-black border-white hover:bg-gray-800",
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7; // Increased for better visibility
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Add first page if not included
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push("...");
      }
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last page if not included
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className={`border-8 ${themeClasses.border} ${themeClasses.bg} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`border-4 ${themeClasses.border} font-black uppercase tracking-widest px-6 sm:px-8 py-4 sm:py-5 flex items-center gap-2 sm:gap-3 transition-all active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 w-full sm:w-auto justify-center ${
            currentPage === 1
              ? `${themeClasses.disabledBg} ${themeClasses.disabledText} ${themeClasses.disabledBorder}`
              : themeClasses.buttonPrimary
          }`}>
          <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          <span>PREV</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
          {getPageNumbers().map((page, index) => {
            const isCurrent = page === currentPage;
            const isEllipsis = page === "...";

            return (
              <button
                key={index}
                onClick={() => !isEllipsis && onPageChange(page)}
                disabled={isEllipsis}
                className={`border-4 font-black uppercase tracking-widest px-3 sm:px-6 py-3 sm:py-5 text-base sm:text-xl transition-all min-w-[40px] sm:min-w-[60px] ${
                  isCurrent
                    ? themeClasses.pageActive
                    : isEllipsis
                      ? `${themeClasses.bg} ${themeClasses.text} opacity-50 cursor-default`
                      : `${themeClasses.pageInactive} ${themeClasses.text}`
                } ${!isEllipsis ? "cursor-pointer" : "cursor-default"}
                ${!isEllipsis && !isCurrent ? "hover:scale-105" : ""}
                active:translate-x-1 active:translate-y-1`}
                aria-current={isCurrent ? "page" : undefined}>
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`border-4 ${themeClasses.border} font-black uppercase tracking-widest px-6 sm:px-8 py-4 sm:py-5 flex items-center gap-2 sm:gap-3 transition-all active:translate-x-1 active:translate-y-1 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 w-full sm:w-auto justify-center ${
            currentPage === totalPages
              ? `${themeClasses.disabledBg} ${themeClasses.disabledText} ${themeClasses.disabledBorder}`
              : themeClasses.buttonPrimary
          }`}>
          <span>NEXT</span>
          <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Page Info */}
      <div
        className={`text-center mt-4 sm:mt-6 text-xs sm:text-sm font-mono tracking-widest ${themeClasses.mutedText}`}>
        PAGE {currentPage} OF {totalPages}
        <span className="mx-2 opacity-30">|</span>
        {totalPages * 10} TOTAL ENTRIES
      </div>
    </div>
  );
};

export default Pagination;
