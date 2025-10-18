const express = require("express");
const router = express.Router();
const assetController = require("../controllers/asset.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

router.use(protect); // All routes require authentication

//routes for all assets
router
  .route("/")
  .get(assetController.getAllAssets)
  .post(authorize("User", "Admin", "Manager"), assetController.createAsset);

router.route("/stats").get(assetController.getAssetStats);

router.route("/recent").get(assetController.getRecentActivity);


//asset category routes
router
  .route("/category")
  .get(assetController.getAssetCategories)
  .post(assetController.addAssetCategory)
  .put(assetController.updateAssetCategory)
  .delete(assetController.deleteAssetCatgory);

  //asset model routes
router
  .route("/models")
  .get(assetController.getAllAssetModels)
  .post(assetController.addAssetModel)
  .put(assetController.updateAssetModel)
  .delete(assetController.deleteAssetModel);



//routes for one specific asset
router
  .route("/:id")
  .get(assetController.getAssetById)
  .put(authorize("Admin", "Manager"), assetController.updateAsset)
  .delete(authorize("Admin"), assetController.deleteAsset);

router
  .route("/:id/status")
  .patch(authorize("Admin", "Manager"), assetController.updateAssetStatus);

router
  .route("/:id/maintenance")
  .post(authorize("Admin", "Manager"), assetController.addMaintenanceRecord);

module.exports = router;
