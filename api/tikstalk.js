import axios from 'axios';

export default async function handler(req, res) {
  const videoId = req.query.id; // You call: /api/tikvideo?id=6811123699203329285

  if (!videoId) {
    return res.status(400).json({ error: 'Missing TikTok video ID (`id` query)' });
  }

  try {
    const response = await axios.get('https://scraptik.p.rapidapi.com/video-without-watermark', {
      params: { aweme_id: videoId },
      headers: {
        'x-rapidapi-host': 'scraptik.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY // Set this in Vercel project settings
      }
    });

    res.json({
      success: true,
      video_id: videoId,
      video_url: response.data.video
    });

  } catch (error) {
    res.status(500).json({ error: error.message || 'Request failed' });
  }
    }
