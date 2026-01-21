import { prisma } from "../../config/prisma";
import { chunkText } from "../../utils/chunk.text";
import { getGeminiEmbedding } from "../../utils/embedChunk";

export const dataService = {


  async addMissingData(
    text: string,
    projectId: string,
    missingdataId?: string | null
  ) {
    try {
      const chunks = await chunkText(text);

      if (!chunks.length) {
        return {
          success: false,
          error: "Text could not be chunked",
        };
      }

      const embeddingsRes = await getGeminiEmbedding(chunks, true);

      if (!embeddingsRes.success) {
        return embeddingsRes;
      }

      const embeddings = embeddingsRes.data!;

      const records = chunks.map((chunk, i) => ({
        content: chunk,
        vector: embeddings[i],
        projectId,
      }));

      await prisma.chunk.createMany({
        data: records,
      });

      if (missingdataId) {
        await prisma.missingInformation.delete({
          where: { id: missingdataId },
        });
      }

      return {
        success: true,
        chunksStored: records.length,
      };
    } catch (error: any) {
      console.error("addMissingData error:", error);

      return {
        success: false,
        error: "Failed to add missing data",
      };
    }
  },

};
