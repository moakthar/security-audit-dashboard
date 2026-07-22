import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogTable from "../components/LogTable";
import FilterPanel from "../components/FilterPanel";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import UploadModal from "../components/UploadModal";
import useLogs from "../hooks/useLogs";
import {
  PlusIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
  const {
    logs,
    loading,
    error,
    pagination,
    filters,
    filterOptions,
    updateFilters,
    changePage,
    changeLimit,
    deleteLog,
    refresh,
  } = useLogs();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearch = useCallback(
    (searchTerm) => {
      updateFilters({ search: searchTerm });
    },
    [updateFilters],
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      updateFilters(newFilters);
    },
    [updateFilters],
  );

  const handleSortChange = useCallback(
    (sortBy, order) => {
      updateFilters({ sortBy, order });
    },
    [updateFilters],
  );

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("DELETE THIS LOG ENTRY?")) {
        await deleteLog(id);
      }
    },
    [deleteLog],
  );

  const handleUploadSuccess = useCallback(() => {
    setIsUploadModalOpen(false);
    refresh();
  }, [refresh]);

  const tableComponent = useMemo(
    () => (
      <LogTable
        logs={logs}
        onDelete={handleDelete}
        currentSort={filters.sortBy}
        currentOrder={filters.order}
        onSort={handleSortChange}
      />
    ),
    [logs, handleDelete, filters.sortBy, filters.order, handleSortChange],
  );

  const filterPanelComponent = useMemo(
    () => (
      <FilterPanel
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
    ),
    [filters, filterOptions, handleFilterChange, handleSortChange],
  );

  // Theme-aware classes
  const themeClasses = {
    bg: theme === "light" ? "bg-white" : "bg-black",
    text: theme === "light" ? "text-black" : "text-white",
    border: theme === "light" ? "border-black" : "border-white",
    shadow:
      theme === "light"
        ? "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        : "shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]",
    shadowSmall:
      theme === "light"
        ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        : "shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
    buttonBg:
      theme === "light"
        ? "bg-black text-white hover:bg-white hover:text-black"
        : "bg-white text-black hover:bg-black hover:text-white",
    inputBg: theme === "light" ? "bg-white" : "bg-black",
    inputText: theme === "light" ? "text-black" : "text-white",
    inputFocus: theme === "light" ? "focus:bg-yellow-50" : "focus:bg-gray-900",
    mutedText: theme === "light" ? "text-black/70" : "text-white/70",
    mutedTextLight: theme === "light" ? "text-black/40" : "text-white/40",
    errorBg: theme === "light" ? "bg-red-100" : "bg-red-900/30",
    errorBorder: "border-red-600",
    errorText: theme === "light" ? "text-red-600" : "text-red-400",
  };

  if (loading && logs.length === 0) {
    return (
      <div
        className={`min-h-screen ${themeClasses.bg} flex items-center justify-center p-4`}>
        <div
          className={`text-center border-8 ${themeClasses.border} p-6 sm:p-12 ${themeClasses.bg} max-w-[90%] sm:max-w-full`}>
          <div
            className={`text-4xl sm:text-6xl font-black tracking-tighter animate-pulse ${themeClasses.text}`}>
            LOADING
          </div>
          <p
            className={`mt-4 sm:mt-6 text-xl sm:text-2xl font-mono uppercase tracking-widest ${themeClasses.mutedText}`}>
            AUDIT LOGS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${themeClasses.bg} font-mono transition-colors duration-300`}>
      {/* Header */}
      <div
        className={`border-b-4 sm:border-b-8 ${themeClasses.border} sticky top-0 z-50 ${themeClasses.bg}`}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            {/* Logo Section */}
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div>
                <h1
                  className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-[-2px] sm:tracking-[-4px] leading-none ${themeClasses.text}`}>
                  SECURITY
                  <br className="sm:hidden" />
                  <span className="hidden sm:inline"> </span>
                  AUDIT LOG
                </h1>
                <p
                  className={`mt-1 sm:mt-3 text-xs sm:text-xl uppercase tracking-[2px] sm:tracking-[4px] font-bold ${themeClasses.mutedText}`}>
                  INVESTIGATION DASHBOARD
                </p>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`block sm:hidden border-4 ${themeClasses.border} ${themeClasses.bg} ${themeClasses.text} p-2 hover:opacity-70 transition-opacity`}
                aria-label="Toggle menu">
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Actions Section - Desktop */}
            <div className="hidden sm:flex items-center gap-3 md:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`border-4 ${themeClasses.border} ${themeClasses.bg} ${themeClasses.text} p-3 sm:p-4 text-xl sm:text-2xl font-black transition-colors duration-200 ${themeClasses.shadowSmall}`}
                aria-label="Toggle theme">
                {theme === "light" ? (
                  <MoonIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                ) : (
                  <SunIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                )}
              </motion.button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className={`group border-4 sm:border-8 ${themeClasses.border} ${
                  theme === "light"
                    ? "bg-black text-white hover:bg-white hover:text-black"
                    : "bg-white text-black hover:bg-black hover:text-white"
                } transition-all duration-200 px-6 sm:px-10 py-4 sm:py-6 text-lg sm:text-2xl font-black uppercase tracking-widest flex items-center gap-2 sm:gap-4 ${themeClasses.shadowSmall} hover:shadow-[4px_4px_0px_black] dark:hover:shadow-[4px_4px_0px_white] active:translate-x-1 active:translate-y-1`}>
                <PlusIcon className="h-6 w-6 sm:h-9 sm:w-9" />
                <span className="hidden sm:inline">UPLOAD LOGS</span>
                <span className="sm:hidden">UPLOAD</span>
              </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full sm:hidden overflow-hidden">
                  <div
                    className={`mt-4 pt-4 border-t-4 ${themeClasses.border} flex flex-col gap-3`}>
                    <button
                      onClick={() => {
                        toggleTheme();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`border-4 ${themeClasses.border} ${themeClasses.bg} ${themeClasses.text} p-4 text-lg font-black flex items-center justify-center gap-3 ${themeClasses.shadowSmall} hover:opacity-70 transition-opacity`}>
                      {theme === "light" ? (
                        <>
                          <MoonIcon className="h-6 w-6" />
                          DARK MODE
                        </>
                      ) : (
                        <>
                          <SunIcon className="h-6 w-6" />
                          LIGHT MODE
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsUploadModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`border-4 ${themeClasses.border} ${themeClasses.buttonBg} p-4 text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 ${themeClasses.shadowSmall}`}>
                      <PlusIcon className="h-6 w-6" />
                      UPLOAD LOGS
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {error && (
          <div
            className={`border-4 sm:border-8 ${themeClasses.errorBorder} ${themeClasses.errorBg} p-4 sm:p-6 mb-4 sm:mb-8`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <span className="text-3xl sm:text-4xl">⚠️</span>
              <div className="flex-1 w-full">
                <div
                  className={`text-2xl sm:text-3xl font-black uppercase tracking-wider ${themeClasses.errorText}`}>
                  ERROR
                </div>
                <p
                  className={`text-base sm:text-xl mt-1 ${themeClasses.text} break-words`}>
                  {error}
                </p>
              </div>
              <button
                onClick={refresh}
                className={`w-full sm:w-auto border-4 border-red-600 hover:bg-red-600 hover:text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-xl font-black uppercase transition-colors ${themeClasses.text} sm:ml-auto`}>
                RETRY
              </button>
            </div>
          </div>
        )}

        {/* Top Controls - Brutalist Style */}
        <div
          className={`border-4 sm:border-8 ${themeClasses.border} ${themeClasses.bg} p-4 sm:p-8 mb-6 sm:mb-12 ${themeClasses.shadow}`}>
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Search & Controls Row */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-end lg:items-center">
              {/* Search Bar */}
              <div className="flex-1 w-full min-w-0">
                <div
                  className={`uppercase tracking-[2px] sm:tracking-[4px] text-[10px] sm:text-xs font-black mb-2 sm:mb-3 ${themeClasses.mutedText}`}>
                  SEARCH LOGS
                </div>
                <SearchBar
                  onSearch={handleSearch}
                  initialValue={filters.search}
                  className={`w-full border-4 ${themeClasses.border} ${themeClasses.inputBg} ${themeClasses.inputText} p-4 sm:p-5 text-base sm:text-2xl font-bold placeholder:${themeClasses.mutedTextLight} focus:outline-none ${themeClasses.inputFocus} transition-colors`}
                />
              </div>

              {/* Filters & Per Page Row */}
              <div className="flex flex-row gap-3 sm:gap-4 w-full lg:w-auto lg:flex-shrink-0 items-center">
                {/* Filters Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`border-4 ${themeClasses.border} font-black uppercase tracking-[2px] sm:tracking-[3px] px-6 sm:px-18 py-4 sm:py-6 text-base sm:text-xl flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap transition-all duration-200 flex-1 sm:flex-none ${
                    isFilterOpen
                      ? themeClasses.buttonBg
                      : `${themeClasses.bg} ${themeClasses.text} hover:${
                          theme === "dark"
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`
                  }`}>
                  <span>{isFilterOpen ? "CLOSE" : "FILTERS"}</span>
                  <span className="text-xl sm:text-2xl">
                    {isFilterOpen ? "✕" : "⚙"}
                  </span>
                </motion.button>

                {/* Results Per Page */}
                <div className="flex-1 sm:flex-none">
                  <div
                    className={`uppercase tracking-[2px] sm:tracking-[3px] text-[10px] sm:text-xs font-black mb-2 ${themeClasses.mutedText} hidden lg:block md:block`}>
                    SHOW PER PAGE
                  </div>
                  <select
                    value={pagination.limit}
                    onChange={(e) => changeLimit(Number(e.target.value))}
                    className={`w-full sm:w-auto border-4 ${themeClasses.border} ${themeClasses.inputBg} ${themeClasses.inputText} px-4 sm:px-4 py-3 sm:py-3 text-base sm:text-xl font-bold focus:outline-none ${themeClasses.inputFocus} transition-colors appearance-none cursor-pointer min-w-[100px] sm:min-w-[160px]`}>
                    <option value={10}>
                      {isMobile ? "10" : "10 PER PAGE"}
                    </option>
                    <option value={20}>
                      {isMobile ? "20" : "20 PER PAGE"}
                    </option>
                    <option value={50}>
                      {isMobile ? "50" : "50 PER PAGE"}
                    </option>
                    <option value={100}>
                      {isMobile ? "100" : "100 PER PAGE"}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Panel (Collapsible) */}
            <motion.div
              initial={false}
              animate={{
                height: isFilterOpen ? "auto" : 0,
                opacity: isFilterOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden">
              <div
                className={`mt-4 sm:mt-8 pt-4 sm:pt-8 border-t-4 ${themeClasses.border}`}>
                <div
                  className={`uppercase tracking-[2px] sm:tracking-[4px] text-[10px] sm:text-xs font-black mb-4 sm:mb-6 ${themeClasses.mutedText}`}>
                  ADVANCED FILTERS &amp; SORT
                </div>
                {filterPanelComponent}
              </div>
            </motion.div>

            <div
              className={`mt-4 sm:mt-8 pt-4 sm:pt-8 border-t-4 ${themeClasses.border} flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4`}
            />

            {/* Table */}
            <div
              className={`border-4 sm:border-8 ${themeClasses.border} overflow-hidden ${themeClasses.bg} mb-6 sm:mb-12`}>
              {loading && logs.length > 0 ? (
                <div
                  className={`py-12 sm:py-24 flex justify-center ${themeClasses.text}`}>
                  <div className="text-3xl sm:text-4xl font-black animate-pulse">
                    LOADING...
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">{tableComponent}</div>
              )}
            </div>

            {/* Results Info */}
            <div
              className={`mt-4 sm:mt-8 pt-4 sm:pt-8 border-t-4 ${themeClasses.border} flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4`}>
              <div
                className={`text-base sm:text-2xl font-black uppercase tracking-wider ${themeClasses.text} flex flex-wrap items-center gap-1 sm:gap-1`}>
                <span className={themeClasses.mutedTextLight}>SHOWING</span>
                <span
                  className={`mx-1 sm:mx-2 px-3 sm:px-4 py-0.5 sm:py-1 ${
                    theme === "light"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } text-sm sm:text-2xl`}>
                  {logs.length}
                </span>
                <span className={themeClasses.mutedTextLight}>OF</span>
                <span
                  className={`mx-1 sm:mx-2 px-3 sm:px-4 py-0.5 sm:py-1 ${
                    theme === "light"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } text-sm sm:text-2xl`}>
                  {pagination.total}
                </span>
                <span className={themeClasses.mutedTextLight}>ENTRIES</span>
              </div>
              {logs.length > 0 && (
                <div
                  className={`text-[10px] sm:text-sm font-black uppercase tracking-wider ${themeClasses.mutedTextLight} whitespace-nowrap`}>
                  LAST UPDATED: {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div
            className={`border-4 sm:border-8 ${themeClasses.border} p-4 sm:p-6 ${themeClasses.bg}`}>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={changePage}
            />
          </div>
        )}
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Dashboard;
