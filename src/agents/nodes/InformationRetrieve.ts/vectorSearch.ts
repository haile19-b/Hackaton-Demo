export const searchEmbeddedData = async (userInputVector: number[]) => {
    try {

        // Build the base pipeline
        const pipeline = [];

        // Vector search stage with optional title filtering
        const vectorSearchStage = {
            $vectorSearch: {
                index: "vector_index",
                path: "vector",
                queryVector: userInputVector,
                numCandidates: 100,
                limit: 20
            }
        };

        pipeline.push(vectorSearchStage);

        // Continue with existing pipeline stages
        pipeline.push(
            {
                $project: {
                    content: 1,
                    _id: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            },
            {
                $match: {
                    score: { $gte: 0.1 } //score: { $gte: 0.84 }
                }
            },
            {
                $limit: 5
            }
        );

        const results = await data.aggregate(pipeline).toArray();
        return results;

    } catch (error: any) {
        console.log(`Search failed: ${error.message}`);
        console.log("Full error:", error);
        return [];
    }
}