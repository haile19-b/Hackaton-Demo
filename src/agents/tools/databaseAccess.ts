import { prisma } from "../../config/prisma";
import { TaskOrigin } from "../../generated/prisma/enums";

export const getProjectData = async (state: any) => {
  const { projectId, models, origin, resolved, emit } = state;

  if (!projectId || !Array.isArray(models) || models.length === 0) {
    emit?.("error", { message: "Invalid database request arguments." });
    return { success: false };
  }

  emit?.("progress", { stage: "db-query", message: "Querying database" });

  try {
    const result: Record<string, any[]> = {};

    for (const model of models) {
      switch (model) {
        case "FunctionalRequirement":
          result.FunctionalRequirement =
            await prisma.functionalRequirement.findMany({ where: { projectId } });
          break;

        case "NonFunctionalRequirement":
          result.NonFunctionalRequirement =
            await prisma.nonFunctionalRequirement.findMany({ where: { projectId } });
          break;

        case "TechStack":
          result.TechStack =
            await prisma.techStack.findMany({ where: { projectId } });
          break;

        case "Task":
          result.Task =
            await prisma.task.findMany({
              where: { projectId, ...(origin ? { origin: origin as TaskOrigin } : {}) }
            });
          break;

        case "Conflict":
          result.Conflict =
            await prisma.conflict.findMany({
              where: { projectId, ...(typeof resolved === "boolean" ? { resolved } : {}) }
            });
          break;

        case "MissingInformation":
          result.MissingInformation =
            await prisma.missingInformation.findMany({ where: { projectId } });
          break;
      }
    }

    return { success: true, dbResult: result };

  } catch (err) {
    console.error("getProjectData error:", err);
    emit?.("error", { message: "Database query failed." });
    return { success: false };
  }
};
