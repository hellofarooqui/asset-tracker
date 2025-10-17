const Asset = require("../models/Asset");
const AssetType = require("../models/AssetType");

exports.getAllAssets = async (req, res) => {
   
  try {
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
      .populate("assignedUser", "name email")
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
    const asset = await Asset.create(req.body);

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
          byType: [{ $group: { _id: "$type", count: { $sum: 1 } } }],
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const formatStats = {
      networkSwitches:
        stats[0].byType.find((t) => t._id === "Network Switch")?.count || 0,
      wirelessAPs:
        stats[0].byType.find((t) => t._id === "Wireless AP")?.count || 0,
      desktops: stats[0].byType.find((t) => t._id === "Desktop")?.count || 0,
      laptops: stats[0].byType.find((t) => t._id === "Laptop")?.count || 0,
      inUse: stats[0].byStatus.find((s) => s._id === "Active")?.count || 0,
      inStock: stats[0].byStatus.find((s) => s._id === "In Stock")?.count || 0,
      underMaintenance:
        stats[0].byStatus.find((s) => s._id === "Maintenance")?.count || 0,
      total: stats[0].total[0]?.count || 0,
    };

    res.status(200).json({
      success: true,
      stats: formatStats,
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

exports.getAssetTypes = async (req, res) => {
    console.log("Fetching asset types");
  try {
    const types = await AssetType.find().select("name description");

    if(types){
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

exports.addAssetType = async (req, res) => {
  try {
    const { name,description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if type already exists
    const existingType = await AssetType.findOne({ name });
    if (existingType) {
      return res.status(400).json({ message: "Type already exists" });
    }

    
    const newType = await AssetType.create({ name, description });

    res.status(201).json({
      success: true,
      message: "Type added successfully",
      type: newType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAssetType = async (req, res) => {
  try {
    const { oldType, newType } = req.body;
    if (!oldType || !newType) {
      return res.status(400).json({ message: "Both old and new types are required" });
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

exports.deleteAssetType = async (req, res) => {
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
      return res.status(400).json({ message: "Cannot delete type in use by assets" });
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
