import { Type } from "@google/genai";

export const getProjectDataFunctionDeclaration = {
  name: "getProjectData",
  description:
    "Retrieve structured project data stored in the database such as requirements, tech stack, tasks, conflicts, or missing information. Use this when the question directly refers to known project entities.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      projectId: {
        type: Type.STRING,
        description: "Project ID to retrieve data for"
      },

      models: {
        type: Type.ARRAY,
        description:
          "One or more data models to query from the database",
        items: {
          type: Type.STRING,
          enum: [
            "FunctionalRequirement",
            "NonFunctionalRequirement",
            "TechStack",
            "Conflict",
            "MissingInformation",
            "Task"
          ]
        }
      },

      origin: {
        type: Type.STRING,
        enum: ["USER", "AGENT"],
        description:
          "Optional. Only applies to Task. Defaults to USER if omitted."
      },

      resolved: {
        type: Type.BOOLEAN,
        description:
          "Optional. Only applies to Conflict. true = resolved, false = unresolved."
      }
    },
    required: ["projectId", "models"]
  }
};


export const answerQueryFromRAGFunctionDeclaration = {
  name: "answerQueryFromRAG",
  description:
    "Answer questions using semantic search over embedded project documents. Use this when the answer is not directly available in structured database fields.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      projectId: {
        type: Type.STRING,
        description: "Project ID to scope the vector search"
      },

      generated_query: {
        type: Type.STRING,
        description:
          "Rewritten sub-question that should be answered using embedded project content"
      }
    },
    required: ["projectId", "generated_query"]
  }
};
