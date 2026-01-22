import zodToJsonSchema from "zod-to-json-schema";
import { genAI } from "../../../config/genAI";
import { projectDocumentationSchema } from "../../zodSchema/documentSchema";

export const askAIForTextDataSummary = async (state: any) => {
  if (!state.success) return state;

  if (!state.text) {
    return {
      ...state,
      success: false,
      error: "Invalid text input",
      fileSummary: null
    };
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ text: state.text }],
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(projectDocumentationSchema)
      }
    });

    if (!response.text) {
      return { ...state, success: false, error: "Empty AI response" };
    }

    return {
      ...state,
      success: true,
      fileSummary: JSON.parse(response.text)
    };

  } catch {
    return {
      ...state,
      success: false,
      error: "AI analysis failed"
    };
  }
};
