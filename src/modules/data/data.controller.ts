import { Request, Response } from "express";
import { fileService } from "./data.service";
import { askAISummary } from "../../agents/nodes/informatinUpload/summarizeFile";
import { agentEvents } from "../../config/event.emmiter";
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
        // --- SSE headers ---
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders?.();

        // --- SSE writer ---
        const onProgress = (event: any) => {
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        };

        agentEvents.on("progress", onProgress);

        try {
            const file = req.file;
            if (!file) {
                agentEvents.emit("progress", {
                    type: "error",
                    node: "Upload",
                    status: "failed",
                    message: "No file uploaded",
                    timestamp: Date.now()
                });
                return;
            }

            agentEvents.emit("progress", {
                type: "progress",
                node: "Upload",
                status: "completed",
                message: "File received successfully",
                timestamp: Date.now()
            });

            const result = await askAISummary(file);

            agentEvents.emit("progress", {
                type: "result",
                node: "AI Analysis",
                status: "completed",
                data: result,
                timestamp: Date.now()
            });

            agentEvents.emit("progress", {
                type: "done",
                node: "Pipeline",
                status: "completed",
                message: "Processing finished",
                timestamp: Date.now()
            });

        } catch (error: any) {
            agentEvents.emit("progress", {
                type: "error",
                node: "Upload Pipeline",
                status: "failed",
                message: error.message,
                timestamp: Date.now()
            });
        } finally {
            agentEvents.off("progress", onProgress);
            res.end();
        }
    }
}