import { genAI } from "../../../config/genAI";

export const summarizeResponse = async (state: any) => {
    const { emit } = state;

    try {
        const parts: string[] = [];
        const { query } = state;

        if (state.final_DB_Info) parts.push(state.final_DB_Info);
        if (state.final_VectorSearch_Info) parts.push(state.final_VectorSearch_Info);

        emit?.("progress", {
            stage: "summarize",
            message: "Generating final answer"
        });

        const response = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `
Answer the user's question using ONLY the provided data.

Rules:
- Plain text only
- No formatting, lists, or symbols
- Clear and concise sentences
- Do not add or guess information
- Give Clear explanation

Question:
${query}

Data:
${parts.join("\n\n")}
      `
        });

        return {
            success: true,
            finalResponse: response.text
        };

    } catch (err) {
        emit?.("error", {
            message: "Failed to generate final response",err
        });

        return {
            success: false,
            error: "LLM summarization failed"
        };
    }
};
