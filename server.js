// server-test.js
// server.js - minimal test server for Render
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ kyakaru test server is running — Puppeteer removed.");
});

app.post("/api/echo", (req, res) => {
  res.json({ ok: true, received: req.body });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

