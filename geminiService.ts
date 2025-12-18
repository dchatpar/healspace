
import { GoogleGenAI, Type } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSentiment = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the sentiment and emotional state of this user message for a compassion platform in India.
      The text might be in English, Hindi, or Hinglish. Determine if there is any crisis risk.
      Message: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            intensity: { type: Type.NUMBER, description: "1-10" },
            riskLevel: { type: Type.STRING, description: "low, medium, high" },
            suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiresImmediateCrisisLink: { type: Type.BOOLEAN }
          },
          required: ["sentiment", "riskLevel", "requiresImmediateCrisisLink"]
        }
      }
    });

    const output = response.text;
    return output ? JSON.parse(output) : null;
  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    return null;
  }
};

export const getAIPromptForCall = async (mood: string, tags: string[]) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `A user in India is feeling ${mood} and looking for support with topics like ${tags.join(', ')}. 
        Generate 3 compassionate opening questions in a mix of Hindi and English (Hinglish) that a listener could use to start the conversation anonymously.
        Example: "Aaj ka din kaisa raha aapka?" or "Work stress zyada ho raha hai kya?"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      const output = response.text;
      return output ? JSON.parse(output) : ["Aaj aap kaisa feel kar rahe hain?", "Kya chal raha hai dimaag mein?", "Main yahan hoon aapki baat sunne ke liye."];
    } catch (e) {
        return ["Aaj aap kaisa feel kar rahe hain?", "Kya chal raha hai dimaag mein?", "Main yahan hoon aapki baat sunne ke liye."];
    }
}
