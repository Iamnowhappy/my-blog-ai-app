export default async function handler(req: any, res: any) {
  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  const dalleRes = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      n: 1,
      size: "512x512",
    }),
  });

  const imageData = await dalleRes.json();
  res.status(200).json(imageData);
}
