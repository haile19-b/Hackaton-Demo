export const cleanDatabaseInfo = async (state: any) => {
  const { dbResult, emit } = state;

  if (!dbResult) {
    emit?.("progress", { stage: "db-clean", message: "No DB data to clean" });
    return { success: true, final_DB_Info: null };
  }

  try {
    const sections: string[] = [];

    if (dbResult.FunctionalRequirement?.length) {
      sections.push(
        dbResult.FunctionalRequirement
          .map((fr: any) => `${fr.code}: ${fr.description}`)
          .join("\n")
      );
    }

    if (dbResult.Conflict?.length) {
      sections.push(
        dbResult.Conflict
          .map((c: any) => `${c.description} (resolved: ${c.resolved})`)
          .join("\n")
      );
    }

    return {
      success: true,
      final_DB_Info: sections.join("\n\n")
    };

  } catch (err) {
    console.error("cleanDatabaseInfo error:", err);
    emit?.("error", { message: "Failed to process database data." });
    return { success: false };
  }
};
