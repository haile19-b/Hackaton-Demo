import zodToJsonSchema from "zod-to-json-schema";
import { genAI } from "../../../config/genAI";
import { projectDocumentationSchema } from "../../zodSchema/documentSchema";


export const askAISummary = async (file: Express.Multer.File) => {
    // 1. Convert the Multer buffer directly to a base64 string
    const base64Data = file.buffer.toString("base64");

    const contents = [
        { text: `You are a senior software analyst.

Analyze the following project documentation and extract:
- Functional and non-functional requirements
- Recommended implementation tasks
- Conflicts or ambiguities
- Missing or unclear information

Return ONLY valid JSON that matches the provided schema.` },
        {
            inlineData: {
                mimeType: file.mimetype, // Dynamically use the file's mime type (e.g., 'application/pdf')
                data: base64Data
            }
        }
    ];

    const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config:{
            responseMimeType:"application/json",
            responseJsonSchema:zodToJsonSchema(projectDocumentationSchema)
        }
    });

    const parsed = JSON.parse(response.text!);

  return parsed;

};
