export const cleanVectorSearchInfo = async (state: any) => {
  const { searchResult, emit } = state;

  if (!Array.isArray(searchResult) || searchResult.length === 0) {
    emit?.("error", {
      error: "No vector search results to clean"
    });

    return {
      success: false,
      error: "No vector search results to clean."
    };
  }

  emit?.("progress", {
    message: "Cleaning vector search results"
  });

  try {
    const cleanedText = searchResult
      .map((item: any, index: number) => {
        return `Result ${index + 1}:\n${item.content}`;
      })
      .join("\n\n");

    emit?.("progress", {
      message:"Data cleaned successfully",
      textLength: cleanedText.length
    });

    return {
      success: true,
      final_VectorSearch_Info: cleanedText
    };

  } catch (error: any) {
    emit?.("error", {
      error: "Failed to clean vector search information"
    });

    return {
      success: false,
      error: "Failed to clean vector search information."
    };
  }
};
