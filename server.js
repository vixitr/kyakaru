// server.js - Render-friendly card generator (NO puppeteer)
const express = require("express");
const bodyParser = require("body-parser");
const { createCanvas, loadImage } = require("canvas");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Auto-wrap text helper
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

app.post("/api/card", async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and Answer required" });
  }

  try {
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#ff9a9e");
    gradient.addColorStop(1, "#fad0c4");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // White center card
    const cardX = 100;
    const cardY = 100;
    const cardW = 1000;
    const cardH = 430;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 25);
    ctx.fill();

    // Question text
    ctx.fillStyle = "#111111";
    ctx.font = "bold 48px Arial";
    wrapText(ctx, question, cardX + 40, cardY + 80, cardW - 80, 60);

    // Answer text
    ctx.fillStyle = "#444444";
    ctx.font = "32px Arial";
    wrapText(ctx, answer, cardX + 40, cardY + 230, cardW - 80, 45);

    // Output PNG buffer
    const buffer = canvas.toBuffer("image/png");

    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to generate image" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("✅ kyakaru card generator API is running (canvas version)");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
