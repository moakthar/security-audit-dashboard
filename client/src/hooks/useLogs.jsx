import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { logService } from "../services/api";

const useLogs = (initialFilters = {}) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    severity: "",
    status: "",
    region: "",
    resourceType: "",
    sortBy: "timestamp",
    order: "desc",
    ...initialFilters,
  });
  const [filterOptions, setFilterOptions] = useState({
    roles: [],
    severities: [],
    statuses: [],
    regions: [],
    resourceTypes: [],
    actions: [],
  });

  const abortControllerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const filterOptionsFetched = useRef(false);
  const initialLoadDone = useRef(false);

  // Memoize params to prevent unnecessary re-fetches
  const params = useMemo(() => {
    const paramsObj = {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: filters.sortBy,
      order: filters.order,
    };

    // Add filters only if they have values
    if (filters.search) paramsObj.search = filters.search;
    if (filters.role) paramsObj.role = filters.role;
    if (filters.severity) paramsObj.severity = filters.severity;
    if (filters.status) paramsObj.status = filters.status;
    if (filters.region) paramsObj.region = filters.region;
    if (filters.resourceType) paramsObj.resourceType = filters.resourceType;

    return paramsObj;
  }, [
    pagination.page,
    pagination.limit,
    filters.search,
    filters.role,
    filters.severity,
    filters.status,
    filters.region,
    filters.resourceType,
    filters.sortBy,
    filters.order,
  ]);

  const fetchLogs = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Prevent concurrent requests
    if (isFetchingRef.current) {
      console.log("Skipping concurrent request");
      return;
    }

    isFetchingRef.current = true;
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching logs with params:", params);
      const response = await logService.getLogs(params);

      setLogs(response.data.data || []);
      setPagination(
        response.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      );
      initialLoadDone.current = true;
    } catch (err) {
      // Don't set error if request was aborted
      if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
        console.log("Request cancelled");
        return;
      }
      console.error("Fetch logs error:", err);
      setError(err.response?.data?.message || "Failed to fetch logs");
      setLogs([]);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [params]);

  const fetchFilterOptions = useCallback(async () => {
    // Only fetch once
    if (filterOptionsFetched.current) {
      return;
    }

    try {
      console.log("Fetching filter options...");
      const response = await logService.getFilterOptions();
      setFilterOptions((prev) => ({
        ...prev,
        ...response.data,
      }));
      filterOptionsFetched.current = true;
    } catch (err) {
      console.error("Failed to fetch filter options:", err);
    }
  }, []);

  const updateFilters = useCallback((newFilters) => {
    console.log("Updating filters:", newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // Reset to page 1 when filters change
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const changePage = useCallback((newPage) => {
    console.log("Changing to page:", newPage);
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const changeLimit = useCallback((newLimit) => {
    console.log("Changing limit to:", newLimit);
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  }, []);

  const deleteLog = useCallback(
    async (id) => {
      try {
        await logService.deleteLog(id);
        await fetchLogs();
        return { success: true };
      } catch (err) {
        console.error("Delete error:", err);
        return {
          success: false,
          error: err.response?.data?.message || "Failed to delete log",
        };
      }
    },
    [fetchLogs],
  );

  // Fetch logs when params change (only after initial load)
  useEffect(() => {
    // Skip the first render to prevent double loading
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchLogs();
      return;
    }

    // Debounce the fetch to prevent rapid successive calls
    const timeoutId = setTimeout(() => {
      fetchLogs();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [params, fetchLogs]);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  return {
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
    refresh: fetchLogs,
  };
};

export default useLogs;
