import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'
import { API_KEY_GEMINI } from '../config/envs';

export let gemini: GenerativeModel

export const initGemini = () => {
  const genAI = new GoogleGenerativeAI(API_KEY_GEMINI as string);
  gemini = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.3,
      topP: 0.7,
      maxOutputTokens: 100
    }
  });
}
