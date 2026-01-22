import { prisma } from "../../../config/prisma";
import { ConflictSeverity, TaskOrigin } from "../../../generated/prisma/enums";

export const saveInformation = async (state: any) => {
  if (!state.success || !state.fileSummary) {
    return state;
  }

  const { projectId } = state;
  const summary = state.fileSummary;

  try {
    await prisma.$transaction(async (tx) => {

      /* -------------------------------
         FUNCTIONAL REQUIREMENTS
      -------------------------------- */
      if (summary.functionalRequirements?.length) {
        await tx.functionalRequirement.createMany({
          data: summary.functionalRequirements.map((fr: any) => ({
            code: fr.id,
            description: fr.description,
            projectId
          }))
        });
      }

      /* -------------------------------
         NON-FUNCTIONAL REQUIREMENTS
      -------------------------------- */
      if (summary.non_functionalRequirements?.length) {
        await tx.nonFunctionalRequirement.createMany({
          data: summary.non_functionalRequirements.map((nfr: any) => ({
            code: nfr.id,
            description: nfr.description,
            projectId
          }))
        });
      }

      /* -------------------------------
         TECH STACK
      -------------------------------- */
      if (summary.techStack?.length) {
        await tx.techStack.createMany({
          data: summary.techStack.map((ts: any) => ({
            category: ts.category,
            stack: ts.stack,
            projectId
          }))
        });
      }

      /* -------------------------------
         TASKS (AGENT GENERATED)
      -------------------------------- */
      if (summary.recommendedTasks?.length) {
        await tx.task.createMany({
          data: summary.recommendedTasks.map((task: any) => ({
            title: task.title,
            description: task.description,
            origin: TaskOrigin.AGENT,
            projectId
          }))
        });
      }

      /* -------------------------------
         CONFLICTS
      -------------------------------- */
      if (summary.conflicts?.length) {
        await tx.conflict.createMany({
          data: summary.conflicts.map((conflict: any) => ({
            description: conflict.description,
            severity: conflict.severity as ConflictSeverity,
            projectId
          }))
        });
      }

      /* -------------------------------
         MISSING INFORMATION
      -------------------------------- */
      if (summary.missingInformation?.length) {
        await tx.missingInformation.createMany({
          data: summary.missingInformation.map((item: string) => ({
            description: item,
            projectId
          }))
        });
      }

      /* -------------------------------
         PROJECT PROGRESS UPDATE
      -------------------------------- */
    //   await tx.project.update({
    //     where: { id: projectId },
    //     data: {
    //       progress: 0.25, // example: AI extraction completed
    //     }
    //   });
    });

    return {
      ...state,
      saved: true
    };

  } catch (error: any) {
    console.error("DB save error:", error);

    return {
      ...state,
      success: false,
      error: "Failed to persist extracted information."
    };
  }
};
