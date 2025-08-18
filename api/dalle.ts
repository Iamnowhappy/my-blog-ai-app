// /api/dalle.ts (Vercel Serverless Function - TypeScript)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt = 'Blog cover image' } = req.body || {};

    const imgRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: '512x512',
        // quality: 'standard', // 필요시 사용
      }),
    });

    if (!imgRes.ok) {
      const errText = await imgRes.text();
      return res.status(500).json({ error: 'OpenAI image error', detail: errText });
    }

    const data = await imgRes.json();
    const url = data?.data?.[0]?.url || '';

    return res.status(200).json({ url });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? 'Server error' });
  }
}
