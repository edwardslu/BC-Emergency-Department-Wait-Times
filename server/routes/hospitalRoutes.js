const express = require("express");
const axios = require("axios");
const Hospital = require("../models/hospital");
const router = express.Router();

// Update hospital data
router.get("/update-hospitals", async (req, res) => {
  try {
    const { data } = await axios.get("https://edwaittimes.ca/api/wait-times");
    await Hospital.deleteMany({});
    await Hospital.insertMany(data);
    res.send("Updated hospital wait times.");
  } catch (err) {
    res.status(500).send("Error updating data.");
  }
});

// Serve hospital data
router.get("/hospitals", async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
});

module.exports = router;
