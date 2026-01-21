import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

function normalizeText(text: string): string {
  return text
    .replace(/-\s*\n\s*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+\n/g, "\n")
    .trim();
}

export const extractText = async (state: any) => {
  try {
    const file = state.file;
    if (!file || !file.buffer) {
      return { ...state, success: false, error: "Invalid file input" };
    }

    let text = "";

    if (file.mimetype === "application/pdf") {
      const pdf = await pdfjsLib
        .getDocument({ data: new Uint8Array(file.buffer) })
        .promise;

      const pages = await Promise.all(
        Array.from({ length: pdf.numPages }, async (_, i) => {
          const page = await pdf.getPage(i + 1);
          const content = await page.getTextContent();
          return content.items.map((it: any) => it.str).join(" ");
        })
      );

      text = pages.join("\n\n");
    }

    else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    }

    else if (file.mimetype === "text/plain") {
      text = file.buffer.toString("utf8");
    }

    else {
      return { ...state, success: false, error: "Unsupported file type" };
    }

    text = normalizeText(text);

    if (text.length < 50) {
      return { ...state, success: false, error: "No usable text found" };
    }

    return { ...state, text, success: true };

  } catch (error: any) {
    return {
      ...state,
      success: false,
      error: error.message || "Text extraction failed"
    };
  }
};
