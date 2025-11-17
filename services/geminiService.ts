import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function fileToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64.split(',')[1],
      mimeType
    },
  };
}

const IMAGE_GENERATION_KEYWORDS = ['generate', 'draw', 'create an image of', 'make a picture of'];

export const generateResponse = async (prompt: string, imageBase64: string | null, userAge: number): Promise<ChatMessage> => {
  const isImageGenerationRequest = IMAGE_GENERATION_KEYWORDS.some(keyword => prompt.toLowerCase().trim().startsWith(keyword));

  let systemInstruction = "You are a very cute, friendly, and cheerful chatbot. You love using emojis and making people happy. Keep your responses sweet and concise.";

  if (userAge >= 4 && userAge <= 14) {
      systemInstruction = "You are a very cute, friendly, and cheerful chatbot talking to a child. You love using emojis. Your answers must be very simple, short, and easy for a child to understand. Do not use complex words or long sentences.";
  }

  try {
    if (isImageGenerationRequest) {
      // Image Generation
      const generationPrompt = prompt.toLowerCase().replace(/^(generate|draw|create an image of|make a picture of)\s*/, '');
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Cute, kawaii, adorable, pastel colors, ${generationPrompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
      });

      if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed to produce an image.");
      }
      
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      
      return {
        role: 'model',
        text: `Here's the cute picture you asked for! Isn't it adorable?`,
        image: imageUrl,
      };

    } else if (imageBase64) {
      // Multimodal (Vision)
      const imagePart = fileToGenerativePart(imageBase64, 'image/png'); // Assuming png, can be improved to detect mime type
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }, imagePart] },
        config: {
            systemInstruction,
        }
      });

      return {
        role: 'model',
        text: response.text,
        image: null,
      };

    } else {
      // Text-only chat
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction
        }
      });
      
      return {
        role: 'model',
        text: response.text,
        image: null,
      };
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get a response from the model.");
  }
};