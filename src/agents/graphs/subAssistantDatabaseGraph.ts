import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { getProjectData } from "../tools/databaseAccess";
import { cleanDatabaseInfo } from "../nodes/InformationRetrieve.ts/cleanDatabaseInfo";


export const AgentStateAnnotation = Annotation.Root({
query: Annotation<string>,
userId: Annotation<string>,
projectId: Annotation<string>,

function: Annotation<object>,
dbResult: Annotation<object>,
final_DB_Info: Annotation<string | null>,
success: Annotation<boolean>,
error: Annotation<string | null>,
});

// Create a type for the state based on the annotation for use in your nodes
export type AgentState = typeof AgentStateAnnotation.State;

// 2. Create StateGraph using the Annotation
const workflow = new StateGraph(AgentStateAnnotation);

workflow
.addNode("extractDataFromDatabase", getProjectData)
.addNode("cleanDatabaseData", cleanDatabaseInfo)
.addEdge(START, "extractDataFromDatabase")
.addEdge("extractDataFromDatabase", "cleanDatabaseData")
.addEdge("cleanDatabaseData", END);

// 5. Compile graph to agent
export const subAssistantDatabaseAgent = workflow.compile({});