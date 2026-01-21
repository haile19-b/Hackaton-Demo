import { Request, Response } from "express";
import { fileService } from "./data.service";
import { askAISummary } from "../../agents/nodes/informatinUpload/summarizeFile";
export const dataController = {
    async addTextData(req:Request,res:Response){
        try {
            const {text,projectId} = req.body;
            if(!text){
                return res.status(400).json({success:false,error:"NO text given!"})
            }
            const userId = (req as any).user.userId
            const result = await fileService.processText(text,userId,projectId)
        } catch (error) {
            
        }
    },

    async uploadFile(req: Request, res: Response) {
        try {
            const file = req.file;
            console.log("hello")

            if (!file) {
                return res.status(400).json({ success: false, error: "No file uploaded" });
            }
            // const {projectId} = req.body;
            // const userId = (req as any).user.userId;
            const result = await askAISummary(file);

            return res.status(200).json(result);

        } catch (error: any) {
            console.error("File upload error:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}