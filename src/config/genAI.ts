import {GoogleGenAI} from '@google/genai'
import { env } from '../env';

const apiKey = env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

export const genAI = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY!});

export const genAI_Two = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY_TWO!});