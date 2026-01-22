import { genAI } from "../../../config/genAI";

export const embedGeneratedQuery = async (state: any) => {
  console.log("1: ",state)
  try {
    if (!state?.query) {
      return {
        success: false,
        error: "Query missing."
      };
    }

    const response = await genAI.models.embedContent({
      model: "gemini-embedding-001",
      contents: [state.generated_query || state.query],
      config: { taskType: "RETRIEVAL_QUERY" }
    });

    if (!response?.embeddings?.[0]?.values) {
      return {
        success: false,
        error: "Embedding failed."
      };
    }

    return {
      success: true,
      vector: response.embeddings[0].values
    };
  } catch (error: any) {
    console.error("embedGeneratedQuery error:", error);

    return {
      success: false,
      error: error?.message || "Unexpected embedding error."
    };
  }
};
