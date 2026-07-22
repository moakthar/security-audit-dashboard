import React from "react";
import { format } from "date-fns";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

const LogTable = ({ logs, onDelete, currentSort, currentOrder, onSort }) => {
  const { theme } = useTheme();

  // Theme-aware classes
  const themeClasses = {
    border: theme === "light" ? "border-black" : "border-white",
    text: theme === "light" ? "text-black" : "text-white",
    bg: theme === "light" ? "bg-white" : "bg-black",
    headerBg: theme === "light" ? "bg-black text-white" : "bg-white text-black",
    headerHover:
      theme === "light"
        ? "hover:bg-black hover:text-white"
        : "hover:bg-white hover:text-black",
    rowHover: theme === "light" ? "hover:bg-yellow-100" : "hover:bg-gray-800",
    mutedText: theme === "light" ? "text-black/60" : "text-white/60",
    emptyBorder: theme === "light" ? "border-black" : "border-white",
  };

  const handleSort = (column) => {
    if (currentSort === column) {
      onSort(column, currentOrder === "asc" ? "desc" : "asc");
    } else {
      onSort(column, "asc");
    }
  };

  const SortableHeader = ({ column, children }) => (
    <th
      className={`border-4 ${themeClasses.border} px-4 py-5 text-left font-black uppercase tracking-widest text-sm cursor-pointer ${themeClasses.headerBg} transition-colors whitespace-nowrap`}
      onClick={() => handleSort(column)}>
      <div className="flex items-center gap-2">
        {children}
        {currentSort === column && (
          <span>
            {currentOrder === "asc" ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </span>
        )}
      </div>
    </th>
  );

  if (!logs || logs.length === 0) {
    return (
      <div
        className={`text-center py-20 border-4 ${themeClasses.emptyBorder} ${themeClasses.bg}`}>
        <p
          className={`text-3xl font-black uppercase tracking-widest ${themeClasses.text}`}>
          NO LOGS FOUND
        </p>
        <p className={`text-lg mt-4 ${themeClasses.mutedText}`}>
          Adjust filters or upload new logs
        </p>
      </div>
    );
  }

  // Severity color mapping
  const getSeverityStyles = (severity) => {
    const baseStyles =
      "px-5 py-2 text-sm font-black uppercase border-2 border-black";
    const styles = {
      CRITICAL: "bg-red-600 text-white",
      HIGH: "bg-orange-500 text-white",
      MEDIUM: "bg-yellow-400 text-black",
      LOW: "bg-green-500 text-white",
    };
    return `${baseStyles} ${styles[severity] || styles.LOW}`;
  };

  // Status color mapping
  const getStatusStyles = (status) => {
    const baseStyles =
      "px-5 py-2 text-sm font-black uppercase border-2 border-black";
    const styles = {
      Unresolved: "bg-red-600 text-white",
      "In Progress": "bg-yellow-400 text-black",
      Resolved: "bg-green-500 text-white",
      Investigating: "bg-purple-500 text-white",
    };
    return `${baseStyles} ${styles[status] || styles["Unresolved"]}`;
  };

  // Action color mapping
  const getActionStyles = (action) => {
    const baseStyles =
      "border-2 border-black px-4 py-1 text-sm font-black uppercase";
    const styles = {
      CREATE: "bg-blue-600 text-white",
      UPDATE: "bg-purple-600 text-white",
      DELETE: "bg-red-600 text-white",
      READ: "bg-green-600 text-white",
      LOGIN: "bg-indigo-600 text-white",
      LOGOUT: "bg-gray-600 text-white",
    };
    return `${baseStyles} ${styles[action] || "bg-black text-white"}`;
  };

  return (
    <div className={`overflow-x-auto ${themeClasses.bg}`}>
      <table className={`min-w-full border-4 ${themeClasses.border}`}>
        <thead className={themeClasses.headerBg}>
          <tr>
            <SortableHeader column="actor">ACTOR</SortableHeader>
            <th
              className={`border-4 ${themeClasses.border} px-4 py-5 text-left font-black uppercase tracking-widest text-sm`}>
              ROLE
            </th>
            <th
              className={`border-4 ${themeClasses.border} px-4 py-5 text-left font-black uppercase tracking-widest text-sm`}>
              ACTION
            </th>
            <th
              className={`border-4 ${themeClasses.border} px-4 py-5 text-left font-black uppercase tracking-widest text-sm`}>
              RESOURCE
            </th>
            <SortableHeader column="severity">SEVERITY</SortableHeader>
            <SortableHeader column="status">STATUS</SortableHeader>
            <SortableHeader column="timestamp">TIMESTAMP</SortableHeader>
            <th
              className={`border-4 ${themeClasses.border} px-4 py-5 text-left font-black uppercase tracking-widest text-sm`}>
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y-4 ${themeClasses.border}`}>
          {logs.map((log) => (
            <tr
              key={log._id}
              className={`${themeClasses.rowHover} transition-colors`}>
              <td
                className={`border-4 ${themeClasses.border} px-4 py-6 font-mono text-lg font-bold break-all ${themeClasses.text}`}>
                {log.actor}
              </td>
              <td className={`border-4 ${themeClasses.border} px-4 py-6`}>
                <span
                  className={`border-2 border-black px-4 py-1 text-sm font-black uppercase bg-black text-white`}>
                  {log.role || "N/A"}
                </span>
              </td>
              <td className={`border-4 ${themeClasses.border} px-4 py-6`}>
                <span className={getActionStyles(log.action)}>
                  {log.action}
                </span>
              </td>
              <td
                className={`border-4 ${themeClasses.border} px-4 py-6 font-mono text-lg ${themeClasses.text}`}>
                {log.resource || "N/A"}
              </td>
              <td className={`border-4 ${themeClasses.border} px-4 py-6`}>
                <span className={getSeverityStyles(log.severity)}>
                  {log.severity}
                </span>
              </td>
              <td className={`border-4 ${themeClasses.border} px-4 py-6`}>
                <span className={getStatusStyles(log.status)}>
                  {log.status}
                </span>
              </td>
              <td
                className={`border-4 ${themeClasses.border} px-4 py-6 font-mono text-sm whitespace-nowrap ${themeClasses.text}`}>
                {format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}
              </td>
              <td className={`border-4 ${themeClasses.border} px-4 py-6`}>
                <button
                  onClick={() => onDelete(log._id)}
                  className={`border-4 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all p-3 font-black uppercase text-sm active:translate-x-1 active:translate-y-1 ${themeClasses.bg}`}
                  aria-label="Delete log">
                  <TrashIcon className="h-6 w-6" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
