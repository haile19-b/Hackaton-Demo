import type { Request, Response } from "express";
import { CreateProjectSchema, UpdateProjectSchema } from "./projects.schema";
import { ProjectsService } from "./projects.sevice";

export const ProjectsController = {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const data = CreateProjectSchema.parse(req.body);
      console.log(data)

      const project = await ProjectsService.createProject(userId, data);

      res.status(201).json({
        success: true,
        data: project
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const projects = await ProjectsService.getUserProjects(userId);

      res.json({
        success: true,
        data: projects
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const userId = (req as any).id;
      const { projectId } = req.params;

      const project = await ProjectsService.getProjectById(projectId, userId);

      res.json({
        success: true,
        data: project
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).id;
      const { projectId } = req.params;
      const data = UpdateProjectSchema.parse(req.body);

      const project = await ProjectsService.updateProject(projectId, userId, data);

      res.json({
        success: true,
        data: project
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  async remove(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { projectId } = req.params;

    await ProjectsService.deleteProject(projectId, userId);

    res.json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
}

};
