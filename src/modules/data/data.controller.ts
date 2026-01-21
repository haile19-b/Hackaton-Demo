import { Request, Response } from "express";
import { fileService } from "./data.service";
import { informationAgent } from "../../agents/graphs/informationGraph";
export const dataController = {
    async addTextData(req: Request, res: Response) {
        try {
            const { text, projectId } = req.body;
            if (!text) {
                return res.status(400).json({ success: false, error: "NO text given!" })
            }
            const userId = (req as any).user.userId
            const result = await fileService.processText(text, userId, projectId)
        } catch (error) {

        }
    },

    async uploadFile(req: Request, res: Response) {
        try {
            const file = req.file;
            const userId = (req as any).user?.userId || "anonymous";
            const projectId = "696b9e92701a4ea33cc287cb";

            if (!file) {
                return res.status(400).json({
                    success: false,
                    error: "No file uploaded."
                });
            }

            const finalState = await informationAgent.invoke({
                file,
                userId,
                projectId
            });

            if (!finalState.success) {
                return res.status(422).json({
                    success: false,
                    error: finalState.error
                });
            }

            return res.status(200).json({
                success: true,
                data: finalState.fileSummary
            });

        } catch (error: any) {
            return res.status(500).json({
                success: false,
                error: "Internal server error."
            });
        }
    }

}