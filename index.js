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
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.tiktok.com/',
      // 'Cookie': 'tt_webid_v2=YOUR_VALID_COOKIE;' // Optional: add if blocked
    }
  });

  const html = res.data;
  const $ = cheerio.load(html);

  let scriptText = $('script#__NEXT_DATA__').html();

  if (!scriptText) {
    // Fallback to SIGI_STATE
    scriptText = $('script#SIGI_STATE').html();
    if (!scriptText) throw new Error('Failed to find __NEXT_DATA__ or SIGI_STATE');
  }

  const data = JSON.parse(scriptText);

  // Try to extract video list from __NEXT_DATA__
  if (data?.props?.pageProps?.items?.length) {
    return data.props.pageProps.items.map(v => v.id);
  }

  // Try to extract video list from SIGI_STATE
  if (data?.ItemModule) {
    return Object.values(data.ItemModule).map(v => v.id);
  }

  // Try other common paths
  if (data?.props?.pageProps?.videoData?.items?.length) {
    return data.props.pageProps.videoData.items.map(v => v.id);
  }

  throw new Error('No videos found for user');
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
  
