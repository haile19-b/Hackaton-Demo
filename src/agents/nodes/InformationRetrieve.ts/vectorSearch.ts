import { embedded } from "../../../config/mongoDB";

export const searchEmbeddedData = async (state: any) => {
  const { vector, emit } = state;

  if (!vector || !Array.isArray(vector)) {
    emit?.("error", {
      error: "Missing or invalid query vector"
    });

    return {
      success: false,
      error: "Missing or invalid query vector."
    };
  }

  emit?.("progress", {
    message: "Performing vector search"
  });

  try {
    const pipeline: any[] = [];

    pipeline.push({
      $vectorSearch: {
        index: "vector_index",
        path: "vector",
        queryVector: vector,
        numCandidates: 100,
        limit: 20
      }
    });

    pipeline.push(
      {
        $project: {
          content: 1,
          score: { $meta: "vectorSearchScore" }
        }
      },
      {
        $match: {
          score: { $gte: 0.8 }
        }
      },
      {
        $limit: 5
      }
    );

    const results = await embedded.aggregate(pipeline).toArray();

    emit?.("progress", {
      message:"vector search completed",
      resultsCount: results.length
    });

    return {
      success: true,
      searchResult: results
    };

  } catch (error: any) {
    emit?.("error", {
      error: "Vector search failed"
    });

    return {
      success: false,
      error: "Vector search failed."
    };
  }
};
