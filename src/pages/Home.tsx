// Home.tsx - OpenAI 이미지 호출을 서버리스 API로 분리

import React, { useEffect, useRef, useState } from "react";

const [tags, setTags] = useState<string[]>([]);

async function generateBlogPost(prompt: string): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  return data.content || "생성 실패";
}

async function onGenerate() {
  if (!canGenerate) return;
  setLoading(true);

  const imagePrompt = `${category} - ${topic}`;

  let dalleImageUrl = "";
  try {
    const imageRes = await fetch("/api/dalle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: imagePrompt }),
    });
    const imageData = await imageRes.json();
    dalleImageUrl = imageData.data?.[0]?.url || "";
  } catch (e) {
    dalleImageUrl = "https://via.placeholder.com/512x512?text=DALL-E+실패";
  }

  const prompt = `
너는 전문 블로그 작가야. 아래 내용을 바탕으로 HTML 형식의 블로그 글을 작성해줘.

카테고리: ${category}
주제: ${topic}
톤: ${tone === "pro" ? "전문적" : tone === "concise" ? "간결한" : "친근한"}

조건:
- 제목 포함
- 서론 > 본문(소제목 3개) > 결론 형식
- 대표 이미지는 아래 URL을 사용:
  <img src='${dalleImageUrl}' />
- 본문 이미지는 <img src='https://aigallery.app/api/img?prompt=내용요약&size=medium' /> 형식으로 넣기
- FAQ 2~3개 포함
- 관련 태그 10개를 해시태그(#) 형식으로 나열해줘. 결과 하단에 <tags>#태그1, #태그2, ...</tags> 형식으로 포함해줘.
- 전체를 HTML로 마크업해서 반환해줘.
- 그리고 동일한 내용을 markdown으로도 작성해서 <md>...</md> 안에 넣어줘.
`.trim();

  try {
    const result = await generateBlogPost(prompt);
    const htmlOnly = result.replace(/<md>[\s\S]*?<\/md>/gi, "").trim();
    const mdMatch = result.match(/<md>[\s\S]*?<\/md>/i);
    const markdown = mdMatch ? mdMatch[0].replace(/<\/?.*?>/g, "").trim() : "";

    const tagMatch = result.match(/<tags>([\s\S]*?)<\/tags>/i);
    const tagText = tagMatch ? tagMatch[1] : "";
    const parsedTags = tagText
      .split(/[#\s,]+/)
      .filter((tag) => tag.trim())
      .map((tag) => `#${tag.trim()}`);
    setTags(parsedTags);

    const cleanedHTML = htmlOnly.replace(/<tags>[\s\S]*?<\/tags>/gi, "").trim();
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanedHTML, 'text/html');
    const html = doc.body.innerHTML;
    setHtmlContent(`<html><body>${html}</body></html>`);
    setMarkdownContent(markdown);
  } catch (err) {
    alert("글 생성 실패");
  }

  setLoading(false);
  setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
}
