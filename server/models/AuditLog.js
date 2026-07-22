const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user", "manager", "auditor", "developer"],
    },
    action: {
      type: String,
      required: true,
      enum: [
        "DELETE_USER",
        "CREATE_USER",
        "UPDATE_USER",
        "LOGIN",
        "LOGOUT",
        "ACCESS_DENIED",
        "PERMISSION_CHANGE",
        "DATA_EXPORT",
        "SYSTEM_UPDATE",
      ],
    },
    resource: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: ["USER", "ROLE", "PERMISSION", "SYSTEM", "DATA", "CONFIG"],
    },
    ipAddress: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            v,
          );
        },
        message: (props) => `${props.value} is not a valid IP address!`,
      },
    },
    region: {
      type: String,
      required: true,
      enum: [
        "us-east-1",
        "us-west-2",
        "eu-west-1",
        "ap-south-1",
        "ap-northeast-1",
        "sa-east-1",
      ],
    },
    severity: {
      type: String,
      required: true,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Unresolved", "In Progress", "Resolved", "Ignored"],
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    details: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes for better query performance
auditLogSchema.index({ actor: 1, timestamp: -1 });
auditLogSchema.index({ role: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ status: 1, timestamp: -1 });
auditLogSchema.index({ region: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

// Text index for search
auditLogSchema.index({
  actor: "text",
  action: "text",
  resource: "text",
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
