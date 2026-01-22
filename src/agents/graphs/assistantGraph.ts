import { StateGraph, Annotation, START, END } from "@langchain/langgraph";


export const AgentStateAnnotation = Annotation.Root({
  query: Annotation<string>,
  userId: Annotation<string>,
  projectId: Annotation<string>,
  success: Annotation<boolean>,
  error: Annotation<string>,
  finalResponse: Annotation<string>,
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
export const assistantAgent = workflow.compile({});