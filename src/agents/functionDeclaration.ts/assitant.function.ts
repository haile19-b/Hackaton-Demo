import { Type } from "@google/genai";

export const getProjectDataFunctionDeclaration = {
  name: "getProjectData",
  description:
    "Retrieve project-related data such as functional requirements, non-functional requirements, tech stack, tasks, conflicts, or missing information.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      projectId: {
        type: Type.STRING,
        description: "Project ID to retrieve data for"
      },

      models: {
        type: Type.ARRAY,
        description: "Which models to retrieve data from",
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
          "Filter tasks by origin. Optional and only applies to Task."
      },

      resolved: {
        type: Type.BOOLEAN,
        description:
          "Filter conflicts by resolution status. Optional and only applies to Conflict."
      }
    },
    required: ["projectId", "models"]
  }
};
