import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { askAIForTextDataSummary } from "../nodes/informatinUpload/summarizeTextData";
import { saveInformation } from "../nodes/informatinUpload/saveFileData";

export const AgentStateAnnotation = Annotation.Root({
  text: Annotation<string>,
  userId: Annotation<string>,
  projectId: Annotation<string>,
  success: Annotation<boolean>,
  error: Annotation<string>,
  fileSummary: Annotation<any>
});

export type AgentState = typeof AgentStateAnnotation.State;

const workflow = new StateGraph(AgentStateAnnotation);

workflow
  .addNode("summarizeText", askAIForTextDataSummary)
  .addNode("saveInformation", saveInformation)
  .addEdge(START, "summarizeText")
  .addEdge("summarizeText", "saveInformation")
  .addEdge("saveInformation", END);

export const textInformationAgent = workflow.compile({});
