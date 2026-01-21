import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const chunkText = async (state: any) => {
  try {
    if (!state.text) {
      return { ...state, success: false, error: "No text to chunk" };
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 700,
      chunkOverlap: 60,
    });

    const chunks = await splitter.splitText(state.text);

    if (!chunks.length) {
      return { ...state, success: false, error: "Chunking produced no output" };
    }

    return { ...state, chunks };

  } catch (error: any) {
    return {
      ...state,
      success: false,
      error: error.message || "Text chunking failed"
    };
  }
};
