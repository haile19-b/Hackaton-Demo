import { embedded } from "../../../config/mongoDB";

export const searchEmbeddedData = async (state: any) => {
  const { vector } = state;

  if (!vector || !Array.isArray(vector)) {
    return {
      ...state,
      success: false,
      error: "Missing or invalid query vector."
    };
  }

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

    console.log(results)

    return {
      ...state,
      success: true,
      searchResult: results
    };

  } catch (error: any) {
    console.error("Vector search failed:", error);

    return {
      ...state,
      success: false,
      error: "Vector search failed."
    };
  }
};
