const express = require("express");
const router = express.Router();
const assetController = require("../controllers/asset.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

router.use(protect); // All routes require authentication

router
  .route("/")
  .get(assetController.getAllAssets)
  .post(authorize("User", "Admin", "Manager"), assetController.createAsset);

router.route("/stats").get(assetController.getAssetStats);

router.route("/recent").get(assetController.getRecentActivity);


  router
    .route("/assetTypes")
    .get(assetController.getAssetTypes)
    .post(assetController.addAssetType)
    .put(assetController.updateAssetType)
    .delete(assetController.deleteAssetType);


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

  router
  .route("/assetTypes")
  .get(assetController.getAssetTypes)
  .post(assetController.addAssetType)
  .put(assetController.updateAssetType)
  .delete(assetController.deleteAssetType);

module.exports = router;
