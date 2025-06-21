import axios from 'axios';

export default async function handler(req, res) {
  const videoId = req.query.id;
  if (!videoId) {
    return res.status(400).json({ error: 'Missing TikTok video ID (`id` query)' });
  }

  try {
    const response = await axios.get('https://scraptik.p.rapidapi.com/video-without-watermark', {
      params: { aweme_id: videoId },
      headers: {
        'x-rapidapi-host': 'scraptik.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      }
    });
    return res.json({
      success: true,
      video_id: videoId,
      video_url: response.data.video
    });
  } catch (error) {
    console.error('API call error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to fetch video from RapidAPI' });
  }
      }
      
