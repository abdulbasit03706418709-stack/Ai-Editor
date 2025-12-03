import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Strips the Data URL prefix (e.g., "data:image/png;base64,") to get raw base64.
 */
const stripBase64Prefix = (base64Str: string): string => {
  const base64Data = base64Str.split(',')[1];
  return base64Data || base64Str;
};

const extractImageFromResponse = (response: any): string | null => {
  if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
}

export const generateMergedPhoto = async (
  childPhotoBase64: string,
  childMimeType: string,
  adultPhotoBase64: string,
  adultMimeType: string
): Promise<string | null> => {
  try {
    const childData = stripBase64Prefix(childPhotoBase64);
    const adultData = stripBase64Prefix(adultPhotoBase64);

    const prompt = `
      You are an expert photo editor.
      
      Input Images:
      1. First image: A childhood photo of a person (The "Child").
      2. Second image: A recent adult photo of the same person (The "Adult").
      
      Task:
      Create a photorealistic composite image where the Adult (from the second image) is meeting and holding the hand of their younger self (the Child from the first image).
      
      Requirements:
      - The Adult in the output must closely resemble the person in the second provided image (Adult source).
      - The Child in the output must closely resemble the person in the first provided image (Child source).
      - Interaction: The Adult is gently holding the Child's hand. They are standing side-by-side or facing each other warmly.
      - Background: Replace the background with a soft, clean, high-key white or off-white studio setting.
      - Lighting: Soft, dreamy, and flattering.
      - Style: Realistic photography.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [
          { inlineData: { mimeType: childMimeType, data: childData } },
          { inlineData: { mimeType: adultMimeType, data: adultData } },
          { text: prompt },
        ],
      },
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Error generating merged image:", error);
    throw error;
  }
};

export const generateEditedImage = async (
  imageBase64: string,
  mimeType: string,
  instruction: string,
  userText?: string
): Promise<string | null> => {
  try {
    const imageData = stripBase64Prefix(imageBase64);
    
    // Incorporate user input if provided (e.g. for Magic Eraser or Look Builder)
    const finalPrompt = userText 
      ? `${instruction}. Specific details: ${userText}` 
      : instruction;

    const fullPrompt = `
      You are an expert professional photo editor using advanced AI tools.
      
      Input Image: Provided.
      Task: ${finalPrompt}
      
      Requirements:
      - Maintain the original subject identity and key composition unless strictly asked to change them.
      - High fidelity, photorealistic output (unless a specific artistic style is requested).
      - If removing objects (Magic Eraser), fill the space naturally (inpainting).
      - If extending or cropping, ensure high coherence.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: imageData } },
          { text: fullPrompt },
        ],
      },
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};
