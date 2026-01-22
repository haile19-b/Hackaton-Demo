import { Request, Response } from "express";
import { informationAgent } from "../../agents/graphs/informationGraph";
import { vectorAgent } from "../../agents/graphs/vectorGraph";
import { dataService } from "./data.service";
import { textInformationAgent } from "../../agents/graphs/textInfoGraph";
import { textVectorAgent } from "../../agents/graphs/textVectorGraph";

export const dataController = {
    async addTextData(req: Request, res: Response) {
        const { text } = req.body;
        const { projectId } = req.params;
        const userId = (req as any).user?.userId;

        if (!text) {
            return res.status(400).json({
                success: false,
                error: "No text provided."
            });
        }

        if (!projectId) {
            return res.status(400).json({
                success: false,
                error: "Missing projectId."
            });
        }

        try {
            const [infoResult, vectorResult] = await Promise.all([
                textInformationAgent.invoke({
                    text,
                    userId,
                    projectId,
                    success: true
                }),
                textVectorAgent.invoke({
                    text,
                    projectId,
                    success: true
                })
            ]);

            if (!infoResult.success) {
                return res.status(422).json(infoResult.error);
            }

            if (!vectorResult.success) {
                return res.status(422).json(vectorResult);
            }

            return res.status(200).json({
                success: true,
                message: "Text processed successfully",
                info: infoResult.fileSummary,
                chunksStored: vectorResult.chunksStored
            });

        } catch {
            return res.status(500).json({
                success: false,
                error: "Unexpected server error"
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
        const projectId = req.params.projectId;

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
