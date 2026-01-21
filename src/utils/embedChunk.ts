import { genAI } from "../config/genAI";

export async function getGeminiEmbedding(
  chunks: string[],
  isAddingData = false,
  batchSize = 20
): Promise<{ success: boolean; data?: number[][]; error?: string }> {
  try {
    const vectors: number[][] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);

      const response = await genAI.models.embedContent({
        model: "gemini-embedding-001",
        contents: batch,
        config: {
          taskType: isAddingData
            ? "RETRIEVAL_DOCUMENT"
            : "RETRIEVAL_QUERY",
        },
      });

      if (!response.embeddings?.length) {
        return {
          success: false,
          error: "Gemini returned empty embeddings",
        };
      }

      const batchVectors = response.embeddings
        .map(e => e.values)
        .filter((v): v is number[] => Array.isArray(v));

      vectors.push(...batchVectors);
    }

    return {
      success: true,
      data: vectors,
    };
  } catch (error: any) {
    console.error("Gemini embedding error:", error);

    return {
      success: false,
      error: "Failed to generate embeddings",
    };
  }
}
