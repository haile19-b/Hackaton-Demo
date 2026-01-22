import { genAI } from "../../../config/genAI";
import {
  getProjectDataFunctionDeclaration,
  answerQueryFromRAGFunctionDeclaration
} from "../../functionDeclaration.ts/assitant.function";
import { subAssistantDatabaseAgent } from "../../graphs/subAssistantDatabaseGraph";
import { subAssistantRAG_Agent } from "../../graphs/subAssistantRagGraph";

export const findInformationSource = async (state: any) => {
  const { query, projectId, userId, emit } = state;

  if (!query) {
    emit?.("error", { message: "Query is missing." });
    return { success: false };
  }

  emit?.("progress", { stage: "analysis", message: "Analyzing user query" });

  let response;
  try {
    response = await genAI.models.generateContent({
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
  } catch (err) {
    emit?.("error", { message: "Failed to analyze query intent.",err });
    return { success: false };
  }

  const calls = response.functionCalls ?? [];

  let dbInfo: string | null = null;
  let ragInfo: string | null = null;

  for (const call of calls) {
    if (call.name === "getProjectData") {
      emit?.("progress", { stage: "db", message: "Fetching structured data" });

      const result = await subAssistantDatabaseAgent.invoke({
        ...call.args,
        projectId,
        userId,
        emit
      });

      if (result?.success) dbInfo = result.final_DB_Info;
    }

    if (call.name === "answerQueryFromRAG") {
      emit?.("progress", { stage: "rag", message: "Searching project documents" });

      const result = await subAssistantRAG_Agent.invoke({
        query,
        generated_query: call.args?.generated_query,
        projectId,
        emit
      });

      if (result?.success) ragInfo = result.final_VectorSearch_Info;
    }
  }

  if (!dbInfo && !ragInfo) {
    emit?.("progress", {
      stage: "analysis",
      message: "No relevant data sources found"
    });
  }

  return {
    success: true,
    callDB: !!dbInfo,
    callRAG: !!ragInfo,
    final_DB_Info: dbInfo,
    final_VectorSearch_Info: ragInfo
  };
};
