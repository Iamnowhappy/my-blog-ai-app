```tsx
import React, { useState } from "react";

export default function Home() {
  const [category, setCategory] = useState("생활");
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("진중한");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // GPT로 블로그 글 생성
  const generateBlog = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title, style, tags })
      });

      if (!res.ok) throw new Error("글 생성 실패");

      const data = await res.json();
      setContent(data.content);

      // 대표 이미지도 함께 생성
      const imgRes = await fetch("/api/dalle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: title })
      });

      if (imgRes.ok) {
        const imgData = await imgRes.json();
        setImage(imgData.url);
      }
    } catch (err) {
      alert("글 생성 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">블로그 글쓰기 AI 도우미</h1>

      <div className="space-y-4">
        {/* 카테고리 */}
        <input
          type="text"
          placeholder="카테고리"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* 제목 */}
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* 문체 */}
        <div className="flex gap-4">
          {['진중한','간결한','친근한'].map((s) => (
            <label key={s}>
              <input
                type="radio"
                value={s}
                checked={style === s}
                onChange={() => setStyle(s)}
              />
              {s}
            </label>
          ))}
        </div>

        {/* 태그 */}
        <input
          type="text"
          placeholder="태그 입력 (쉼표로 구분)"
          onBlur={(e) => setTags(e.target.value.split(",").map(t => t.trim()))}
          className="w-full border p-2 rounded"
        />

        {/* 버튼 */}
        <button
          onClick={generateBlog}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "생성 중..." : "글 생성"}
        </button>
      </div>

      {/* 결과 */}
      {content && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">생성된 블로그 글</h2>
          {image && <img src={image} alt="대표 이미지" className="mb-4 rounded" />}
          <div className="prose whitespace-pre-wrap">{content}</div>
        </div>
      )}
    </div>
  );
}
```
