import * as z from 'zod/v3'

const functionalRequirements = z.object({
  id: z.string().describe("Unique requirement ID."),
  description: z.string().describe("Clear requirement description."),
});

const techStackSchema = z.object({
  category: z.string().describe(
    "Category of the tech stack, e.g., frontend, backend, database, version control, or other."
  ),
  stack: z.array(z.string()).describe(
    "List of technologies/tools used in this category."
  )
});

const non_FunctionalRequirements = z.object({
  id: z.string().describe("Unique requirement ID."),
  description: z.string().describe("Clear requirement description."),
});

const taskSchema = z.object({
  title: z.string().describe("Task title."),
  description: z.string().describe("What needs to be done."),
});

const conflictSchema = z.object({
  description: z.string().describe("Conflicting or unclear requirement."),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const projectDocumentationSchema = z.object({

  functionalRequirements: z.array(functionalRequirements)
    .describe("All extracted functional requirements."),

  non_functionalRequirements: z.array(non_FunctionalRequirements)
    .describe("All extracted non-functional requirements."),
  techStack:z.array(techStackSchema)
  .describe("techStack Used in the project"),
  recommendedTasks: z.array(taskSchema)
    .describe("Tasks required to complete the project based on functional and non-functional requirements, constraints and the overall document"),

  conflicts: z.array(conflictSchema).default([])
    .describe("Conflicts or ambiguities in the document."),

  missingInformation: z.array(z.string()).default([])
    .describe("Important missing or unclear information."),
});

export type FileSummary = z.infer<typeof projectDocumentationSchema>


