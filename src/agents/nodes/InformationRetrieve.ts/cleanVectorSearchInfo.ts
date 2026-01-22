export const cleanVectorSearchInfo = async (state: any) => {
  const { searchResult } = state;

  if (!Array.isArray(searchResult) || searchResult.length === 0) {
    return {
      ...state,
      success: false,
      error: "No vector search results to clean."
    };
  }

  try {
    const cleanedText = searchResult
      .map((item: any, index: number) => {
        return `Result ${index + 1}:\n${item.content}`;
      })
      .join("\n\n");

    return {
      ...state,
      success: true,
      final_VectorSearch_Info: cleanedText
    };

  } catch (error: any) {
    console.error("Clean vector search error:", error);

    return {
      ...state,
      success: false,
      error: "Failed to clean vector search information."
    };
  }
};