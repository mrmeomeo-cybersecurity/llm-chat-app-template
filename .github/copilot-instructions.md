# Copilot Instructions

## Project Overview

This repository is an **LLM Chat Application Template** powered by Cloudflare Workers AI. It provides a ready-to-deploy chat interface with real-time streaming responses using Server-Sent Events (SSE).

## Tech Stack

- **Runtime**: [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- **AI**: [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) — default model: `@cf/meta/llama-3.1-8b-instruct-fp8`
- **Language**: TypeScript
- **Build/Dev tooling**: [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (v4)
- **Testing**: [Vitest](https://vitest.dev/) with `@cloudflare/vitest-pool-workers`
- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)

## Project Structure

```
/
├── public/             # Static frontend assets served via the ASSETS binding
│   ├── index.html      # Chat UI
│   └── chat.js         # Frontend script for streaming chat
├── src/
│   ├── index.ts        # Cloudflare Worker entry point — routes requests and handles /api/chat
│   └── types.ts        # TypeScript interfaces (Env, ChatMessage)
├── .github/
│   └── workflows/      # GitHub Actions workflows
├── wrangler.jsonc      # Cloudflare Worker configuration (bindings, compatibility flags, assets)
├── tsconfig.json       # TypeScript configuration
└── package.json        # Scripts and dev dependencies
```

## Key Architectural Decisions

- **Single Worker**: All API and static-asset serving is handled by one Cloudflare Worker (`src/index.ts`).
- **Streaming via SSE**: `/api/chat` streams AI responses using `text/event-stream` (SSE). The `AI.run()` call passes `stream: true` and the raw stream is forwarded directly to the client.
- **Client-side chat history**: Message history is maintained in the browser; every request sends the full conversation to the Worker.
- **AI Gateway (optional)**: The code includes commented-out gateway configuration in `src/index.ts` for enabling Cloudflare AI Gateway (caching, rate limiting, analytics).

## Common Commands

```bash
# Install dependencies
npm install

# Generate TypeScript types from wrangler bindings
npm run cf-typegen

# Start local dev server (uses live Cloudflare AI — incurs usage)
npm run dev

# Type-check and dry-run deploy
npm run check

# Run tests
npm test

# Deploy to Cloudflare Workers
npm run deploy
```

## Coding Conventions

- Use **TypeScript** for all Worker code in `src/`. Keep types in `src/types.ts`.
- Export the default handler using `satisfies ExportedHandler<Env>` pattern.
- Keep API routes under `/api/` and static assets served via `env.ASSETS.fetch(request)`.
- Use `console.error` for error logging (captured by Cloudflare Observability).
- Do not commit secrets or account-specific IDs (e.g., AI Gateway IDs) — leave them as placeholders in comments.
- Follow the existing JSDoc comment style for functions and modules.

## Testing

Tests live in the `test/` directory and use `vitest` with the Cloudflare Workers pool. Run tests with:

```bash
npm test
```

The `wrangler.jsonc` compatibility flags (`nodejs_compat`, `global_fetch_strictly_public`) must be respected in tests.

## Deployment

The app deploys to Cloudflare Workers via:

```bash
npm run deploy
```

Ensure `wrangler.jsonc` is configured with the correct account and zone settings before deploying.
