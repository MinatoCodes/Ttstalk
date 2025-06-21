const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const usernames = [
  'xrajeditz63',
  'anup_raee',
  'sa_phal',
  'sushil_patel0'
];

async function getVideoIds(username) {
  const url = `https://www.tiktok.com/@${username}`;
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.tiktok.com/'
    }
  });

  const html = res.data;
  const $ = cheerio.load(html);
  const scriptText = $('script#__NEXT_DATA__').html();
  if (!scriptText) throw new Error('Failed to find __NEXT_DATA__');

  const data = JSON.parse(scriptText);

  const videos = data?.props?.pageProps?.items || data?.props?.pageProps?.userData?.user?.videos || null;

  if (!videos || !videos.length) {
    const itemList = data?.props?.pageProps?.videoData?.items;
    if (itemList && itemList.length) return itemList.map(v => v.id);
    throw new Error('No videos found for user');
  }

  return videos.map(v => v.id);
}

app.get('/api/tikstalk', async (req, res) => {
  try {
    const username = usernames[Math.floor(Math.random() * usernames.length)];

    const videoIds = await getVideoIds(username);
    if (!videoIds.length) return res.status(404).json({ error: 'No videos found for user' });

    const videoId = videoIds[Math.floor(Math.random() * videoIds.length)];

    const shareResp = await axios.get(`https://www.tiktok.com/node/share/video/${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      }
    });

    const shortUrl = shareResp.data?.itemInfo?.itemStruct?.share_info?.share_link;
    if (!shortUrl) throw new Error('Failed to get short URL');

    return res.json({
      success: true,
      username,
      video_id: videoId,
      short_url: shortUrl
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TikStalk API running on port ${PORT}`));
    
