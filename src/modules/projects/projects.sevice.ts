import { prisma } from "../../config/prisma";

export const ProjectsService = {
  async createProject(userId: string, data: { title: string; description?: string }) {
    return prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        userId
      }
    });
  },

  async getUserProjects(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  },

  async getProjectById(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      },
      include: {
        tasks: true,
        documents: true
      }
    });

    if (!project) {
      throw new Error("Project not found or access denied");
    }

    return project;
  },

  async updateProject(
    projectId: string,
    userId: string,
    data: { title?: string; description?: string; status?: "ACTIVE" | "COMPLETED" }
  ) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      throw new Error("Project not found or access denied");
    }

    return prisma.project.update({
      where: { id: projectId },
      data
    });
  },

  async deleteProject(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId
    }
  });

  if (!project) {
    throw new Error("Project not found or access denied");
  }

  /**
   * IMPORTANT:
   * MongoDB + Prisma does NOT automatically cascade deletes.
   * We must delete children manually to avoid orphaned data.
   */

  await prisma.$transaction([
    prisma.task.deleteMany({ where: { projectId } }),
    prisma.chunk.deleteMany({ where: { projectId } }),
    prisma.document.deleteMany({ where: { projectId } }),
    prisma.project.delete({ where: { id: projectId } })
  ]);

  return { success: true };
}

};
