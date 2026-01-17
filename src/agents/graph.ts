// import { StateGraph, Annotation, START, END } from "@langchain/langgraph";


// export const AgentStateAnnotation = Annotation.Root({
//   userInput: Annotation<string>,
//   deviceName: Annotation<string>,
//   deviceFound: Annotation<boolean>,
//   deviceTitle: Annotation<string>,
//   guidesFound: Annotation<boolean>,
//   guides: Annotation<any[]>,
//   selectedGuideId: Annotation<number>,
//   guideDetails: Annotation<any>,
//   finalResponse: Annotation<string>,
//   webSearch: Annotation<boolean>,
//   webResult: Annotation<object>,
//   cleaned: Annotation<boolean>,
//   cleanedData: Annotation<object>,
//   finalData: Annotation<object>,
//   finalSummary: Annotation<object>,
// });

// // Create a type for the state based on the annotation for use in your nodes
// export type AgentState = typeof AgentStateAnnotation.State;

// // 2. Create StateGraph using the Annotation
// const workflow = new StateGraph(AgentStateAnnotation);

// workflow
//   .addNode("findDeviceName", getDeviceName)
//   .addNode("deviceSearch", deviceSearchNode)
//   .addNode("guideList", guideListNode)
//   .addNode("getRelevantGuide", getRelevantGuide)
//   .addNode("fetchGuideDetails", guideDetailsNode)
//   .addNode("fallbackSearch", fallbackSearchNode)
//   .addNode("cleaniFixitData", clean_iFixit_Data)
//   .addNode("cleanWebsiteData", clean_tavily_data)
//   .addNode("summarizesIFixitTheData", summarize)
//   .addNode("summarizeWebsearchData", summarizeWebsearchData)
//   .addNode("FinalNode", Final)

// // 4. Define graph order
// .addEdge(START, "findDeviceName")

// .addEdge("findDeviceName", "deviceSearch")

// .addConditionalEdges("deviceSearch", (state) => {
//   if (state.deviceFound === false) {
//     return "fallbackSearch";
//   }
//   return "guideList";
// })
//   .addConditionalEdges("guideList", (state) => {
//     if (state.guidesFound === false) {
//       return "fallbackSearch";
//     }
//     return "getRelevantGuide";
//   })
//   .addConditionalEdges("getRelevantGuide", (state) => {
//     if (state.selectedGuideId == null) {
//       return "fallbackSearch";
//     }
//     return "fetchGuideDetails";
//   })
//   .addEdge("fetchGuideDetails", "cleaniFixitData")
//   .addEdge("cleaniFixitData", "summarizesIFixitTheData")
//   .addEdge("fallbackSearch", "cleanWebsiteData")
//   .addEdge("cleanWebsiteData", "summarizeWebsearchData")
//   .addEdge("summarizeWebsearchData", "FinalNode")
//   .addEdge("summarizesIFixitTheData", "FinalNode")
//   .addEdge("FinalNode", END); // Standard finish point

// // 5. Compile graph to agent
// export const agent = workflow.compile({
//   checkpointer: checkPointer,
// });
