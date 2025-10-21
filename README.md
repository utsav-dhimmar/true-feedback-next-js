# true-feedback

- Project `true-feedback` is an AI-powered anonymous feedback collector project. project built by following a tutorial on YouTube by Hitesh Choudhary.
    <!--todo: add link to YT channel link-->

## Tech Stack

1. Next.js: The learning purpose for this project.

2. MongoDB: Database

3. Auth.js or NextAuth: for authentication

4. AI SDK : SDK simplify an AI integration

5. shadcn ui -> component library

6. Tailwind CSS: styling the project

7. Google Gemini APIs: AI that gives AI-powered suggestions

8. zod -> for validation

## My Document

- This is my first project entirely with Next.js. `next js != react js` It allows writing backend and frontend in the same app, with no requirement of a monorepo.
- Majorly, Next.js was deployed on serverless; we need to take care of existing/recently used database connections/models.
  <!--- Since Next.js is a full-stack framework, it provides so many helper functions, which may require manual installation on the Express backend and React frontend. --->
- It follows file-based routing for frontend and backend, so there is no need for a React Router-like routing library.
  <!--- by default all components are server components `"use client"` directive for client component -->
- Path parameters require an extra folder for capturing the dynamic value, which is slightly inconvenient for me but aduject with useages .
- Shadcn UI and AI SDK ❤️ helps lots in faster development

# difficulty

- NextAuth or Auth.js

- For the first time I am using NextAuth for sign-in. Using NextAuth with providers like Google (I even implemented it), GitHub, etc. is very easy; it just requires keys from providers. But with custom credentials it is difficult, mainly with flow. Honestly, I faced lots of issues with it. made a mistake like reading new documentation (from Auth.js) but using an old version of NextAuth.
- session, JWT, which field stores and which one does not ... and TypeScript issues ... require much patience
- Eventually I complete the project with an assignment where I have to complete the last feature of the project.
- Submit anonymous feedback with AI-powered suggestions.

- tailwindcss
- I am very bad at designing a website that even looks decent.

## local useages

- clone the repso
- `pnpm i`

- require env variables

```txt
MONGODB_URI=

RESEND_API_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
DOMAIN_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GOOGLE_GENERATIVE_AI_API_KEY=
```
