import puppeteer from 'puppeteer';
import axios from 'axios';

const usernames = ['xrajeditz63', 'anup_raee', 'sa_phal', 'sushil_patel0'];

export default async function handler(req, res) {
  try {
    const username = usernames[Math.floor(Math.random() * usernames.length)];

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    );

    await page.goto(`https://www.tiktok.com/@${username}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const data = await page.evaluate(() => {
      const script = document.querySelector('script#__NEXT_DATA__');
      return script ? JSON.parse(script.innerText) : null;
    });

    await browser.close();

    if (!data) throw new Error('No __NEXT_DATA__ found');
    const videos = data?.props?.pageProps?.items || data?.props?.pageProps?.videoData?.items;
    if (!videos || !videos.length) throw new Error('No videos found');

    const videoId = videos[Math.floor(Math.random() * videos.length)].id;

    const shareResp = await axios.get(`https://www.tiktok.com/node/share/video/${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      }
    });

    const shortUrl = shareResp.data?.itemInfo?.itemStruct?.share_info?.share_link;

    if (!shortUrl) throw new Error('Short URL not found');

    res.status(200).json({
      success: true,
      username,
      video_id: videoId,
      short_url: shortUrl
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
      }
      
