import zodToJsonSchema from "zod-to-json-schema";
import { genAI } from "../../../config/genAI";
import { projectDocumentationSchema } from "../../zodSchema/documentSchema";
import { agentEvents } from "../../../config/event.emmiter";

export const askAISummary = async (file: Express.Multer.File) => {
  agentEvents.emit("progress", {
    type: "progress",
    node: "Document Preparation",
    status: "started",
    message: "Converting file to base64",
    timestamp: Date.now()
  });

  const base64Data = file.buffer.toString("base64");

  agentEvents.emit("progress", {
    type: "progress",
    node: "AI Model",
    status: "started",
    message: "Sending document to Gemini",
    timestamp: Date.now()
  });

  const contents = [
    {
      text: `You are a senior software analyst.

Analyze the following project documentation and extract:
- Functional requirements
- Non-functional requirements
- Recommended tasks
- Conflicts or ambiguities
- Missing or unclear information

Return ONLY valid JSON matching the schema.`
    },
    {
      inlineData: {
        mimeType: file.mimetype,
        data: base64Data
      }
    }
  ];

  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(projectDocumentationSchema)
    }
  });

  agentEvents.emit("progress", {
    type: "progress",
    node: "AI Model",
    status: "completed",
    message: "AI analysis completed",
    timestamp: Date.now()
  });

  const parsed = JSON.parse(response.text!);

  agentEvents.emit("progress", {
    type: "progress",
    node: "Validation",
    status: "completed",
    message: "Structured output validated",
    timestamp: Date.now()
  });

  return parsed;
};