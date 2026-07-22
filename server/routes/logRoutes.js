const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const {
  validateLogUpload,
  validateQueryParams,
} = require("../validators/logValidators");

// Routes
router.post("/upload", validateLogUpload, logController.bulkUpload);
router.get("/", validateQueryParams, logController.getLogs);
router.get("/filter-options", logController.getFilterOptions);
router.get("/:id", logController.getLogById);
router.delete("/:id", logController.deleteLog);

module.exports = router;
