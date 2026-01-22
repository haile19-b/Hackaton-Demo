import { prisma } from "../../config/prisma";
import { TaskOrigin } from "../../generated/prisma/enums";

export const getProjectData = async (state: any) => {
  const { projectId, models, origin, resolved } = state;

  if (!projectId || !Array.isArray(models) || models.length === 0) {
    return {
      success: false,
      error: "Invalid database request arguments."
    };
  }

  try {
    const result: Record<string, any[]> = {};

    for (const model of models) {
      switch (model) {
        case "FunctionalRequirement":
          result.FunctionalRequirement =
            await prisma.functionalRequirement.findMany({
              where: { projectId }
            });
          break;

        case "NonFunctionalRequirement":
          result.NonFunctionalRequirement =
            await prisma.nonFunctionalRequirement.findMany({
              where: { projectId }
            });
          break;

        case "TechStack":
          result.TechStack =
            await prisma.techStack.findMany({
              where: { projectId }
            });
          break;

        case "Task":
          result.Task =
            await prisma.task.findMany({
              where: {
                projectId,
                ...(origin ? { origin: origin as TaskOrigin } : {})
              }
            });
          break;

        case "Conflict":
          result.Conflict =
            await prisma.conflict.findMany({
              where: {
                projectId,
                ...(typeof resolved === "boolean" ? { resolved } : {})
              }
            });
          break;

        case "MissingInformation":
          result.MissingInformation =
            await prisma.missingInformation.findMany({
              where: { projectId }
            });
          break;

        default:
          // Ignore unknown model safely
          break;
      }
    }

    return {
      success: true,
      dbResult: result
    };

  } catch (error: any) {
    console.error("getProjectData error:", error);

    return {
      success: false,
      error: "Failed to retrieve project data from database."
    };
  }
};