const mongoose = require("mongoose");
const { AssetStatuses } = require("../constants/asset.constants");

const maintenanceRecordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const assetSchema = new mongoose.Schema(
  {
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetModel",
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    purchaseDate: {
      type: Date,
    },
    warrantyExpiry: {
      type: Date,
    },
    cost: {
      type: Number,

      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: AssetStatuses,
      default: "In Stock",
    },
    assignedTo: {
      type: String,
      trim: true,
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    maintenanceHistory: [maintenanceRecordSchema],
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate asset ID before saving
assetSchema.pre("save", async function (next) {
  if (!this.id) {
    const count = await this.constructor.countDocuments();
    this.id = `A${String(count + 1000).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Asset", assetSchema);
