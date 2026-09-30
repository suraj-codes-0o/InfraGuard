const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "InfraGuard Backend API is running 🚀",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`InfraGuard server running on port ${PORT}`);
});