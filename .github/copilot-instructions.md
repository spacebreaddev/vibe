# Copilot Instructions

## Project Context
This is a vibe coding challenge project. The goal is to ship a working UI fast.

## Priorities
- Move fast. Prioritize working code over perfect code.
- Build UI-first. Focus on user-facing features and clean UX.
- Use components that are reusable but don't over-engineer them.

## Stack
- React + TypeScript + Vite
- Tailwind CSS for all styling — do NOT write custom CSS unless unavoidable
- Axios (already installed) for all HTTP/API calls
- Use `src/lib/api.ts` as the central place for API logic

## Rules — ALWAYS follow these
- **NO unit tests.** Do not generate test files, test suites, or testing utilities.
- **NO test frameworks.** Do not install or suggest Jest, Vitest, Testing Library, Cypress, Playwright, or any other testing tool.
- **NO Storybook** or component documentation tooling.
- **NO unnecessary abstractions.** Don't create base classes, factories, or over-generic utilities unless explicitly asked.
- **NO placeholder lorem ipsum content** — use realistic example data.

## Code Style
- Prefer functional React components with hooks.
- Keep components in `src/components/`.
- Keep all API/fetch logic in `src/lib/api.ts`.
- Use `async/await` over `.then()` chains.
- Use Tailwind utility classes directly on JSX elements.
- Manage state with `useState` and `useEffect` unless the app grows complex enough to warrant `useReducer` or a store.

## When adding a new feature
1. Add any new API functions to `src/lib/api.ts`.
2. Create the component in `src/components/`.
3. Wire it into `App.tsx`.
4. Style with Tailwind only.
