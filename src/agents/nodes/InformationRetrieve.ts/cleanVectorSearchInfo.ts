export const cleanVectorSearchInfo = async (state: any) => {
  if (!state.searchResult?.length) {
    return { success: false, error: "No vector search data." };
  }

  return {
    success: true,
    final_VectorSearch_Info: state.searchResult.join("\n")
  };
};
