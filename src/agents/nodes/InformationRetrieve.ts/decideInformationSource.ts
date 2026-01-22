import { genAI } from "../../../config/genAI";
import { answerQueryFromRAGFunctionDeclaration, getProjectDataFunctionDeclaration } from "../../functionDeclaration.ts/assitant.function";

export const findInformationSource = async (query:string) => {
    // const { query } = state;

    if (!query) {
        return {
            success: false,
            error: "Query is required to determine function calls."
        };
    }

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `based on this projectId:696bd09321be16a670187a02 user query,return the required data.here is the user query: ${query}`,
            config: {
                tools: [
                    {
                        functionDeclarations: [getProjectDataFunctionDeclaration,answerQueryFromRAGFunctionDeclaration]
                    }
                ]
            }
        });

        const functionCalls = response.functionCalls;

        if (!functionCalls || functionCalls.length === 0) {
            return {
                success: true,
                called: false
            };
        }

        // Only returning what Gemini decided to call
        const functions = functionCalls.map((fn, inx) => ({
            functionName: fn.name,
            args: fn.args 
        }));

        return {
            success: true,
            called: true,
            functions: functions
        };

    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to analyze function calls."
        };
    }
};
