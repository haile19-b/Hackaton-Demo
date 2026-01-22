import { genAI } from "../../../config/genAI";

export const embedGeneratedQuery = async (state: any) => {
  const { emit } = state;

  emit?.("progress", {
    message: "Generating embedding for query"
  });

  try {
    if (!state?.query) {
      emit?.("error", {
        error: "Query missing"
      });

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
      emit?.("error", {
        error: "Embedding failed"
      });

      return {
        success: false,
        error: "Embedding failed."
      };
    }

    emit?.("progress", {
      message:"query embedded successfully",
      vectorLength: response.embeddings[0].values.length
    });

    return {
      success: true,
      vector: response.embeddings[0].values
    };

  } catch (error: any) {
    emit?.("error", {
      error: error?.message || "Unexpected embedding error"
    });

    return {
      success: false,
      error: error?.message || "Unexpected embedding error."
    };
  }
};
