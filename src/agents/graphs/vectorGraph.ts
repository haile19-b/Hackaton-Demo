import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { extractText } from "../nodes/informatinUpload/extractText";
import { chunkText } from "../nodes/informatinUpload/chunkText";
import { embedChunks } from "../nodes/informatinUpload/embedChunks";
import { storeChunks } from "../nodes/informatinUpload/storeChunks";


export const VectorStateAnnotation = Annotation.Root({
  file: Annotation<Express.Multer.File>,
  projectId: Annotation<string>,
  text: Annotation<string>,
  chunks: Annotation<string[]>,
  embeddings: Annotation<number[][]>,
  success: Annotation<boolean>,
  error: Annotation<string>,
});

export type VectorState = typeof VectorStateAnnotation.State;

const vectorWorkflow = new StateGraph(VectorStateAnnotation);

vectorWorkflow
  .addNode("extractText", extractText)
  .addNode("chunkText", chunkText)
  .addNode("embedChunks", embedChunks)
  .addNode("storeChunks", storeChunks)

  .addEdge(START, "extractText")
  .addEdge("extractText", "chunkText")
  .addEdge("chunkText", "embedChunks")
  .addEdge("embedChunks", "storeChunks")
  .addEdge("storeChunks", END);

export const vectorAgent = vectorWorkflow.compile({});
