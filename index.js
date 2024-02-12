const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000; 

app.use(express.json());

app.get('/tiktok', async (req, res) => {
  try {
    const query = req.query.query;
    const apiKey = 'vrGjIdJL';

    const apiUrl = `https://api.betabotz.eu.org/api/search/tiktoks?query=${query}&apikey=${apiKey}`;
    const response = await axios.get(apiUrl);

    if (response.data.status && response.data.result.data.length > 0) {
     
      const playUrls = response.data.result.data.map(video => video.play);

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
