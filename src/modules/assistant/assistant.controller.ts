import { Request, Response } from "express";
import { findInformationSource } from "../../agents/nodes/InformationRetrieve.ts/decideInformationSource";

export const assistantController = {
  async answerUserQuery(req: Request, res: Response) {
    const { query } = req.body;
    //const { projectId } = req.params;
    //const userId = (req as any).user?.userId;

    /* ---------------------------
       VALIDATION
    ---------------------------- */
    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query is required."
      });
    }

    // if (!projectId) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "Project ID is required."
    //   });
    // }

    try {
      const result = await findInformationSource(query);

      if (!result.success) {
        return res.status(422).json(result);
      }

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error: any) {
      console.error("Assistant query error:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to analyze the query."
      });
    }
  }
};
