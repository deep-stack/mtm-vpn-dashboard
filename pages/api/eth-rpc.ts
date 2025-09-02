import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ethRpcUrl = process.env.ETH_RPC_URL;
  
  if (!ethRpcUrl) {
    return res.status(500).json({ error: 'ETH RPC URL not configured' });
  }

  try {
    const response = await fetch(ethRpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('ETH RPC proxy error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'RPC request failed' 
    });
  }
}