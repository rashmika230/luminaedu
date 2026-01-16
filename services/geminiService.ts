
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  // Safe check for browser environments where process is not defined
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const askStudyAssistant = async (question: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: "You are a helpful academic assistant for an online learning platform. Answer students' questions clearly and concisely, focusing on educational topics.",
      },
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with the study assistant. Please try again later.";
  }
};
