import mongoose from "mongoose";

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
    },
    assetType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetType",
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