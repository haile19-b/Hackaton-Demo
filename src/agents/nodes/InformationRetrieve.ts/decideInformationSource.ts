import { genAI } from "../../../config/genAI";
import {
  getProjectDataFunctionDeclaration,
  answerQueryFromRAGFunctionDeclaration
} from "../../functionDeclaration.ts/assitant.function";
import { subAssistantDatabaseAgent } from "../../graphs/subAssistantDatabaseGraph";
import { subAssistantRAG_Agent } from "../../graphs/subAssistantRagGraph";

export const findInformationSource = async (state: any) => {
  const { query, projectId, userId } = state;

  if (!query) {
    return { success: false, error: "Query is required." };
  }

  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this query and decide tools: ${query}`,
    config: {
      tools: [
        {
          functionDeclarations: [
            getProjectDataFunctionDeclaration,
            answerQueryFromRAGFunctionDeclaration
          ]
        }
      ]
    }
  });

  const calls = response.functionCalls ?? [];

  let dbInfo: string | null = null;
  let ragInfo: string | null = null;

  for (const call of calls) {
    if (call.name === "getProjectData") {
      const result = await subAssistantDatabaseAgent.invoke({
        ...call.args,
        projectId,
        userId
      });
      if (result.success) dbInfo = result.final_DB_Info;
    }

    if (call.name === "answerQueryFromRAG") {
      const result = await subAssistantRAG_Agent.invoke({
        query,
        projectId
      });
      if (result.success) ragInfo = result.final_VectorSearch_Info;
    }
  }

  return {
    success: true,
    callDB: !!dbInfo,
    callRAG: !!ragInfo,
    final_DB_Info: dbInfo,
    final_VectorSearch_Info: ragInfo
  };
};
