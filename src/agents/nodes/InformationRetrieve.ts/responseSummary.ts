import { genAI } from "../../../config/genAI";

export const summarizeResponse = async (state: any) => {
  const parts = [];

  if (state.final_DB_Info) parts.push(state.final_DB_Info);
  if (state.final_VectorSearch_Info) parts.push(state.final_VectorSearch_Info);

  if (!parts.length) {
    return {
      success: false,
      error: "No information found to answer query."
    };
  }

  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Answer the user query using this data:\n${parts.join("\n\n")}`
  });

  return {
    success: true,
    finalResponse: response.text
  };
};
