const mongoose = require("mongoose");

const assetModelSchema = new mongoose.Schema(
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
    modelnumber:{
        type: String,
        required: true,
    },
    assetCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetCategory",
      required: true,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufacturer",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      trim: true,
    },
    notes:{
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AssetModel", assetModelSchema);