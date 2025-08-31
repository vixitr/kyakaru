// server.js
const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// API endpoint: generate image card
app.post("/api/card", async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and Answer are required" });
  }

  try {
    // Launch Puppeteer (headless Chrome)
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Generate HTML card
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: linear-gradient(135deg, #ff9a9e, #fad0c4);
            }
            .card {
              width: 600px;
              padding: 30px;
              border-radius: 20px;
              background: white;
              box-shadow: 0 5px 20px rgba(0,0,0,0.2);
              text-align
