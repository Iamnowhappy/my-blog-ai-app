// /api/generate.ts  (Vercel Serverless Function - TypeScript)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { category, title, style, tags = [] } = req.body || {};
    if (!title) return res.status(400).json({ error: 'Missing title' });

    const prompt = `
너는 블로그 전문작가야.
아래 정보를 반영해 글을 작성해줘(한국어).

카테고리: ${category ?? '일반'}
제목: ${title}
문체/톤: ${style ?? '친근한'}
태그(참고): ${Array.isArray(tags) ? tags.join(', ') : ''}

형식 요구:
- 제목(h2) 포함
- 서론 1단락
- 본문 소제목 3개와 각 2~3문단
- 결론 1단락
- FAQ 2~3개 (Q와 A 명확히)
- HTML이 아니라 일반 텍스트(마크다운 느낌)로 자연스럽게 작성
    `.trim();

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 안정/비용 밸런스 모델
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      return res.status(500).json({ error: 'OpenAI error', detail: errText });
    }

    const data = await openaiRes.json();
    const content = data?.choices?.[0]?.message?.content ?? '';

    return res.status(200).json({ content });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? 'Server error' });
  }
}
