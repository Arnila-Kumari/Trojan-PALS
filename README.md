> Backend integration installed. Start with [BACKEND_SETUP.md](BACKEND_SETUP.md) for Supabase, accounts, and persistent reviews.

# TrojanPals

A responsive Next.js + TypeScript frontend for exploring courses, talking through academic interests, and discovering research directions. Built for a USC campus-life hackathon.

## Start here

1. Install Node.js **22 or newer**.
2. Extract this project folder and open it in VS Code.
3. Open **Terminal → New Terminal** and run:

```bash
npm install
npm run dev
```

4. Open **http://localhost:3000**. Leave the terminal running. Stop the app with **Ctrl+C**.

This is a complete project: **do not run create-next-app inside it**. If you already created an empty starter, the simplest approach is to use this extracted folder instead. The first install requires an internet connection to the npm registry. No API key or account setup is required for the demo.

## The four tabs

- **My profile** (`/profile`): edit name, program, interests, assessment preference, weekly workload, completed courses, and a personal goal. Save preferences to recalculate recommendations. Saved courses and research directions appear below the form.
- **AI companion** (`/chat`): interactive conversation UI, sample prompts, course-specific context, clickable recommendation cards, and a sample outreach draft. **This is a local rules-based demo, not a live AI model.**
- **Explore courses** (`/courses`, also `/`): three personalized recommendations, followed by the remaining matching courses alphabetically by title. Search, assessment/level filters, saved-only filtering, and individual save buttons work. If fewer than three eligible results match, fewer recommendations appear. Completed courses remain browsable but are excluded from recommendations.
- **Discover research** (`/research`): illustrative research directions, preparation steps, related courses, save controls, and links to official research directories. No actual faculty/publication matching is implemented yet.

Click any course title to open its own `/courses/[id]` page. The page has overview, prerequisites, sample assessment breakdowns, topics, senior advice examples, related research, and an action to discuss that course in chat.

## Important demo boundaries

- **All course details are illustrative**, including names/codes as used in this dataset, descriptions, units, prerequisites, assessments, workload, and preparation advice. They are not verified semester-specific USC facts.
- CSCI 599 Special Topics: Responsible AI is a fictional example offering.
- Research directions and senior contributions are fictional demonstration content. The app does not represent faculty, current openings, actual student reviews, or real opt-in mentors.
- Course ranking uses transparent local scoring, not an AI confidence percentage. The Courses page explains the scoring. Free-text goals are saved for planning but do not influence this structured demo ranking.
- Profile, saved items, and chat history are stored only in the current browser's localStorage. There is no server persistence, authentication, database, or message sending. Storage failures are surfaced in the UI.
- There are no external fonts, image downloads, or icon dependencies. Icons are inline SVG. External links open only when clicked.

## Where to edit

| File | What it controls |
| --- | --- |
| `app/globals.css` | Colors, layout, responsive styles |
| `components/shell.tsx` | Sidebar/bottom navigation and app frame |
| `components/courses-page.tsx` | Top three recommendations and alphabetical catalog |
| `components/course-detail.tsx` | Individual course pages |
| `components/profile-page.tsx` | Preferences and saved plan |
| `components/chat-page.tsx` | Conversation interface |
| `components/research-page.tsx` | Research discovery |
| `components/app-provider.tsx` | Shared state and browser persistence |
| `lib/data.ts` | Sample courses, research directions, and ranking |
| `lib/demo-chat.ts` | Frontend demo responder |

## Checks

After installing dependencies:

```bash
npm test
npm run typecheck
npm run build
```

Run the production build with `npm start` after a successful build.

## Connect real data and AI next

1. Replace the seed data with verified course/syllabus information, source URLs, semester labels, and actual voluntary student contributions. Keep official facts separate from student reports.
2. Add a database and authentication if required; use explicit opt-in for senior contact information.
3. Create a **server-side** API route for the AI provider. Replace `getDemoReply` with a request to that route. **Never put provider API keys in client components or NEXT_PUBLIC variables.**
4. Retrieve course/publication evidence, validate returned record IDs, and render source links from your stored records. Do not infer current lab vacancies from research relevance.

## Validation in the authoring environment

Package registry access was blocked (HTTP 403), so a normal Next.js installation, TypeScript typecheck, and production build could not be run here. All 20 TypeScript/TSX source files parsed and transpiled successfully using the environment's existing tooling, and all eight recommendation/chat behavioral tests passed. All five initial page component trees also rendered into static HTML using a lightweight test renderer. Browser startup was blocked by the execution environment, so visual layout and live React interactions have not been verified in a browser. These checks do not replace running the commands above on your computer after installing dependencies.
