export const cleanDatabaseInfo = async (state: any) => {
  const { dbResult } = state;

  if (!dbResult || typeof dbResult !== "object") {
    return {
      success: false,
      error: "No database data to clean."
    };
  }

  try {
    const sections: string[] = [];

    if (dbResult.FunctionalRequirement?.length) {
      sections.push(
        "Functional Requirements:\n" +
          dbResult.FunctionalRequirement
            .map((fr: any) => `- ${fr.code}: ${fr.description}`)
            .join("\n")
      );
    }

    if (dbResult.NonFunctionalRequirement?.length) {
      sections.push(
        "Non-Functional Requirements:\n" +
          dbResult.NonFunctionalRequirement
            .map((nfr: any) => `- ${nfr.code}: ${nfr.description}`)
            .join("\n")
      );
    }

    if (dbResult.TechStack?.length) {
      sections.push(
        "Tech Stack:\n" +
          dbResult.TechStack
            .map(
              (ts: any) =>
                `- ${ts.category}: ${ts.stack.join(", ")}`
            )
            .join("\n")
      );
    }

    if (dbResult.Task?.length) {
      sections.push(
        "Tasks:\n" +
          dbResult.Task
            .map(
              (t: any) =>
                `- ${t.title}${t.description ? `: ${t.description}` : ""}`
            )
            .join("\n")
      );
    }

    if (dbResult.Conflict?.length) {
      sections.push(
        "Conflicts:\n" +
          dbResult.Conflict
            .map(
              (c: any) =>
                `- ${c.description} (severity: ${c.severity}, resolved: ${c.resolved})`
            )
            .join("\n")
      );
    }

    if (dbResult.MissingInformation?.length) {
      sections.push(
        "Missing Information:\n" +
          dbResult.MissingInformation
            .map((m: any) => `- ${m.description}`)
            .join("\n")
      );
    }

    return {
      success: true,
      final_DB_Info: sections.join("\n\n")
    };

  } catch (error: any) {
    console.error("cleanDatabaseInfo error:", error);

    return {
      success: false,
      error: "Failed to clean database information."
    };
  }
};
