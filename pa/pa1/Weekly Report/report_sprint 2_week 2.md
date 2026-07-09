# Weekly Meeting Report - Sprint [2] - Week [5]

**Team:** CAGT (Planning AI)  
**Date:** 2026-07-09  
**Meeting Time:** 22:00 - 23:00  
**Location/Link:** Discord

**Attendees:**

- Thái Nguyễn Tuấn Kiệt (PM / UI/UX)
- Nguyễn Thế Quân (Architect / Fullstack)
- Nguyễn Minh Phát (QA / Fullstack)
- Nguyễn Phương Gia Bảo (Frontend Leader)
- Ngô Văn Phong (Backend Leader)
- **Absent:** 0

---

## 1. Sprint Goal & Status Update

- **Current Sprint:** Sprint [2] (Dates: [29/6/2026] - [12/7/2026])
- **Sprint Goal:** Requirements and initial design
- **Overall Status:** On Track

---

## 2. Individual Updates

### Thái Nguyễn Tuấn Kiệt (PM)

- **What have you done this week?**
  - Planned for Sprint 2
  - Conducted PA1 deliverables
  - Managed team's tasks
  - Conducted UX research

- **What are your blockers?**
  - Tasks are slightly overloaded among team members

- **What will you do next?**
  - Create the design system for UI
  - Create high-fidelity wireframes for UI
  - Gather UI feedback from team members

### Nguyễn Thế Quân (Architect)

- **What have you done this week?**
  - Reshape the project idea hoặc Refine the project concept
  - Assist Kiet with Sprint 2 planning and task assignment via GitHub Issues
  - Restructure the docs/ directory according to requirements
  - Support the team in implementing PA1 (hoặc executing PA1)
- **What are your blockers?**
  - None
- **What will you do next?**
  - Write Vision Document (Draft version)
  - Draw Use-case Model Diagram

### Nguyễn Minh Phát (QA)

- **What have you done this week?**
  - Conducted competitive audit and analysis
  - Created user stories based on interview transcripts
  - Created functional requirements based on user stories

- **What are your blockers?**
  - None

- **What will you do next?**
  - Draft test cases for FR1.2, FR1.3, FR2.1, and FR3.1

### Nguyễn Phương Gia Bảo (Frontend Leader)

- **What have you done this week?**
  - Learned how to use `shadcn/ui` and Radix UI
  - Analyzed competitors to write documentation

- **What are your blockers?**
  - Lack of information about competitors, and depend on AI analysis
- **What will you do next?**
  - Find template idea
  - Contribute to Figma design

### Ngô Văn Phong (Backend Leader)

- **What have you done this week?**
  - Analyzed competitive audit

- **What are your blockers?**
  - None

- **What will you do next?**
  - Set up backend environment and implement API schema

---

## 3. Team Discussion & Action Items

- **The meeting mainly revolved around analyzing, discussing, and clarifying the detailed implementation ideas for the project.**
- **Resolved questions arising from detailed ideas:**
  1. Fallback when AI continuously returns incorrect formats after retrying and splitting the document:
     - Fallback mechanism: The system relies on headers to create the Concept Graph.
     - If the AI fails too many times (due to incorrect schema) => Fallback: The system relies on headers to generate the Concept Graph.
     - If the DAG check detects errors in the graph => AI adjusts/corrects the graph.
  2. Does the DAG check rerun when the user edits the graph, or does it only run once when the AI returns it?
     - Yes, it will check.
     - If errors are found, there are 2 proposed solutions:
       - Option 1: The system automatically adjusts it for correctness.
       - Option 2: Let the user choose between keeping their manual edits or accepting the system's proposed version.
       - => The majority of members voted for Option 2.
  3. Are deadlines mandatory or optional? If optional, how does the priority queue (FR6) prioritize when they are missing?
     - The majority of members voted to have deadlines.
  4. Specific time threshold for "a few minutes" (§2.4) - needs a measurable value to write test cases.
     - Not yet finalized.
  5. Input document size/length limits (number of words, pages, image size) - not yet defined.
     - Analysis:
       - **Single file option:**
         - Pros: Runs smoothly (due to file size limits).
         - Cons: User might not know which file to study first, etc.
       - **Multiple files option:**
         - Pros: Links multiple concepts, helping the user build a better study plan.
         - Cons: Large context (large input) -> reduces graph accuracy; potential for unrelated files -> generates multiple disjoint graphs.
       - => The team has not finalized a decision yet.
  6. Can a plan accept multiple source documents, or must it be 1 document = 1 plan?
     - (Open question / Not yet resolved)

- **Need to review the deadline input method:**
  - How should deadlines be inputted?
    - Option A: Set a single overall deadline for the entire plan.
    - Option B: Set individual deadlines for each section/topic.

### Action Items (High-Priority Tasks)

- Complete PA1 and PA2 report
- Finalize Project Plan

---

**Next Meeting Date:** 15/07/2026
