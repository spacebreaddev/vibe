# Vibe Coding Challenge Starter

React + TypeScript + Vite + Tailwind CSS + Axios

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
```

## Structure

```
src/
  App.tsx           # Main entry point — wire new components here
  lib/
    api.ts          # ALL fetch/API logic lives here
  components/       # Drop new feature components here
.env.example        # Copy to .env.local and fill in API keys
```

## Adding a feature

1. Add the API call to `src/lib/api.ts`
2. Create the component in `src/components/YourFeature.tsx`
3. Import and use it in `App.tsx`
4. Style with Tailwind utility classes only

## Rules
- No unit tests, no test frameworks
- No Storybook
- Tailwind for all styling
- `async/await` over `.then()` chains
