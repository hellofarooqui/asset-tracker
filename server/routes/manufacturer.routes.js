const express = require("express");
const { protect, authorize } = require("../middlewares/auth.middleware");
const assetController = require("../controllers/asset.controller");
const { uploadManufacturerLogo } = require("../middlewares/upload.middleware");
const router = express.Router();

router.use(protect); // All routes require authentication

router
  .route("/")
  .get(assetController.getAllManufacturers)
  .post(authorize("Admin", "Manager"),uploadManufacturerLogo,assetController.addNewManufacturer)
  .put(authorize("Admin", "Manager"),assetController.updateManufacturer)
  .delete(authorize("Admin", "Manager"),assetController.deleteManufacturer);

router
  .route("/:id")
  .get(assetController.getAllManufacturers)
  .post(authorize("Admin", "Manager"),assetController.addNewManufacturer)
  .put(authorize("Admin", "Manager"),assetController.updateManufacturer)
  .delete(authorize("Admin", "Manager"),assetController.deleteManufacturer);

  module.exports = router;