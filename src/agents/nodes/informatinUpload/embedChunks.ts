import { genAI } from "../../../config/genAI";

export const embedChunks = async (state: any) => {
  try {
    const chunks: string[] = state.chunks;
    if (!chunks || !chunks.length) {
      return { ...state, success: false, error: "No chunks to embed" };
    }

    const batchSize = 20;
    const vectors: number[][] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);

      const response = await genAI.models.embedContent({
        model: "gemini-embedding-001",
        contents: batch,
        config: { taskType: "RETRIEVAL_DOCUMENT" }
      });

      if (!response.embeddings?.length) {
        return { ...state, success: false, error: "Empty embeddings returned" };
      }

      vectors.push(
        ...response.embeddings.map(e => e.values).filter((v): v is number[] => Array.isArray(v))
      );
    }

    return { ...state, embeddings: vectors };

  } catch (error: any) {
    return {
      ...state,
      success: false,
      error: error.message || "Embedding failed"
    };
  }
};
