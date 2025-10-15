import { GoogleGenAI, Type } from "@google/genai";
import type { ExtractedUrlData } from "../types";

export const extractTextFromImage = async (ai: GoogleGenAI, imageData: { data: string; mimeType: string }): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: imageData.mimeType,
        data: imageData.data,
      },
    };
    const textPart = {
      text: "You are an expert visual analyst. Your task is to create a rich knowledge base from this image for a chatbot.\n\n1. **Identify & Describe:** First, identify any specific objects, people, landmarks, or items in the image. For example, if you see food, try to name the dish (e.g., 'a plate of spaghetti bolognese'). Then, provide a detailed overall description of the scene, including colors, textures, and the general atmosphere.\n\n2. **Extract Text:** Second, meticulously extract any and all text visible in the image.\n\n3. **Synthesize:** Finally, combine the identification, description, and extracted text into a single, comprehensive text. This text will be the ONLY source of information for the chatbot. Be as detailed as possible to create a powerful and knowledgeable chatbot."
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error extracting text from image:", error);
    throw new Error("Failed to analyze image with Gemini API.");
  }
};

export const extractTextFromUrl = async (ai: GoogleGenAI, url: string): Promise<ExtractedUrlData> => {
  try {
     const prompt = `You are a specialized data extractor. Your primary and most critical mission is to process the content of the provided URL and return a valid JSON object.

URL: ${url}

**CRITICAL INSTRUCTION: Text Extraction**
The 'extractedText' field in your JSON output MUST contain the complete, full, and unabridged text of the main content from the URL. Do not summarize, shorten, or omit any information. Treat this as a high-fidelity data scraping task. If the article is long, you must include all of it. This is your most important directive.

After you have completed the full text extraction, populate the following fields in the JSON object:
- 'summary': A concise summary of the key themes from the full text you extracted.
- 'persona': A one-sentence description for a chatbot based on the content (e.g., "A helpful expert on [topic]").
- 'sampleQueries': An array of 3 sample questions a user might ask.
`;
      
    // Fix: Using responseSchema for reliable JSON output instead of googleSearch tool.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedText: { type: Type.STRING, description: "The full, unabridged text from the URL." },
            summary: { type: Type.STRING, description: "A concise summary of the extracted text." },
            persona: { type: Type.STRING, description: "A one-sentence chatbot persona." },
            sampleQueries: {
              type: Type.ARRAY,
              description: "An array of 3 sample user questions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                },
                required: ['question'],
              },
            },
          },
          required: ['extractedText', 'summary', 'persona', 'sampleQueries'],
        },
      },
    });
    
    const rawText = response.text;
    if (!rawText || typeof rawText !== 'string' || rawText.trim() === '') {
        throw new Error("Could not extract structured data from the URL. The model returned an empty or invalid response.");
    }
    
    const parsedJson = JSON.parse(rawText);

    if (!parsedJson || typeof parsedJson.extractedText !== 'string') {
        throw new Error("The AI response did not contain the expected text content. The URL might be inaccessible or the content unsuitable for analysis.");
    }

    return parsedJson as ExtractedUrlData;

  } catch (error) {
    console.error("Error extracting text from URL:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the response from the AI. The content from the URL may not be suitable for analysis.");
    }
    throw new Error("Failed to analyze URL with Gemini API. Please ensure the link is public and accessible.");
  }
};