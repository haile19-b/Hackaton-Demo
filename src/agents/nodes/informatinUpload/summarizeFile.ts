import zodToJsonSchema from "zod-to-json-schema";
import { genAI } from "../../../config/genAI";
import { projectDocumentationSchema } from "../../zodSchema/documentSchema";

export const askAISummary = async (state: any) => {
  try {
    const file = state.file;

    if (!file || !file.buffer) {
      return {
        success: false,
        error: "Invalid file provided to analysis engine.",
        fileSummary: null
      };
    }

    const base64Data = file.buffer.toString("base64");

    const contents = [
      {
        text: `
You are a senior software analyst.

Extract ONLY:
- Functional requirements
- Non-functional requirements
- Recommended tasks
- Tech stack
- Conflicts
- Missing information

Rules:
- Do NOT invent data
- Use empty arrays if missing
- Return ONLY valid JSON matching the schema
`
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

    if (!response.text) {
      return {
        success: false,
        error: "AI returned empty response.",
        fileSummary: null
      };
    }

    const parsed = JSON.parse(response.text);

    return {
      success: true,
      error: "",
      fileSummary: parsed
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Unexpected AI error",
      fileSummary: null
    };
  }
};
