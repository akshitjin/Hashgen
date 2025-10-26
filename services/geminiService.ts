
import { GoogleGenAI } from "@google/genai";
import { Platform } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHashtags = async (title: string, platform: Platform): Promise<string[]> => {
  if (!title.trim()) {
    throw new Error("Title cannot be empty.");
  }

  const prompt = `
    As a social media growth expert, generate 30 highly relevant and viral hashtags for an ${platform} titled "${title}". 
    The hashtags should be a mix of high-volume, niche, and content-specific tags to maximize reach and engagement.
    Please provide the output as a single, space-separated string of hashtags, each starting with '#'. 
    Do not add any introductory text, explanations, or numbering.
    Example output: #hashtag1 #hashtag2 #hashtag3
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text;

    if (!text) {
      throw new Error("Received an empty response from the AI.");
    }
    
    const hashtags = text.split(' ').filter(tag => tag.startsWith('#'));
    
    if (hashtags.length === 0) {
        throw new Error("Failed to generate valid hashtags. The AI response might be in an unexpected format.");
    }

    return hashtags;
  } catch (error) {
    console.error("Error generating hashtags:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred while communicating with the AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating hashtags.");
  }
};
