import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const githubReleasesUrl = process.env.GITHUB_RELEASES_URL;
  
  if (!githubReleasesUrl) {
    return res.status(500).json({ error: 'GitHub releases URL not configured' });
  }

  try {
    const response = await fetch(githubReleasesUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MTM-VPN-Dashboard/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('GitHub releases proxy error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'GitHub releases request failed' 
    });
  }
}
