import { prisma } from "../../../config/prisma";

export const storeChunks = async (state: any) => {
    try {
        const { chunks, embeddings, projectId, file } = state;

        if (!chunks || !embeddings || chunks.length !== embeddings.length) {
            return {
                ...state,
                success: false,
                error: "Chunk/embedding mismatch"
            };
        }

        await prisma.chunk.createMany({
            data: chunks.map((content: string, i: number) => ({
                content,
                vector: embeddings[i],
                source: file.originalname,
                projectId,
            }))
        });

        return {
            ...state,
            success: true,
            chunksStored: chunks.length
        };

    } catch (error: any) {
        return {
            ...state,
            success: false,
            error: error.message || "Failed to store embeddings"
        };
    }
};
