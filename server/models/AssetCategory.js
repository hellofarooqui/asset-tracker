const mongoose = require("mongoose");

const assetCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      trim: true,
    }, 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AssetCategory", assetCategorySchema);

