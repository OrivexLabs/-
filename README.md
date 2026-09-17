# Traditional Yangzhai Feng Shui Analysis System

An early-stage open-source web application for exploring traditional Chinese residential feng shui concepts through an interactive floor-plan workspace. It is intended for cultural study, layout discussion, and low-cost spatial planning—not medical, legal, financial, or professional architectural advice.

## What it includes

- Interactive 2D floor-plan and room selection views.
- A 3D layout sandbox with selectable rooms and camera modes.
- Luopan compass overlay controls and orientation calculations.
- Structured reports covering room observations, eight-mansion references, airflow, lighting, and practical remedies.
- Optional server-side Gemini analysis at `POST /api/gemini/analyze`, returned as schema-constrained JSON.

## Run locally

Prerequisites: Node.js 20 or newer and, only for AI analysis, a Gemini API key.

```sh
npm ci
cp .env.example .env
# Set GEMINI_API_KEY in .env; never commit the real value.
npm run dev
```

The development server listens on `http://localhost:3000`.

The static report workspace can be built and served without a Gemini key. The AI analysis endpoint returns a generic `503` response until `GEMINI_API_KEY` is configured.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server and Express API. |
| `npm run lint` | Run strict TypeScript checking without emitting files. |
| `npm test` | Run unit and HTTP integration tests. |
| `npm run build` | Build the browser bundle and production API server. |
| `npm run security` | Run `npm audit` with high-severity failures. |
| `npm start` | Serve the production build. |

## Architecture

The React/Vite client renders the interactive workspace. `server/index.ts` is the runtime entry point and `server.ts` composes the Express app and production/development serving path. `server/validation.ts` validates request fields and limits, `server/report-validation.ts` validates model output against the client report contract, and `server/rate-limit.ts` applies a per-client in-memory limit. Static report data lives under `src/data`; shared types are in `src/types.ts`.

## Security and privacy boundaries

- Keep `GEMINI_API_KEY` in an environment secret; `.env` is ignored and `.env.example` contains only a placeholder.
- Text submitted to the AI analysis form is sent to the configured Gemini API. Do not submit private or identifying information.
- The AI endpoint accepts three text fields with explicit length limits, a 16 KiB JSON body limit, schema validation, a 45-second upstream timeout, generic error responses, and a per-client in-memory limit of 10 requests per minute.
- The rate limiter is process-local and keyed by the address Express sees. Public multi-instance deployment still needs an authenticated gateway and a shared limiter/WAF.
- User text is treated as untrusted data in the model prompt. The server does not execute model output as shell commands, write model output to the filesystem, or expose the API key to client code.
- Treat generated analysis as cultural/educational content and independently verify any real-world decision.

## Project status

This remains an early-stage project. CI runs TypeScript checks, tests, the production build, and `npm audit` on supported Node versions. The lockfile is committed for reproducible installs. There is no authentication, persistent user account system, distributed rate limiting, or claim of production-scale availability.

## Contributing and security

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the local validation workflow and [SECURITY.md](./SECURITY.md) for the security boundary and responsible disclosure guidance. Please do not include API keys or private user data in issues or pull requests.

## License

Apache-2.0. See [LICENSE](./LICENSE).
