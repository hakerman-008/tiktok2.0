const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000; // Choose a port number

app.use(express.json());

app.get('/tiktok', async (req, res) => {
  try {
    const query = req.query.query;
    const apiKey = 'vrGjIdJL'; // Your API key

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(`https://api.betabotz.eu.org/api/search/tiktoks?query=${query}&apikey=${apiKey}`);
    const response = await page.evaluate(() => {
      return {
        status: true, // Simulating a successful response for now
        result: {
          data: Array.from(document.querySelectorAll('.result')).map(element => ({
            play: element.querySelector('.play').getAttribute('href')
          }))
        }
      };
    });

    await browser.close();

    if (response.status && response.result.data.length > 0) {
      res.json({ urls: response.result.data.map(video => video.play) });
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
