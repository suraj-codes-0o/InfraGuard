const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "InfraGuard Backend API is running 🚀",
  });
});

// GET ALL ASSETS
app.get("/api/assets", (req, res) => {
  const sql = "SELECT * FROM assets ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch assets",
      });
    }

    res.json({
      success: true,
      assets: results,
    });
  });
});

// ADD NEW ASSET
app.post("/api/assets", (req, res) => {
  const {
    asset_id,
    name,
    type,
    location,
    department,
    data_source,
    impact,
    latitude,
    longitude,
  } = req.body;

  if (!asset_id || !name || !type) {
    return res.status(400).json({
      success: false,
      message: "Asset ID, name and type are required",
    });
  }

  const sql = `
    INSERT INTO assets
    (asset_id, name, type, location, department, data_source,
     impact, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    asset_id,
    name,
    type,
    location,
    department,
    data_source,
    impact || "Low",
    latitude || null,
    longitude || null,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Failed to add asset",
      });
    }

    res.status(201).json({
      success: true,
      message: "Asset added successfully",
      id: result.insertId,
    });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`InfraGuard server running on port ${PORT}`);
});