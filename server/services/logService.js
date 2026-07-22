const AuditLog = require("../models/AuditLog");

class LogService {
  async bulkUpload(logs) {
    try {
      const processedLogs = logs.map((log) => ({
        ...log,
        timestamp: log.timestamp || new Date().toISOString(),
      }));

      const result = await AuditLog.insertMany(processedLogs, {
        ordered: false,
      });
      return {
        success: true,
        insertedCount: result.length,
        totalCount: logs.length,
      };
    } catch (error) {
      if (error.name === "BulkWriteError") {
        return {
          success: false,
          insertedCount: error.insertedDocs?.length || 0,
          totalCount: logs.length,
          errors: error.writeErrors?.map((e) => ({
            index: e.index,
            message: e.errmsg,
          })),
        };
      }
      throw error;
    }
  }

  async getLogs(filters = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        actor,
        role,
        action,
        resourceType,
        severity,
        status,
        region,
        startDate,
        endDate,
        sortBy = "timestamp",
        order = "desc",
      } = filters;

      const query = {};

      // Build filter query
      if (search) {
        query.$text = { $search: search };
      }

      if (actor) query.actor = actor;
      if (role) query.role = role;
      if (action) query.action = action;
      if (resourceType) query.resourceType = resourceType;
      if (severity) query.severity = severity;
      if (status) query.status = status;
      if (region) query.region = region;

      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }

      // Build sort options
      const sortOptions = {};
      sortOptions[sortBy] = order === "desc" ? -1 : 1;

      // Calculate skip for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query with pagination
      const [logs, total] = await Promise.all([
        AuditLog.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        AuditLog.countDocuments(query),
      ]);

      return {
        data: logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getLogById(id) {
    try {
      const log = await AuditLog.findById(id);
      if (!log) {
        const error = new Error("Log not found");
        error.status = 404;
        throw error;
      }
      return log;
    } catch (error) {
      throw error;
    }
  }

  async deleteLog(id) {
    try {
      const result = await AuditLog.findByIdAndDelete(id);
      if (!result) {
        const error = new Error("Log not found");
        error.status = 404;
        throw error;
      }
      return { success: true, message: "Log deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async getFilterOptions() {
    try {
      const [roles, severities, statuses, regions, resourceTypes, actions] =
        await Promise.all([
          AuditLog.distinct("role"),
          AuditLog.distinct("severity"),
          AuditLog.distinct("status"),
          AuditLog.distinct("region"),
          AuditLog.distinct("resourceType"),
          AuditLog.distinct("action"),
        ]);

      return {
        roles: roles.sort(),
        severities: severities.sort(),
        statuses: statuses.sort(),
        regions: regions.sort(),
        resourceTypes: resourceTypes.sort(),
        actions: actions.sort(),
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new LogService();
