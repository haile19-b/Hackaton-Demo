import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { findInformationSource } from "../nodes/InformationRetrieve.ts/decideInformationSource";
import { summarizeResponse } from "../nodes/InformationRetrieve.ts/responseSummary";


export const AgentStateAnnotation = Annotation.Root({
    query: Annotation<string>,
    userId: Annotation<string>,
    projectId: Annotation<string>,

    // Decisions
    callDB: Annotation<boolean>,
    callRAG: Annotation<boolean>,

    // Results from branches
    dbResult: Annotation<string | null>,
    ragResult: Annotation<string | null>,

    // Final output
    finalResponse: Annotation<string>,
    success: Annotation<boolean>,
    error: Annotation<string | null>,
});

// Create a type for the state based on the annotation for use in your nodes
export type AgentState = typeof AgentStateAnnotation.State;

// 2. Create StateGraph using the Annotation
const workflow = new StateGraph(AgentStateAnnotation);

workflow
    .addNode("informationSource", findInformationSource)
    .addNode("summarizeResponse", summarizeResponse)
    .addEdge(START, "informationSource")
    .addEdge("informationSource", "summarizeResponse")
    .addEdge("summarizeResponse", END);

// 5. Compile graph to agent
export const assistantAgent = workflow.compile({});