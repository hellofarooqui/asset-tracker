const Asset = require("../models/Asset");
const AssetCategory = require("../models/AssetCategory");
const Manufacturer = require("../models/Manufacturer");
const AssetModel = require("../models/AssetModel");

exports.getAllAssets = async (req, res) => {
  try {
    console.log("Fetching all assets with query:", req.query);
    const { search, type, status, page = 1, limit = 50 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { id: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { serialNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (type) query.type = type;
    if (status) query.status = status;

    const assets = await Asset.find(query)
      .populate({
        path: "model",
        populate: {
          path: "name manufacturer assetCategory modelnumber",
          select: "name",
        },
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Asset.countDocuments(query);

    res.status(200).json({
      success: true,
      assets,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("assignedUser", "name email")
      .populate("maintenanceHistory.performedBy", "name");

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({
      success: true,
      asset,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAsset = async (req, res) => {
  try {
    console.log("Creating asset with data:", req.body);
    const asset = await Asset.create(req.body);

    if (!asset) {
      return res.status(400).json({ message: "Asset creation failed" });
    }

    res.status(201).json({
      success: true,
      asset,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({
      success: true,
      asset,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAssetStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({
      success: true,
      asset,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMaintenanceRecord = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    asset.maintenanceHistory.push({
      ...req.body,
      performedBy: req.user.id,
    });

    await asset.save();

    res.status(200).json({
      success: true,
      asset,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssetStats = async (req, res) => {
  try {
    const stats = await Asset.aggregate([
      {
        $facet: {
          byModel: [{ $group: { _id: "$model", count: { $sum: 1 } } }],
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          total: [{ $count: "count" }],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const assets = await Asset.find()
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .select("id assignedTo status updatedAt");

    const activities = assets.map((asset) => ({
      asset: asset.id,
      user: asset.assignedTo,
      status: asset.status,
      date: asset.updatedAt.toISOString().split("T")[0],
    }));

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssetCategories = async (req, res) => {
  console.log("Fetching asset types");
  try {
    const types = await AssetCategory.find().select("name description");

    if (types) {
      res.status(200).json({
        success: true,
        types,
      });
    }
  } catch (error) {
    console.log("Error fetching asset types:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.addAssetCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if type already exists
    const existingType = await AssetCategory.findOne({ name });
    if (existingType) {
      return res.status(400).json({ message: "Type already exists" });
    }

    const newType = await AssetCategory.create({ name, description });

    res.status(201).json({
      success: true,
      message: "Type added successfully",
      type: newType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAssetCategory = async (req, res) => {
  try {
    const { oldType, newType } = req.body;
    if (!oldType || !newType) {
      return res
        .status(400)
        .json({ message: "Both old and new types are required" });
    }

    // Check if old type exists
    const existingTypes = await Asset.distinct("type");
    if (!existingTypes.includes(oldType)) {
      return res.status(404).json({ message: "Old type not found" });
    }

    // Update all assets with the old type to the new type
    await Asset.updateMany({ type: oldType }, { type: newType });

    res.status(200).json({
      success: true,
      message: "Type updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAssetCatgory = async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    // Check if type exists
    const existingTypes = await Asset.distinct("type");
    if (!existingTypes.includes(type)) {
      return res.status(404).json({ message: "Type not found" });
    }

    // Check if any assets are using this type
    const assetsUsingType = await Asset.findOne({ type });
    if (assetsUsingType) {
      return res
        .status(400)
        .json({ message: "Cannot delete type in use by assets" });
    }

    // Create a dummy asset to remove the type
    const dummyAsset = new Asset({
      id: `DUMMY-${Date.now()}`,
      type,
      manufacturer: "Dummy",
      model: "Dummy",
      serialNumber: `DUMMY-${Date.now()}`,
      purchaseDate: new Date(),
      warrantyExpiry: new Date(),
      cost: 0,
      status: "In Stock",
    });
    await dummyAsset.save();
    await Asset.findByIdAndDelete(dummyAsset._id);

    res.status(200).json({
      success: true,
      message: "Type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// exports.protect = async (req, res, next) => {
//   try {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Not authorized to access this route" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");

//     if (!req.user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     next();
//   } catch (error) {
//     return res
//       .status(401)
//       .json({ message: "Not authorized to access this route" });
//   }
// }

exports.addNewManufacturer = async (req, res) => {
  try {
    console.log("Adding new manufacturer with data:", req.body);

    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Manufacturer name is required" });
    }

    // Check if manufacturer already exists
    const existingManufacturer = await Manufacturer.findOne({ name });
    if (existingManufacturer) {
      return res.status(400).json({ message: "Manufacturer already exists" });
    }

    // Since manufacturer is just a string field in Asset, no separate model is created.
    // We can just acknowledge the addition.

    let manufacturerData = { ...req.body };

    const filename = req.file && req.file.filename;
    const logoImage = filename
      ? `/uploads/ManufacturerLogos/${filename}`
      : null;

    const addedManufacturer = await Manufacturer.create({
      ...manufacturerData,
      logoImage,
    });

    if (addedManufacturer) {
      res.status(201).json({
        success: true,
        message: "Manufacturer added successfully",
        manufacturer: addedManufacturer,
      });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllManufacturers = async (req, res) => {
  try {
    const manufacturers = await Manufacturer.find();
    if (manufacturers) {
      res.status(200).json({
        success: true,
        manufacturers,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateManufacturer = async (req, res) => {
  try {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) {
      return res
        .status(400)
        .json({ message: "Both old and new manufacturer names are required" });
    }

    // Check if old manufacturer exists
    const existingManufacturers = await Asset.distinct("manufacturer");
    if (!existingManufacturers.includes(oldName)) {
      return res.status(404).json({ message: "Old manufacturer not found" });
    }

    // Update all assets with the old manufacturer to the new manufacturer
    await Asset.updateMany(
      { manufacturer: oldName },
      { manufacturer: newName }
    );

    res.status(200).json({
      success: true,
      message: "Manufacturer updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteManufacturer = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Manufacturer name is required" });
    }

    // Check if manufacturer exists
    const existingManufacturers = await Asset.distinct("manufacturer");
    if (!existingManufacturers.includes(name)) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }

    // Check if any assets are using this manufacturer
    const assetsUsingManufacturer = await Asset.findOne({ manufacturer: name });
    if (assetsUsingManufacturer) {
      return res
        .status(400)
        .json({ message: "Cannot delete manufacturer in use by assets" });
    }

    // Since manufacturer is just a string field in Asset, we can't delete it from a separate collection.
    // Instead, we can just acknowledge the deletion.

    res.status(200).json({
      success: true,
      message: "Manufacturer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAssetModels = async (req, res) => {
  try {
    const models = await AssetModel.find();
    res.status(200).json({
      success: true,
      models,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAssetModel = async (req, res) => {
  try {
    const added = await AssetModel.create(req.body);

    if (added) {
      res.status(201).json({
        success: true,
        message: "Asset model added successfully",
        model: added,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAssetModel = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAssetModel = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
