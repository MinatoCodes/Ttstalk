const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// TikTok usernames
const usernames = [
  "xrajeditz63",
  "anup_raee",
  "sa_phal",
  "sushil_patel0"
];

app.get("/api/tikstalk", async (req, res) => {
  // Step 1: Pick a random username
  const username = usernames[Math.floor(Math.random() * usernames.length)];

  try {
    // Step 2: Fetch all videos for that user
    const response = await axios.post("https://tikwm.com/api/user/posts", {
      unique_id: username,
      count: 100
    }, {
      headers: { "Content-Type": "application/json" }
    });

    const videos = response.data?.data?.videos || [];

    if (!videos.length) {
      return res.status(404).json({
        success: false,
        message: `No videos found for user @${username}`
      });
    }

    // Step 3: Pick a random video from those
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    // Step 4: Return random video details
    res.json({
      success: true,
      username,
      video: {
        id: randomVideo.id,
        title: randomVideo.title,
        play: randomVideo.play, // direct video URL
        cover: randomVideo.cover,
        create_time: randomVideo.create_time
      }
    });

  } catch (err) {
    console.error(`❌ Error fetching videos for @${username}:`, err.message);
    res.status(500).json({
      success: false,
      message: `Failed to fetch videos for @${username}`,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}/api/tikstalk`);
});
        
