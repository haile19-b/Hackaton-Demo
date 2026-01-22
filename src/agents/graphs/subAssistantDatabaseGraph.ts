import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { getProjectData } from "../tools/databaseAccess";
import { cleanDatabaseInfo } from "../nodes/InformationRetrieve.ts/cleanDatabaseInfo";
import { SSEEmit } from "../../utils/sse";

export const AgentStateAnnotation = Annotation.Root({
  projectId: Annotation<string>,
  models: Annotation<string[]>,
  dbResult: Annotation<any>,
  final_DB_Info: Annotation<string | null>,
  success: Annotation<boolean>,
  error: Annotation<string | null>,

  emit: Annotation<SSEEmit | undefined>,

});

export type AgentState = typeof AgentStateAnnotation.State;

const workflow = new StateGraph(AgentStateAnnotation);

workflow
  .addNode("fetchDB", getProjectData)
  .addNode("cleanDB", cleanDatabaseInfo)
  .addEdge(START, "fetchDB")
  .addEdge("fetchDB", "cleanDB")
  .addEdge("cleanDB", END);

export const subAssistantDatabaseAgent = workflow.compile();
