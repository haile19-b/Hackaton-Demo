import zodToJsonSchema from "zod-to-json-schema";
import { genAI } from "../../../config/genAI";
import { FileSummary, projectDocumentationSchema } from "../../zodSchema/documentSchema";


const askAISummaryFile = async (file: Express.Multer.File) => {
    const base64Data = file.buffer.toString("base64");

    const contents = [
        {
            role: "user",
            parts: [
                {
                    text: `
You are a senior software requirements analyst.

Extract key project information from the document. Use only what is explicitly stated. Do NOT invent or explain. Output plain text only, following this structure exactly:

Functional Requirements:
- <one per line or "None specified">

Non-Functional Requirements:
- <one per line or "None specified">

Constraints:
- <one per line or "None specified">

Technology Stack:
- <one per line or "None specified">

Recommended Implementation Steps:
1. <step one>
2. <step two>
3. <step three>

Conflicts:
- <one per line or "None specified">

Missing Important Information:
- <one per line or "None specified">
`

                },
                {
                    inlineData: {
                        mimeType: file.mimetype,
                        data: base64Data
                    }
                }
            ]
        }
    ];

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
    });
    console.log(response.text)

    return response.text;
};

const data = `
Functional Requirements:
- The system shall require strong identity verification before exam access
- The system shall use face identification as the primary authentication method
- The system shall support supplementary authentication (ID cards, fingerprints, or Two-Factor authentication)
- The system shall ensure only authorized students can take assigned exams
- The system should allow instructors to create and submit questions
- The system should allow course coordinators to review and forward questions to the exam committee
- The system shall allow the exam committee to review, approve and set: Marks per question, Question type, Exam coverage and difficulty
- The system shall return completed exam questions to a secure question bank
- The system shall prevent students from viewing past exam questions
- The system shall require digital approval of exams by department heads
- The system shall include proctoring features: Camera monitoring for unusual movements, Navigation restrictions during exams, Prevention of screenshots, copy-paste, and external communication
- The system shall enforce equal time limits for all students
- The system shall automatically grade multiple-choice exams
- The system shall allow manual score entry for non-multiple-choice assessments
- The system shall allow authorized staff to review academic integrity and misconduct reports
- The system shall allow authorized users to schedule exams in multiple shifts
- The system shall support the assignment of overlapping administrative roles to a single user account
- The system shall automatically record time-stamped logs for all exam access, submissions, and grading actions

Non-Functional Requirements:
- The system shall ensure fair treatment of all students by preventing cheating and standardizing exam procedures.
- The system shall store and manage exam questions securely in a question bank, preventing unauthorized access.
- The system shall maintain reliable performance under all operational conditions
- Exam papers, answers, and student records shall be securely stored and accessible only to authorized staff
- The system shall be deployable on existing institutional servers or cloud infrastructure capable of supporting the required number of students
- The system shall be compatible with standard web browsers or client applications used by the institution
- Students shall take exams in supervised classrooms with appropriate spacing
- Unauthorized access to the system, duplication of exam content, or viewing past exam questions by students shall be strictly prohibited.
- The system shall use a modular architecture, separating the frontend, backend, and database layers to ensure maintainability and scalability.
- The user interface will be intuitive, responsive, and accessible for all users, including students, invigilators, and administrators.
- The system shall provide secure login and role-based access control to ensure that only authorized users can access specific functions.
- The system shall maintain audit logs to track user activities and support exam integrity and traceability.
- The database shall be relational, normalized, and secure, capable of efficiently storing users, exams, questions, results, and logs.
- The system shall support concurrent access by multiple users without performance degradation.
- The system will operate on common web browsers without requiring specialized software or plugins.
- The system design shall allow for future enhancements, such as integrating AI-based proctoring or supporting additional question types.
- All system components shall comply with institutional data protection and academic integrity policies.

Constraints:
- The system provides basic digital invigilation controls but does not include advanced monitoring technologies.
- System performance and the number of concurrent users depend on available server and network resources; therefore, examinations may need to be conducted in scheduled sessions.
- The system focuses on examination delivery and result management and does not cover other academic activities outside the examination process.
- Basic digital invigilation features are implemented to reduce cheating while remaining feasible within current technical limits.
- The system shall allow only authorized students to access examinations using secure authentication methods.
- The system shall support multiple-choice examinations exclusively.
- The system shall enforce fixed examination start and end times for all students.
- The system shall comply with the grading policies and assessment standards established by the Ministry of Education (MoE).
- The system shall store examination data, results, and activity logs securely to ensure auditability and traceability.
- The system shall allow simultaneous access by multiple users, including students, invigilators, and administrators, during examination sessions.
- The system shall operate within the existing institutional academic procedures and examination protocols.
- The system shall not provide automatic grading for subjective questions, including essays, workouts, or long-form answers.
- The system will not replace instructors' responsibilities related to academic judgment or disciplinary decisions.
- The system will not let students access or view full exam questions after completion.
- The system shall not manage hardware failures, power outages, or network interruptions beyond system control.
- The system will not allow manual modification of examination results without proper administrative authorization.
- The system shall not function as a full learning management system for course content delivery or teaching activities.
- Invigilators or any staff shall not modify or extend the timer.

Technology Stack:
- HTML
- CSS
- JavaScript
- React
- Node.js
- Express
- MySQL
- Visual Studio Code
- Git
- Draw.io

Recommended Implementation Steps:
1. System Design (Design system architecture, database, and user interfaces)
2. Development (Implement system features and modules)
3. Testing (Perform unit, integration, and system testing)
4. Deployment (Deploy the system to the production environment)
5. Documentation & Training (Prepare user manuals and provide training)

Conflicts:
- FR-UA-02: "The system shall use face identification as the primary authentication method" (page 28) vs. "advanced biometric methods (e.g., face recognition or fingerprint verification) are considered optional extensions, depending on available infrastructure" (page 15).
- Scope states support for "a mix of question types" including "subjective questions" with "manual score entry for the subjective, paper-based answers" (page 12), while a Domain Requirement states: "The system shall support multiple-choice examinations exclusively" (page 31).

Missing Important Information:
- Specific computational resources required for advanced AI-based movement detection.
- Details on the available infrastructure for biometric verification.
- A detailed actual cost plan, as current costs are stated as "roughly estimated not an actual plan".

`


export const askAISummary = async (file: Express.Multer.File) => {
    // Step 1: extract preliminary info from the file
    const contents = [
        {
            text: `
You are a strict JSON extraction engine.

Return a JSON OBJECT that exactly matches the provided schema.
Rules:
- Do NOT add extra fields
- Do NOT rename fields
- Do NOT invent data
- If a field is missing, return empty arrays []

Here is the  data you contract the structured output from:
${JSON.stringify(data, null, 2)}

Return ONLY valid JSON THAT MATCH GIVEN SCHEMA.
`
        }
    ];

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(projectDocumentationSchema),
        }
    });

    const extractedData: FileSummary = JSON.parse(response.text!)
    return extractedData
};

