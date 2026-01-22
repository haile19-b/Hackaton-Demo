import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { embedGeneratedQuery } from "../nodes/InformationRetrieve.ts/embedQuery";
import { searchEmbeddedData } from "../nodes/InformationRetrieve.ts/vectorSearch";
import { cleanVectorSearchInfo } from "../nodes/InformationRetrieve.ts/cleanVectorSearchInfo";

export const AgentStateAnnotation = Annotation.Root({
  query: Annotation<string>,
  vector: Annotation<number[]>,
  searchResult: Annotation<any[]>,
  final_VectorSearch_Info: Annotation<string | null>,
  success: Annotation<boolean>,
  error: Annotation<string | null>
});

export type AgentState = typeof AgentStateAnnotation.State;

const workflow = new StateGraph(AgentStateAnnotation);

workflow
  .addNode("embedQuery", embedGeneratedQuery)
  .addNode("vectorSearch", searchEmbeddedData)
  .addNode("cleanVector", cleanVectorSearchInfo)
  .addEdge(START, "embedQuery")
  .addEdge("embedQuery", "vectorSearch")
  .addEdge("vectorSearch", "cleanVector")
  .addEdge("cleanVector", END);

export const subAssistantRAG_Agent = workflow.compile();
