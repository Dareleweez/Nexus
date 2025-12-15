import { GoogleGenAI, Type } from "@google/genai";
import { TrendingTopic } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePostCaption = async (
  imageBase64: string, 
  mimeType: string,
  userPrompt?: string
): Promise<string> => {
  if (!apiKey) return "API Key missing. Cannot generate caption.";

  try {
    const prompt = userPrompt 
      ? `Based on this image and my idea "${userPrompt}", write a catchy, engaging social media caption with hashtags.`
      : "Write a witty and engaging social media caption for this image with relevant hashtags.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType
            }
          },
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
  if (!apiKey) {
    return [
      { title: "API Key Missing", url: "#", snippet: "Please configure your API Key." }
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "What are the top 5 trending news topics in technology and science right now? Provide a brief title and a summary for each.",
      config: {
        tools: [{ googleSearch: {} }],
        // We do not use JSON schema here because googleSearch tool doesn't support it well with schemas in some versions.
        // We will parse the grounding chunks.
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Transform grounding chunks into trending topics
    // Filter out chunks that don't have web URIs
    const topics: TrendingTopic[] = groundingChunks
      .filter(chunk => chunk.web?.uri && chunk.web?.title)
      .map(chunk => ({
        title: chunk.web?.title || "Trending Topic",
        url: chunk.web?.uri || "#",
        snippet: "Click to read more about this trending story.",
        source: new URL(chunk.web?.uri || "https://google.com").hostname
      }))
      .slice(0, 5); // Limit to 5

    // If no grounding chunks returned standard web results, try to parse the text
    if (topics.length === 0 && response.text) {
       // Fallback: Return the text as a single 'topic' if search didn't structure it perfectly
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
  if (!apiKey) return text;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Improve the following social media post text to be more engaging, grammar-perfect, and professional yet accessible. Keep it concise. Text: "${text}"`,
    });
    return response.text || text;
  } catch (error) {
    console.error("Gemini Enhance Error:", error);
    return text;
  }
};