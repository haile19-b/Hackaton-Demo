import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { chunkText } from "../nodes/informatinUpload/chunkText";
import { embedChunks } from "../nodes/informatinUpload/embedChunks";
import { storeChunks } from "../nodes/informatinUpload/storeChunks";

export const VectorStateAnnotation = Annotation.Root({
  text: Annotation<string>,
  projectId: Annotation<string>,
  chunks: Annotation<string[]>,
  embeddings: Annotation<number[][]>,
  success: Annotation<boolean>,
  error: Annotation<string>,
  chunksStored: Annotation<number>
});

export type VectorState = typeof VectorStateAnnotation.State;

const vectorWorkflow = new StateGraph(VectorStateAnnotation);

vectorWorkflow
  .addNode("chunkText", chunkText)
  .addNode("embedChunks", embedChunks)
  .addNode("storeChunks", storeChunks)
  .addEdge(START, "chunkText")
  .addEdge("chunkText", "embedChunks")
  .addEdge("embedChunks", "storeChunks")
  .addEdge("storeChunks", END);

export const textVectorAgent = vectorWorkflow.compile({});
