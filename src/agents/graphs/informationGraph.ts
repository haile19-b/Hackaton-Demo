import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { askAISummary } from "../nodes/informatinUpload/summarizeFile";
import { saveInformation } from "../nodes/informatinUpload/saveFileData";


export const AgentStateAnnotation = Annotation.Root({
  file: Annotation<Express.Multer.File>,
  userId: Annotation<string>,
  projectId: Annotation<string>,
  success: Annotation<boolean>,
  error: Annotation<string>,
  fileSummary: Annotation<any>,
});

// Create a type for the state based on the annotation for use in your nodes
export type AgentState = typeof AgentStateAnnotation.State;

// 2. Create StateGraph using the Annotation
const workflow = new StateGraph(AgentStateAnnotation);

workflow
  .addNode("summarizeFile", askAISummary)
  .addNode("saveInformation", saveInformation)
  .addEdge(START, "summarizeFile")
  .addEdge("summarizeFile", "saveInformation")
  .addEdge("saveInformation", END);

// 5. Compile graph to agent
export const informationAgent = workflow.compile({});