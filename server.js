const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

/* ======================
   API ROUTES
====================== */

// Example lookup API
app.get("/api/lookup", (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res.json({ success: false, message: "Name is required" });
  }

  // Dummy data (replace later with DB)
  const result = {
    name: name,
    status: "Verified",
    nin: "12345678901",
    date: new Date().toLocaleDateString()
  };

  res.json({ success: true, data: result });
});

// Example table data
app.get("/api/table", (req, res) => {
  res.json([
    { id: 1, name: "Ahmed Musa", status: "Verified" },
    { id: 2, name: "Aisha Bello", status: "Pending" },
    { id: 3, name: "Yakubu Shehu", status: "Verified" }
  ]);
});

// Always return index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
