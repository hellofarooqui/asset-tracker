const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFiles = (uploadDir = "uploads") => {
    console.log("Uploading an image")
  // Multer storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "..", "uploads", uploadDir);
      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const safeName = `${file.fieldname}-${Date.now()}${ext}`;
      cb(null, safeName);
    },
  });

  // File filter for images only
  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  });
};

// Create middleware for manufacturer logo upload
const uploadManufacturerLogo = uploadFiles("ManufacturerLogos").single("logoImage");

module.exports = {
  uploadManufacturerLogo,
};

// ============================================================================
// HOW TO USE IN YOUR ROUTE
// ============================================================================

/*
const express = require('express');
const { uploadManufacturerLogo } = require('./middleware/upload');

const router = express.Router();

router.post('/manufacturer', uploadManufacturerLogo, (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get file information (automatically added by multer)
    const fileInfo = req.file;
    console.log('File path:', fileInfo.path);           // Full path
    console.log('File name:', fileInfo.filename);       // Saved filename
    console.log('Original name:', fileInfo.originalname);
    console.log('File size:', fileInfo.size);

    // Get form data
    const { name } = req.body;
    const email = req.body['contactInfo[email]'];
    const phone = req.body['contactInfo[phone]'];
    const address = req.body['contactInfo[address]'];

    // Save to database
    const manufacturer = {
      name,
      logoPath: fileInfo.path,  // Save this in your database
      contactInfo: { email, phone, address }
    };

    res.json({
      message: 'Manufacturer created successfully',
      data: manufacturer
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve uploaded files
const app = express();
app.use('/uploads', express.static('uploads'));

module.exports = router;
*/