import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { findInformationSource } from "../nodes/InformationRetrieve.ts/decideInformationSource";
import { summarizeResponse } from "../nodes/InformationRetrieve.ts/responseSummary";
import { SSEEmit } from "../../utils/sse";

export const AgentStateAnnotation = Annotation.Root({
  query: Annotation<string>,
  userId: Annotation<string>,
  projectId: Annotation<string>,

  callDB: Annotation<boolean>,
  callRAG: Annotation<boolean>,

  final_DB_Info: Annotation<string | null>,
  final_VectorSearch_Info: Annotation<string | null>,

  finalResponse: Annotation<string>,
  success: Annotation<boolean>,
  error: Annotation<string | null>,

  emit: Annotation<SSEEmit | undefined>,
});

export type AgentState = typeof AgentStateAnnotation.State;

const workflow = new StateGraph(AgentStateAnnotation);

workflow
  .addNode("decideSource", findInformationSource)
  .addNode("summarize", summarizeResponse)
  .addEdge(START, "decideSource")
  .addEdge("decideSource", "summarize")
  .addEdge("summarize", END);

export const assistantAgent = workflow.compile();
