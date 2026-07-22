const logService = require("../services/logService");

class LogController {
  async bulkUpload(req, res, next) {
    try {
      const { logs } = req.body;
      const result = await logService.bulkUpload(logs);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getLogs(req, res, next) {
    try {
      const filters = req.query;
      const result = await logService.getLogs(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getLogById(req, res, next) {
    try {
      const { id } = req.params;
      const log = await logService.getLogById(id);
      res.status(200).json(log);
    } catch (error) {
      next(error);
    }
  }

  async deleteLog(req, res, next) {
    try {
      const { id } = req.params;
      const result = await logService.deleteLog(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getFilterOptions(req, res, next) {
    try {
      const options = await logService.getFilterOptions();
      res.status(200).json(options);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LogController();
