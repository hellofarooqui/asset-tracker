const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');

const AuthRouter = require("./routes/auth.routes");
const AssetRouter = require("./routes/assets.routes");
const UserRouter = require("./routes/users.routes");
const ReportsRouter = require("./routes/reports.routes");
const ManufacturerRouter = require("./routes/manufacturer.routes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/assets", AssetRouter );
app.use("/api/users", UserRouter);
app.use("/api/reports", ReportsRouter);
app.use('/api/manufacturers', ManufacturerRouter)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


