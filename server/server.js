require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

const hospitalRoutes = "./routes/hospitalRoutes.js";
app.use("/api", hospitalRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

