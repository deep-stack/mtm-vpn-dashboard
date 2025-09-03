import { NextApiRequest, NextApiResponse } from 'next';

const GITHUB_RELEASES_URL="https://git.vdb.to/api/v1/repos/cerc-io/mtm-vpn-client-public/releases"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(GITHUB_RELEASES_URL, {
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
