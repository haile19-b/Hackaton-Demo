import { Request, Response } from "express";
import { informationAgent } from "../../agents/graphs/informationGraph";
import { vectorAgent } from "../../agents/graphs/vectorGraph";
import { dataService } from "./data.service";

export const dataController = {
    async addTextData(req: Request, res: Response) {
        try {
            const { text, projectId } = req.body;
            if (!text) {
                return res.status(400).json({
                    success: false,
                    error: "No text provided."
                });
            }

            const userId = (req as any).user?.userId;

            // Your existing logic here
            // await fileService.processText(text, userId, projectId);

            return res.status(200).json({
                success: true,
                message: "Text processed successfully."
            });

        } catch (error: any) {
            return res.status(500).json({
                success: false,
                error: error.message || "Failed to process text."
            });
        }
    },

    async uploadFile(req: Request, res: Response) {
        try {
            const file = req.file;
            const userId = (req as any).user?.userId;
            const { projectId } = req.params;

            if (!file) {
                return res.status(400).json({
                    success: false,
                    error: "No file uploaded."
                });
            }

            const [infoResult, vectorResult] = await Promise.all([
                informationAgent.invoke({ file, userId, projectId }),
                vectorAgent.invoke({ file, projectId })
            ]);

            if (!infoResult.success) {
                return res.status(422).json({
                    success: false,
                    error: infoResult.error
                });
            }

            // Vector graph failure should NOT block summary
            if (!vectorResult.success) {
                console.warn("Vector pipeline failed:", vectorResult.error);
            }

            return res.status(200).json({
                success: true,
                data: infoResult.fileSummary,
                vectorized: vectorResult.success
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                error: "Internal server error."
            });
        }
    },

    async addMissingData(req: Request, res: Response) {
        const { missingdataId = null, text } = req.body;
        const  projectId  = req.params.projectId;

        if (!text || typeof text !== "string") {
            return res.status(400).json({
                success: false,
                error: "Text is required",
            });
        }

        if (!projectId) {
            return res.status(400).json({
                success: false,
                error: "Project ID is required",
            });
        }

        const result = await dataService.addMissingData(
            text,
            projectId,
            missingdataId
        );

        if (!result.success) {
            return res.status(422).json(result);
        }

        return res.status(200).json(result);
    },
};
