
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CabType } from '../types';

// Ensure API_KEY is accessed directly from process.env
// The build system or environment should make this available.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please set the process.env.API_KEY environment variable.");
  // In a real app, you might want to throw an error or disable AI features.
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Fallback to prevent crash if not set, but will fail API calls

export const generateDriverGreeting = async (driverName: string, cabName: string, destination: string): Promise<string> => {
  if (!API_KEY) {
    return `Hello! This is ${driverName} with your ${cabName}. I'm on my way to pick you up for your trip to ${destination}. See you soon! (AI Greeting Disabled: API Key Missing)`;
  }
  try {
    const prompt = `Generate a short, friendly, and professional greeting for a cab driver named ${driverName}.
    The driver is operating a ${cabName}.
    The passenger is going to ${destination}.
    The greeting should confirm the pickup and mention they are on their way.
    Keep it under 30 words. Example: "Hi there! This is ${driverName} with your ${cabName}. I'm heading to pick you up for your trip to ${destination}. See you in a few!"`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
    });

    return response.text || `Hello from ${driverName}, I'm on my way in your ${cabName} to ${destination}!`;
  } catch (error) {
    console.error("Error generating driver greeting with Gemini:", error);
    return `Hello, this is ${driverName}. I'm en route to pick you up in your ${cabName} for your trip to ${destination}. (AI greeting generation failed)`;
  }
};

export const generateCabDescription = async (cabName: string, cabType: CabType): Promise<string> => {
  if (!API_KEY) {
    return `A reliable ${cabType} option, the ${cabName} is ready for your journey. (AI Description Disabled: API Key Missing)`;
  }
  try {
    const prompt = `Generate a concise, appealing, and slightly creative marketing description for a cab type named "${cabName}" which is a ${cabType}.
    Highlight one key benefit (e.g., comfort, space, style, group travel).
    Keep it under 25 words. Example: "Experience unparalleled comfort in the ${cabName}, your premium ${cabType} for a smooth ride."`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
    });
    return response.text || `The ${cabName} (${cabType}) is a great choice for your travel needs.`;
  } catch (error) {
    console.error("Error generating cab description with Gemini:", error);
    return `The ${cabName} (${cabType}) offers a dependable ride. (AI description generation failed)`;
  }
};
