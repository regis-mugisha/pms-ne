const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const parkingRoutes = require("./routes/parking");
const carRoutes = require("./routes/car");
const setupSwagger = require("./swagger");

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/car", carRoutes);
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
