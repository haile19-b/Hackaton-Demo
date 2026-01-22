import { Request, Response } from "express";
import { assistantAgent } from "../../agents/graphs/assistantGraph";
import { createSSEEmitter } from "../../utils/sse";

export const assistantController = {
  async answerUserQuery(req: Request, res: Response) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const emit = createSSEEmitter(res);

    const { query } = req.body;
    const { projectId } = req.params;
    const userId = (req as any).user?.userId;

    if (!query) {
      emit("error", { message: "Query is required." });
      return res.end();
    }

    if (!projectId) {
      emit("error", { message: "Project ID is required." });
      return res.end();
    }

    emit("progress", {
      stage: "start",
      message: "Assistant started"
    });

    try {
      const result = await assistantAgent.invoke({
        query,
        projectId,
        userId,
        emit
      });

      emit("final", {
        success: true,
        response: result.finalResponse
      });

      res.end();

    } catch (err: any) {
      console.error("assistantController error:", err);

      emit("error", {
        message: err?.message || "Unexpected server error"
      });

      res.end();
    }
  }
};
