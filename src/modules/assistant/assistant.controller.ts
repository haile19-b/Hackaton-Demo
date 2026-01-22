import { Request, Response } from "express";
import { assistantAgent } from "../../agents/graphs/assistantGraph";

export const assistantController = {
  async answerUserQuery(req: Request, res: Response) {
    const { query } = req.body;
    const { projectId } = req.params;
    const userId = (req as any).user?.userId;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query is required."
      });
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: "Project ID is required."
      });
    }

    const result = await assistantAgent.invoke({
      query,
      projectId,
      userId
    });

    if (!result.success) {
      return res.status(422).json(result);
    }

    return res.status(200).json({
      success: true,
      data: result.finalResponse
    });
  }
};
