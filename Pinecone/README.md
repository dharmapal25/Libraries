# Pinecone + Gemini (Google GenAI) Quickstart

This repository contains a small example showing how to generate embeddings with Google Gemini (via `@google/genai`) and store / query them in Pinecone using the `@pinecone-database/pinecone` client. The goal of this README is to provide a clean, production-oriented, step-by-step guide to get the project running and to explain the architecture, environment configuration, and operational considerations.

---

## Overview

- **Tech stack:** Node.js, Express, Google GenAI (Gemini) embeddings, Pinecone vector DB.
- **Core file:** `app.js` — demonstrates embedding generation, upsert, and query flows.
- **Purpose:** Show how to embed text, store vector records in a Pinecone index, and query for similar content to pass to an LLM.

## Prerequisites

- Node.js (v16+ recommended)
- A Pinecone account and an index created (or ability to create one)
- Google Cloud project and API access to Gemini (or another embeddings provider)
- Local environment with access to your API keys (we use a `.env` file)

## Project files

- `app.js` — example code that: creates embeddings, upserts vectors to Pinecone, and queries the index.
- `package.json` — shows required dependencies: `@pinecone-database/pinecone`, `@google/genai`, `express`, `dotenv`, etc.

## Environment variables (.env)

Create a `.env` file in the `Pinecone` folder (do NOT commit this file). At minimum set:

```
PINECONE_API_KEY=your_pinecone_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
PINECONE_INDEX=demo-index
PORT=3000
```

Notes:
- `PINECONE_INDEX` should match the index name you created in the Pinecone console.
- The example `app.js` uses embeddings of dimension `4` (for demonstration). In production, your embedding dimensionality will be determined by the model you use.

## Install

From the `Pinecone` folder, run:

```bash
npm install
```

To run with automatic reload in development (if you have `nodemon` installed globally):

```bash
npx nodemon app.js
```

Or run directly:

```bash
node app.js
```

## Pinecone index setup (console)

1. Sign into Pinecone and create a project (if needed).
2. Create an index with a name that matches `PINECONE_INDEX` (the example uses `demo-index`).
3. Choose metric (e.g., `cosine` or `dot`) and set the index dimensionality to match your embedding vectors.
   - In `app.js` the sample embedding returns 4-d vectors (configurable). In production, common sizes are 1536, 512, etc. Use the real model output dimension.
4. Note the region/environment if the SDK requires it (some SDKs need environment or baseURL configuration).

## How the example works (high level)

- Input text → embed via Google Gemini embedding model → receive numeric vector (embedding)
- Upsert the vector into Pinecone with `id`, `values`, and `metadata` (text or other fields)
- Query Pinecone with a vector (from new input) → Pinecone returns nearest matches + metadata
- Use returned metadata / documents with an LLM to generate final answers

The `app.js` file demonstrates two functions:

- `demoVectorDB()` — shows manual upsert and query using fixed vectors.
- `pinconeDB()` — generates an embedding via Gemini, upserts it, then queries Pinecone.

## Example: What to expect from `app.js`

- On start, `pinconeDB()` is invoked (this generates an embedding for the sample text `explain react`, upserts it, then queries for top-k similar items).
- Logs will show the embedding response and query matches in the console.

If you prefer to only run the sample index inspector and manual upsert, comment/uncomment the calls at the bottom of `app.js` (`pinconeDB()` vs `demoVectorDB()`).

## Running in production (recommendations)

- Do not hardcode API keys — use secure environment stores (e.g., cloud secret manager).
- Use a proper runtime process manager (systemd, PM2, or container orchestration) rather than running `node` directly.
- Set up health checks and monitoring (CPU, memory, request latencies) and log aggregation.
- Configure retries and backoff for calls to external services (Gemini, Pinecone).
- Tune Pinecone index configuration (replicas, pod type) based on production query volume and latency requirements.

## Security and cost control

- Keep keys secret and rotate periodically.
- Limit permissions of the API keys to only what is required.
- Monitor usage/costs for both Pinecone and Google GenAI.

## Troubleshooting

- `Authorization` errors: confirm API keys are set and active.
- `Dimension mismatch` errors: ensure the index dimension matches embedding output dimensionality.
- Empty query results: check that the vector was upserted successfully and that query `topK` is not zero.
- SDK or network errors: implement retry/backoff and inspect logs for timeouts.

