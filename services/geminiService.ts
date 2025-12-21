
import { GoogleGenAI, Type } from "@google/genai";
import { TrendingTopic, Comment } from "../types";

export const generatePostCaption = async (
  images: Array<{ base64: string; mimeType: string }>,
  userPrompt?: string
): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing. Cannot generate caption.";
  if (images.length === 0) return "";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = userPrompt 
      ? `Based on these ${images.length} images and my idea "${userPrompt}", write a catchy, engaging social media caption with hashtags that connects all images.`
      : `Write a witty and engaging social media caption for this set of ${images.length} images with relevant hashtags.`;

    const parts = images.map(img => ({
      inlineData: {
        data: img.base64,
        mimeType: img.mimeType
      }
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          ...parts,
          { text: prompt }
        ]
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Caption Error:", error);
    return "Failed to generate caption.";
  }
};

export const getTrendingTopics = async (): Promise<TrendingTopic[]> => {
  if (!process.env.API_KEY) {
    return [
      { title: "API Key Missing", url: "#", snippet: "Please configure your API Key." }
    ];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "What are the top 5 trending news topics in technology and science right now? Provide a brief title and a summary for each.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const topics: TrendingTopic[] = groundingChunks
      .filter(chunk => chunk.web?.uri && chunk.web?.title)
      .map(chunk => ({
        title: chunk.web?.title || "Trending Topic",
        url: chunk.web?.uri || "#",
        snippet: "Click to read more about this trending story.",
        source: new URL(chunk.web?.uri || "https://google.com").hostname
      }))
      .slice(0, 5);

    if (topics.length === 0 && response.text) {
       return [{
         title: "Latest Trends",
         url: "https://google.com",
         snippet: response.text.slice(0, 150) + "...",
         source: "Gemini Summary"
       }];
    }

    return topics;
  } catch (error) {
    console.error("Gemini Trending Error:", error);
    return [];
  }
};

export const enhanceText = async (text: string): Promise<string> => {
  if (!process.env.API_KEY) return text;
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Improve the following social media post text to be more engaging, grammar-perfect, and professional yet accessible. Keep it concise. Text: "${text}"`,
    });
    return response.text || text;
  } catch (error) {
    console.error("Gemini Enhance Error:", error);
    return text;
  }
};

export const analyzeSentiment = async (comments: Comment[]): Promise<{ score: number; summary: string }> => {
  if (!process.env.API_KEY || comments.length === 0) return { score: 0, summary: "No data to analyze." };

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const commentTexts = comments.map(c => c.text).join("\n---\n");
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the sentiment of the following comments. Return a score from 0 (very negative) to 100 (very positive) and a brief 2-sentence summary of the general feedback. 
      Comments:
      ${commentTexts}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          },
          required: ["score", "summary"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Sentiment Analysis Error:", error);
    return { score: 50, summary: "Analysis failed." };
  }
};
