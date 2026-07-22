const { body, query, validationResult } = require("express-validator");

const validateLogUpload = [
  body("logs")
    .isArray({ min: 1, max: 10000 })
    .withMessage("Logs must be an array with 1-10000 items"),
  body("logs.*.actor").isEmail().withMessage("Invalid actor email format"),
  body("logs.*.role")
    .isIn(["admin", "user", "manager", "auditor", "developer"])
    .withMessage("Invalid role"),
  body("logs.*.action")
    .isIn([
      "DELETE_USER",
      "CREATE_USER",
      "UPDATE_USER",
      "LOGIN",
      "LOGOUT",
      "ACCESS_DENIED",
      "PERMISSION_CHANGE",
      "DATA_EXPORT",
      "SYSTEM_UPDATE",
    ])
    .withMessage("Invalid action"),
  body("logs.*.resource").notEmpty().withMessage("Resource is required"),
  body("logs.*.resourceType")
    .isIn(["USER", "ROLE", "PERMISSION", "SYSTEM", "DATA", "CONFIG"])
    .withMessage("Invalid resource type"),
  body("logs.*.ipAddress")
    .matches(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    )
    .withMessage("Invalid IP address format"),
  body("logs.*.region")
    .isIn([
      "us-east-1",
      "us-west-2",
      "eu-west-1",
      "ap-south-1",
      "ap-northeast-1",
      "sa-east-1",
    ])
    .withMessage("Invalid region"),
  body("logs.*.severity")
    .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .withMessage("Invalid severity"),
  body("logs.*.status")
    .isIn(["Unresolved", "In Progress", "Resolved", "Ignored"])
    .withMessage("Invalid status"),
  body("logs.*.timestamp")
    .optional()
    .isISO8601()
    .withMessage("Invalid timestamp format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateQueryParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search").optional().isString().trim(),
  query("role")
    .optional()
    .isIn(["admin", "user", "manager", "auditor", "developer"])
    .withMessage("Invalid role"),
  query("severity")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .withMessage("Invalid severity"),
  query("status")
    .optional()
    .isIn(["Unresolved", "In Progress", "Resolved", "Ignored"])
    .withMessage("Invalid status"),
  query("region")
    .optional()
    .isIn([
      "us-east-1",
      "us-west-2",
      "eu-west-1",
      "ap-south-1",
      "ap-northeast-1",
      "sa-east-1",
    ])
    .withMessage("Invalid region"),
  query("resourceType")
    .optional()
    .isIn(["USER", "ROLE", "PERMISSION", "SYSTEM", "DATA", "CONFIG"])
    .withMessage("Invalid resource type"),
  query("sortBy")
    .optional()
    .isIn(["actor", "timestamp", "severity", "status", "region"])
    .withMessage("Invalid sort field"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be asc or desc"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateLogUpload,
  validateQueryParams,
};
