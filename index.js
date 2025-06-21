const express = require('express');
const axios = require('axios');

const app = express();

// ✅ Your hardcoded list of usernames
const usernames = [
  'xrajeditz63',
  'anup_raee',
  'sa_phal',
  'sushil_patel0'
];

app.get('/api/tikstalk', async (req, res) => {
  // pick one username randomly
  const username = usernames[Math.floor(Math.random() * usernames.length)];

  try {
    // Get secUid of the user
    const info = await axios.get(`https://api.tikwm.com/user/info?unique_id=${username}`);
    const secUid = info.data.data.sec_uid;

    // Get posts
    const posts = await axios.get(`https://api.tikwm.com/user/posts?sec_uid=${secUid}&count=20`);
    const items = posts.data.data;
    if (!items.length) return res.status(404).json({ error: "No videos found" });

    // Pick random video
    const one = items[Math.floor(Math.random() * items.length)];
    const videoId = one.id;

    // Get TikTok short URL
    const resp = await axios.get(
      `https://www.tiktok.com/node/share/video/${videoId}`,
      {
        params: { secUid },
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
        }
      }
    );

    const shortLink = resp.data?.itemInfo?.itemStruct?.share_info?.share_link;
    if (!shortLink) throw new Error("Short link not found");

    res.json({
      success: true,
      username,
      video_id: videoId,
      short_url: shortLink
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on port ${port}`));
        
