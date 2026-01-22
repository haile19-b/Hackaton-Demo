import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { embedGeneratedQuery } from "../nodes/InformationRetrieve.ts/embedQuery";
import { searchEmbeddedData } from "../nodes/InformationRetrieve.ts/vectorSearch";
import { cleanVectorSearchInfo } from "../nodes/InformationRetrieve.ts/cleanVectorSearchInfo";


export const AgentStateAnnotation = Annotation.Root({
query: Annotation<string>,
userId: Annotation<string>,
projectId: Annotation<string>,

function: Annotation<object>,
dbResult: Annotation<object>,
final_VectorSearch_Info: Annotation<string | null>,
success: Annotation<boolean>,
error: Annotation<string | null>,
});

// Create a type for the state based on the annotation for use in your nodes
export type AgentState = typeof AgentStateAnnotation.State;

// 2. Create StateGraph using the Annotation
const workflow = new StateGraph(AgentStateAnnotation);

workflow
.addNode("embedGeneratedQuery", embedGeneratedQuery)
.addNode("vectorSearch", searchEmbeddedData)
.addNode("cleanData", cleanVectorSearchInfo)
.addEdge(START, "embedGeneratedQuery")
.addEdge("embedGeneratedQuery", "vectorSearch")
.addEdge("vectorSearch", "cleanData")
.addEdge("cleanData", END);

// 5. Compile graph to agent
export const subAssistantDatabaseAgent = workflow.compile({});