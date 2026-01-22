import { genAI } from "../../../config/genAI";

export const summarizeResponse = async (state: any) => {
    const parts = [];
    const { query,generated_query } = state;

    if (state.final_DB_Info) parts.push(state.final_DB_Info);
    if (state.final_VectorSearch_Info) parts.push(state.final_VectorSearch_Info);

    // if (!parts.length) {
    //     return {
    //         success: false,
    //         error: "No information found to answer query."
    //     };
    // }

    const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Answer the user query using given data.
    You are generating a clean, frontend-ready answer.

STRICT RULES:
- Output ONLY plain text
- Do NOT use markdown
- Do NOT use headings, symbols, bullets, or numbering
- Do NOT use special characters like #, *, -, or :
- Separate sections using ONE empty line only
- Use short, clear sentences
- Do NOT invent information
- Use ONLY the data provided
- if given Data is empty , response gracefully that there is no data for the question 
    Question:
${query}

Data:
${parts.join("\n\n")}`
    });

    return {
        success: true,
        finalResponse: response.text
    };
};
