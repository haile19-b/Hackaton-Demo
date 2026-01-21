 import mammoth from "mammoth";

// Node-compatible pdf.js build
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

 function normalizeText(text: string): string {
  return text
    .replace(/-\s*\n\s*/g, "")     // Fix hyphenated line breaks
    .replace(/\n{3,}/g, "\n\n")    // Reduce excessive newlines
    .replace(/[ \t]{2,}/g, " ")    // Extra spaces
    .replace(/\s+\n/g, "\n")       // Space before newline
    .trim();
}

 export const processFile = async (file: Express.Multer.File,userId:string,projectId:string) => {
    try {
      let text = "";

      /* ---------------- FILE TYPE DETECTION ---------------- */

      if (file.mimetype === "application/pdf") {
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(file.buffer),
          useSystemFonts: true,
          disableFontFace: true
        });

        const pdf = await loadingTask.promise;

        // Parallel page extraction (FASTER)
        const pagePromises = Array.from(
          { length: pdf.numPages },
          async (_, index) => {
            const page = await pdf.getPage(index + 1);
            const content = await page.getTextContent();

            return content.items
              .map((item: any) => item.str)
              .join(" ")
              .replace(/\s+/g, " ")
              .trim();
          }
        );

        const pages = await Promise.all(pagePromises);
        text = pages.join("\n\n");
      }

      else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({
          buffer: file.buffer
        });
        text = result.value;
      }

      else if (file.mimetype === "text/plain") {
        text = file.buffer.toString("utf8");
      }

      else {
        return {
          success: false,
          error: "Unsupported file type"
        };
      }

      /* ---------------- NORMALIZE TEXT ---------------- */

      text = normalizeText(text);

      if (!text || text.length < 50) {
        return {
          success: false,
          error: "File has no usable text"
        };
      }

    } catch (error: any) {
      console.error("File processing error:", error);

      return {
        success: false,
        error: error?.message || "Unknown error"
      };
    }
  },