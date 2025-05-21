const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { apiLimiter } = require("./middlewares/rateLimiter");
const { verifyToken } = require("./middlewares/auth");

const app = express();
const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const parkingRoutes = require("./routes/parking");
const carRoutes = require("./routes/car");
const reportRoutes = require("./routes/report/index");
const setupSwagger = require("./swagger");

dotenv.config();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Apply rate limiting to all routes
app.use(apiLimiter);

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

// Protected routes
app.use("/api/parking", verifyToken, parkingRoutes);
app.use("/api/car", verifyToken, carRoutes);
app.use("/api/reports", verifyToken, reportRoutes);

// Swagger documentation
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
