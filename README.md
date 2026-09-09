# 👻 Ghost Interviewer

> **An AI-powered, real-time technical interview platform that feels like a real interview — not another chatbot.**

Ghost Interviewer is being built as a production-grade interview system where an AI interviewer can conduct technical interviews, ask adaptive follow-up questions, evaluate coding and communication, and produce a structured post-interview report.

## Vision

A candidate should be able to open a browser and experience a realistic technical interview:

**Brief → Interview → Coding → Follow-ups → Evaluation → Report**

The AI should not simply dump questions. It should react to the candidate's answers and adapt the interview dynamically.

## Core Experience

- 🎙️ AI interviewer with voice interaction
- 💻 Browser-based coding environment
- 🧠 Adaptive questioning and follow-ups
- 📹 Optional camera/microphone based interview mode
- ⚡ Real-time interview events
- 📊 Structured interview evaluation
- 📝 Detailed post-interview report
- 🔐 Secure sessions and authentication

## Engineering Goals

This project is intentionally designed to demonstrate engineering depth beyond a typical CRUD/MERN application.

- Real-time communication with WebSockets
- Streaming audio/video architecture
- LLM orchestration and tool calling
- Stateful interview sessions
- Event-driven backend workflows
- Redis for ephemeral state, caching and coordination
- Background jobs for expensive work
- Strong API contracts and validation
- Observability, rate limiting and security
- Dockerized local development
- CI/CD and production deployment
- Load testing and performance engineering

## High-Level Architecture

```text
                    ┌──────────────────────┐
                    │       Browser        │
                    │  React + Interview UI│
                    └──────────┬───────────┘
                               │
                    HTTPS / WebSocket / WebRTC
                               │
                    ┌──────────▼───────────┐
                    │    API / Gateway     │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
   ┌──────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐
   │ Interview   │      │ Realtime    │      │ Auth &      │
   │ Orchestrator│      │ Service     │      │ Sessions    │
   └──────┬──────┘      └──────┬──────┘      └─────────────┘
          │                    │
          │             ┌──────▼──────┐
          │             │    Redis    │
          │             └─────────────┘
          │
   ┌──────▼──────────────────────────┐
   │       Async Job / Worker        │
   │ reports • evaluation • media    │
   └──────┬──────────────────────────┘
          │
   ┌──────▼───────┐       ┌──────────────┐
   │   Database   │       │   LLM APIs   │
   │ PostgreSQL   │       │ interviewer + │
   │ + event data │       │ evaluation    │
   └──────────────┘       └──────────────┘
```

## Database & Local Development

Ghost Interviewer now uses **PostgreSQL with Prisma** for durable interview state.

### Why PostgreSQL?

Interview data is relational and strongly structured:

```text
Candidate
   ↓ 1:N
Interview
   ↓ 1:N
InterviewEvent
```

The event table stores the interview timeline as immutable records. This gives us a foundation for replay, auditing, evaluation, and recovery after reconnects.

### Start PostgreSQL

```bash
pnpm install
docker compose up -d postgres
```

### Configure the API

```bash
cp apps/api/.env.example apps/api/.env
```

The default local connection is:

```text
postgresql://ghost:ghost@localhost:5432/ghost_interviewer?schema=public
```

### Generate Prisma client and run migrations

```bash
cd apps/api
pnpm db:generate
pnpm db:migrate
```

### Start the application

From the repository root:

```bash
pnpm dev
```

The frontend runs on `http://localhost:5173` and the API on `http://localhost:4000`.

## API Shape

```text
POST /api/v1/interviews
GET  /api/v1/interviews/:id
POST /api/v1/interviews/:id/transition
```

The route layer does not talk to Prisma directly:

```text
Route
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
```

This separation keeps transport logic independent from persistence and makes the interview engine easier to evolve.

## Interview State Machine

```text
CREATED
   ↓
READY
   ↓
INTRO
   ↓
QUESTIONING
   ├──→ FOLLOW_UP ──┐
   ├──→ CODING ─────┤
   └──→ EVALUATING  │
                    ↓
               EVALUATING
                    ↓
                COMPLETED
```

Invalid state transitions are rejected by the service layer instead of being left to the client.

## Planned Stack

### Frontend

- React + TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- Monaco Editor
- Web APIs / WebRTC

### Backend

- Node.js + TypeScript
- Fastify
- PostgreSQL + Prisma
- Redis
- WebSockets
- Background workers

### AI

- LLM-based interviewer orchestration
- Structured outputs for evaluation
- Tool/function calling
- Conversation state management
- Voice pipeline integration

### Infrastructure

- Docker
- GitHub Actions
- Reverse proxy / TLS
- Centralized logging
- Metrics + tracing
- Load testing

## Development Principles

1. **Build the smallest real product first.**
2. **Every major technical choice must solve an actual problem.**
3. **Prefer measurable performance over premature complexity.**
4. **Keep the architecture understandable enough to explain in an interview.**
5. **Treat security, observability and failure handling as first-class features.**

## Roadmap

### Phase 1 — Foundation ✅

- Repository structure
- TypeScript setup
- Frontend shell
- Backend service
- Shared contracts
- Local Docker environment

### Phase 2 — Interview Engine 🚧

- Persistent interview sessions
- Interview state machine
- Event timeline
- Question bank
- AI interviewer orchestration
- Candidate response handling

### Phase 3 — Coding Interviews

- Monaco editor
- Problem execution sandbox
- Test cases
- Code submission events
- Evaluation pipeline

### Phase 4 — Realtime + Voice

- WebSocket event protocol
- Speech input/output
- Streaming interaction
- Connection recovery

### Phase 5 — Evaluation

- Rubrics
- Competency scoring
- Interview summary
- Candidate report
- Analytics

### Phase 6 — Production Engineering

- Redis scaling
- Worker queues
- Observability
- Rate limiting
- Load testing
- CI/CD
- Production deployment

## Project Status

🚧 **Interview Engine — persistence and event infrastructure implemented; migrations next.**

---

Built to answer one question:

> **Can we make an AI interview feel genuinely human while engineering it like a real distributed product?**
