const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');

const app = express();

const usernames = [
  'xrajeditz63',
  'anup_raee',
  'sa_phal',
  'sushil_patel0'
];

async function getVideoIdsWithPuppeteer(username) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  );
  await page.goto(`https://www.tiktok.com/@${username}`, {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // Extract __NEXT_DATA__ JSON from the page
  const data = await page.evaluate(() => {
    const script = document.querySelector('script#__NEXT_DATA__');
    return script ? JSON.parse(script.innerText) : null;
  });

  await browser.close();

  if (!data) throw new Error('Failed to find __NEXT_DATA__ in rendered page');

  const videos = data?.props?.pageProps?.items || data?.props?.pageProps?.videoData?.items;

  if (!videos || !videos.length) {
    throw new Error('No videos found for user');
  }

  return videos.map(v => v.id);
}

app.get('/api/tikstalk', async (req, res) => {
  try {
    const username = usernames[Math.floor(Math.random() * usernames.length)];

    const videoIds = await getVideoIdsWithPuppeteer(username);

    const videoId = videoIds[Math.floor(Math.random() * videoIds.length)];

    const shareResp = await axios.get(`https://www.tiktok.com/node/share/video/${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      }
    });

    const shortUrl = shareResp.data?.itemInfo?.itemStruct?.share_info?.share_link;

    if (!shortUrl) throw new Error('Failed to get short URL');

    res.json({
      success: true,
      username,
      video_id: videoId,
      short_url: shortUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TikStalk Puppeteer API running on port ${PORT}`));
    
