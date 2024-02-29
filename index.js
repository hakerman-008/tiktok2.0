const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/tiktok', async (req, res) => {
  try {
    const query = req.query.query;
    const apiKey = 'vrGjIdJL';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the target page
    await page.goto(`https://api.betabotz.eu.org/api/search/tiktoks?query=${query}&apikey=${apiKey}`);

    // Extract data from the page
    const data = await page.evaluate(() => {
      return JSON.parse(document.querySelector('pre').textContent);
    });

    await browser.close();

    if (data.status && data.result && data.result.data.length > 0) {
      const playUrls = data.result.data.map(video => video.play);
      res.json({ urls: playUrls });
    } else {
      res.status(404).json({ error: 'No TikTok videos found for the provided query' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch TikTok videos' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
