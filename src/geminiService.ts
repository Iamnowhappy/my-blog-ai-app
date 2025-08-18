import { GoogleGenAI, Type } from "@google/genai";
import type { ManualPostPayload } from './types';

const imageModel = 'imagen-3.0-generate-002';

const getGoogleGenAI = (apiKey: string) => {
    return new GoogleGenAI({ apiKey });
}

export async function suggestTopicsForAiMode(apiKey: string, model: string, category: string): Promise<string[]> {
  const ai = getGoogleGenAI(apiKey);
  const prompt = `You are an expert SEO copywriter specializing in creating viral content in Korea. For the blog category "${category}", generate a list of 10 highly engaging, SEO-optimized, and clickable blog post titles. Return the response as a single JSON object with a key "topics" which is an array of 10 titles in Korean.`;
  const schema = {
    type: Type.OBJECT,
    properties: {
      topics: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['topics']
  };

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: { responseMimeType: "application/json", responseSchema: schema },
  });
  const parsed = JSON.parse(response.text.trim());
  if (parsed.topics && Array.isArray(parsed.topics)) {
    return parsed.topics;
  }
  throw new Error("Invalid JSON structure for topics received from API.");
}

export async function generateBlogPost(apiKey: string, model: string, topic: string, category: string, region: string, targetAudience: string): Promise<ManualPostPayload> {
  const ai = getGoogleGenAI(apiKey);
  const prompt = `You are an expert AI Blog Post Generator. Create a comprehensive, high-quality, and SEO-optimized blog post in Korean based on the following details. Adhere strictly to the user's "Prompt and Structure Guide".

  **Post Details:**
  - Topic: "${topic}"
  - Category: "${category}"
  - Region Focus: "${region}"
  - Target Audience: "${targetAudience}"

  **Generation Instructions:**
  1.  **Title:** Create a final, compelling, SEO-friendly title based on the user's topic.
  2.  **Content Structure (Ki-Seung-Jeon-Gyeol):**
      -   The entire post should be between 2000 and 2500 Korean characters.
  3.  **Images:** Generate prompts for THREE (3) distinct, contextually relevant images. Placeholders for these images in the content template should be '<!-- IMAGE_1 -->', '<!-- IMAGE_2 -->', and '<!-- IMAGE_3 -->'.
  4.  **Q&A Section:** Create a section with 7 relevant questions and their answers to appear after the conclusion.
  5.  **Tags:** Generate 10 powerful, high-traffic, SEO-optimized tags related to the content.

  **Output Format:**
  Return a single JSON object. Do not include any markdown formatting (e.g., \`\`\`json). The structure must be exactly as follows:
  {
    "title": "Final SEO-optimized title",
    "contentTemplate": "The full blog post content in HTML string format. Do NOT include ${'<html>'}, ${'<head>'}, or ${'<body>'} tags.",
    "imagePrompts": ["A descriptive prompt for image 1", "A descriptive prompt for image 2", "A descriptive prompt for image 3"],
    "tags": ["tag1", "tag2", ... , "tag10"],
    "qna": [{"question": "Q1", "answer": "A1"}, ..., {"question": "Q7", "answer": "A7"}]
  }
  `;
  const schema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        contentTemplate: { type: Type.STRING },
        imagePrompts: { type: Type.ARRAY, items: { type: Type.STRING }},
        tags: { type: Type.ARRAY, items: { type: Type.STRING }},
        qna: { 
            type: Type.ARRAY, 
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING },
                },
                required: ["question", "answer"],
            }
        },
    },
    required: ["title", "contentTemplate", "imagePrompts", "tags", "qna"]
  };
  
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.7 }
  });
  
  return JSON.parse(response.text.trim()) as ManualPostPayload;
}

export async function generateImages(apiKey: string, prompts: string[]): Promise<string[]> {
    const ai = getGoogleGenAI(apiKey);
    const imagePromises = prompts.map(prompt => 
        ai.models.generateImages({
            model: imageModel,
            prompt: `${prompt}, digital art, high quality, vibrant`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        })
    );

    const responses = await Promise.all(imagePromises);
    return responses.map(res => {
        const base64ImageBytes = res.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    });
}