import React from "react";
import { useTheme } from "../context/ThemeContext";

const FilterPanel = ({
  filters,
  filterOptions,
  onFilterChange,
  onSortChange,
}) => {
  const { theme } = useTheme();

  // Theme-aware classes
  const themeClasses = {
    border: theme === "light" ? "border-black" : "border-white",
    bg: theme === "light" ? "bg-white" : "bg-black",
    text: theme === "light" ? "text-black" : "text-white",
    mutedText: theme === "light" ? "text-black/60" : "text-white/60",
    label: theme === "light" ? "text-black" : "text-white",
    selectBg: theme === "light" ? "bg-white" : "bg-black",
    selectText: theme === "light" ? "text-black" : "text-white",
    selectHover: theme === "light" ? "focus:bg-yellow-50" : "focus:bg-gray-800",
    buttonPrimary:
      theme === "light"
        ? "bg-black text-white hover:bg-white hover:text-black"
        : "bg-white text-black hover:bg-black hover:text-white",
    buttonBorder: theme === "light" ? "border-black" : "border-white",
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split("-");
    onSortChange(sortBy, order);
  };

  const handleClearAll = () => {
    onFilterChange({
      role: "",
      severity: "",
      status: "",
      region: "",
      resourceType: "",
      search: "",
    });
    onSortChange("timestamp", "desc");
  };

  const hasActiveFilters =
    filters.role ||
    filters.severity ||
    filters.status ||
    filters.region ||
    filters.resourceType ||
    filters.search;

  // Filter options with labels for better UX
  const filterConfigs = [
    {
      key: "role",
      label: "ROLE",
      options: filterOptions.roles,
      value: filters.role || "",
    },
    {
      key: "severity",
      label: "SEVERITY",
      options: filterOptions.severities,
      value: filters.severity || "",
    },
    {
      key: "status",
      label: "STATUS",
      options: filterOptions.statuses,
      value: filters.status || "",
    },
    {
      key: "region",
      label: "REGION",
      options: filterOptions.regions,
      value: filters.region || "",
    },
    {
      key: "resourceType",
      label: "RESOURCE TYPE",
      options: filterOptions.resourceTypes,
      value: filters.resourceType || "",
    },
  ];

  // Sort options
  const sortOptions = [
    { value: "timestamp-desc", label: "NEWEST FIRST" },
    { value: "timestamp-asc", label: "OLDEST FIRST" },
    { value: "severity-desc", label: "SEVERITY (HIGH → LOW)" },
    { value: "severity-asc", label: "SEVERITY (LOW → HIGH)" },
    { value: "actor-asc", label: "ACTOR (A-Z)" },
    { value: "actor-desc", label: "ACTOR (Z-A)" },
    { value: "status-asc", label: "STATUS (A-Z)" },
    { value: "status-desc", label: "STATUS (Z-A)" },
  ];

  // Helper to format option labels
  const formatLabel = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filterConfigs.map((config) => (
        <div key={config.key}>
          <label
            className={`block uppercase tracking-[3px] text-xs font-black mb-2 ${themeClasses.label}`}>
            {config.label}
          </label>
          <select
            value={config.value}
            onChange={(e) => handleFilterChange(config.key, e.target.value)}
            className={`w-full border-4 ${themeClasses.border} ${themeClasses.selectBg} ${themeClasses.selectText} px-4 py-4 text-lg font-medium focus:outline-none ${themeClasses.selectHover} transition-colors appearance-none cursor-pointer`}>
            <option value="">ALL {config.label}</option>
            {config.options?.map((option) => (
              <option key={option} value={option}>
                {formatLabel(option)}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Sort By */}
      <div>
        <label
          className={`block uppercase tracking-[3px] text-xs font-black mb-2 ${themeClasses.label}`}>
          SORT BY
        </label>
        <select
          value={`${filters.sortBy || "timestamp"}-${filters.order || "desc"}`}
          onChange={handleSortChange}
          className={`w-full border-4 ${themeClasses.border} ${themeClasses.selectBg} ${themeClasses.selectText} px-4 py-4 text-lg font-medium focus:outline-none ${themeClasses.selectHover} transition-colors appearance-none cursor-pointer`}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Button - spans full width on mobile, auto on larger screens */}
      <div className="flex items-end md:col-span-2 lg:col-span-1">
        <button
          onClick={handleClearAll}
          className={`w-full border-4 ${themeClasses.buttonBorder} font-black uppercase tracking-widest py-5 text-lg transition-all active:translate-x-1 active:translate-y-1 ${themeClasses.buttonPrimary}`}>
          {hasActiveFilters ? "CLEAR FILTERS" : "RESET ALL"}
        </button>
      </div>

      {/* Active Filters Summary - Optional */}
      {hasActiveFilters && (
        <div className="md:col-span-2 lg:col-span-3 mt-2 pt-4 border-t-4 border-black/20 dark:border-white/20">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-black uppercase tracking-wider ${themeClasses.mutedText}`}>
              ACTIVE FILTERS:
            </span>
            {Object.entries(filters).map(([key, value]) => {
              if (
                !value ||
                key === "sortBy" ||
                key === "order" ||
                key === "search"
              )
                return null;
              return (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1 border-2 ${themeClasses.border} px-3 py-1 text-sm font-bold ${themeClasses.text}`}>
                  <span className="uppercase text-xs opacity-60">{key}:</span>
                  <span>{formatLabel(value)}</span>
                  <button
                    onClick={() => handleFilterChange(key, "")}
                    className="ml-1 hover:scale-125 transition-transform"
                    aria-label={`Clear ${key} filter`}>
                    ✕
                  </button>
                </span>
              );
            })}
            {filters.search && (
              <span
                className={`inline-flex items-center gap-1 border-2 ${themeClasses.border} px-3 py-1 text-sm font-bold ${themeClasses.text}`}>
                <span className="uppercase text-xs opacity-60">search:</span>
                <span className="max-w-[100px] truncate">
                  "{filters.search}"
                </span>
                <button
                  onClick={() => handleFilterChange("search", "")}
                  className="ml-1 hover:scale-125 transition-transform"
                  aria-label="Clear search">
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
