# Traditional Yangzhai Feng Shui Analysis System

An early-stage open-source web application for exploring traditional Chinese residential feng shui concepts through an interactive floor-plan workspace. It is intended for cultural study, layout discussion, and low-cost spatial planning—not medical, legal, financial, or professional architectural advice.

## What it includes

- Interactive 2D floor-plan and room selection views.
- A 3D layout sandbox with selectable rooms and camera modes.
- Luopan compass overlay controls and orientation calculations.
- Structured reports covering room observations, eight-mansion references, airflow, lighting, and practical remedies.
- Optional server-side Gemini analysis at `POST /api/gemini/analyze`, returned as schema-constrained JSON.

## Run locally

Prerequisites: Node.js and a Gemini API key.

```sh
npm install
cp .env.example .env
# Set GEMINI_API_KEY in .env; never commit the real value.
npm run dev
```

The development server listens on `http://localhost:3000`.

## Architecture

The React/Vite client renders the interactive workspace. `server.ts` provides the Express server, serves the Vite app, loads environment variables, and calls `@google/genai` without exposing the key to browser code. Static report data lives under `src/data`; shared types are in `src/types.ts`.

## Security and privacy boundaries

- Keep `GEMINI_API_KEY` in an environment secret; `.env` is ignored and `.env.example` contains only a placeholder.
- Text submitted to the AI analysis form is sent to the configured Gemini API. Do not submit private or identifying information.
- The demo endpoint currently has no authentication, rate limiting, or abuse controls. Add those before public deployment.
- Treat generated analysis as cultural/educational content and independently verify any real-world decision.

## Project status

This is an early-stage project. The repository currently has no automated CI workflow or dependency lockfile; contributions that improve testing, validation, documentation, and deployment safety are welcome.

## License

Apache-2.0. See [LICENSE](./LICENSE).
