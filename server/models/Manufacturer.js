import mongoose from "mongoose";

const manufacturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logoImage:{
        type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    contactInfo: {
      email: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Manufacturer", manufacturerSchema);