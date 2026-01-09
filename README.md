This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# KeraMind.ai

## 1. What is KeraMind?

KeraMind is a cognitive intelligence platform that helps users understand, structure, and improve their thinking over time.

Unlike traditional AI chat tools that provide isolated responses, KeraMind builds a persistent model of the user’s goals, beliefs, decisions, and mental patterns. It visualizes thinking, detects contradictions and biases, and supports better long-term decision-making.

KeraMind is not a chatbot.
It is a cognitive operating system layered on top of AI.

---

## 2. The Problem We Solve

### Current problems with AI tools:
- Conversations are stateless and ephemeral.
- Users get advice but no long-term clarity.
- No memory of goals, values, or past decisions.
- No structure — everything is linear text.
- No self-awareness or contradiction detection.

### Result:
People use AI repeatedly but do not become clearer, more consistent, or better decision-makers.

### KeraMind solves:
- Mental chaos → structured thought
- Shallow answers → deep understanding
- Forgetfulness → continuity
- Bias and blind spots → awareness

---

## 3. How KeraMind Works

### Core pipeline:

1. User inputs thoughts, goals, decisions, or questions.
2. AI extracts:
   - Concepts
   - Intentions
   - Values
   - Assumptions
   - Emotional tone
3. These are stored in a structured cognitive graph.
4. System analyzes:
   - Contradictions
   - Biases
   - Repeated patterns
   - Conflicting goals
5. KeraMind:
   - Visualizes the thought structure
   - Provides insight
   - Updates the user’s cognitive model

---

## 4. User Onboarding Flow

### Step 1: Welcome
User learns:
- KeraMind helps you think better, not just answer questions.

### Step 2: Initial Cognitive Snapshot
User answers 5 short questions:
- Current main goal
- Biggest challenge
- What they feel confused about
- Risk tolerance (low/medium/high)
- Time horizon (short/long-term)

### Step 3: First Thought Capture
User writes a free-form paragraph about what’s on their mind.

System builds:
- First cognitive map
- Initial belief graph

### Step 4: Dashboard
User sees:
- Thought map
- Detected assumptions
- Possible contradictions
- Suggested next reflections

---

## 5. Features

### Core Features (MVP)
- Thought input (text-based)
- Concept extraction
- Cognitive graph generation
- Contradiction detection
- Bias detection (basic)
- Visual thought map
- Persistent user model

### Phase 2
- Decision simulator
- Growth timeline
- Value tracking
- Pattern detection
- Reminders & follow-ups

### Phase 3
- Multi-domain thinking (career, health, relationships)
- Private encrypted memory
- AI coach mode
- Exportable reports

---

## 6. System Design (Developer Section)

### High-Level Architecture

Frontend (Next.js) → API Layer → AI Layer → Cognitive Engine → Storage → Visualization

---

### Core Components

#### 1. Frontend (Next.js)
- App Router
- Tailwind + ShadCN UI
- D3 or React Flow for graph visualization

Responsibilities:
- User input
- Visualization
- Onboarding
- Dashboard

---

#### 2. API Layer
- Next.js API routes or separate Node/Express service
- Handles:
  - Authentication
  - Rate limiting
  - Validation
  - Orchestration

---

#### 3. AI Layer
- LLM calls for:
  - Concept extraction
  - Bias classification
  - Contradiction detection
- Prompt templates versioned and tested

---

#### 4. Cognitive Engine (Core logic)
- Converts AI output into:
  - Nodes (beliefs, goals, fears)
  - Edges (supports, conflicts, causes)
- Maintains:
  - User cognitive graph
  - Temporal history

---

#### 5. Storage
- PostgreSQL for relational data (users, sessions, metadata)
- Graph DB (Neo4j) or Postgres with adjacency tables for cognition graph
- Redis for caching and sessions

---

## 7. Scalability & Optimization

### Performance
- Cache AI responses
- Async background processing for heavy analysis
- Stream responses to UI

### Scalability
- Stateless API
- Queue-based AI processing (BullMQ / SQS)
- Horizontal scaling on serverless or containers

### Cost Optimization
- Only run deep analysis when necessary
- Use cheap models for extraction, expensive ones for reasoning
- Store processed outputs, not raw text

---

## 8. Tech Stack

| Layer | Tech |
|------|------|
Frontend | Next.js, Tailwind, ShadCN, React Flow |
Backend | Node.js, Express / Next API |
AI | OpenAI / Claude / local models |
DB | PostgreSQL, Neo4j |
Cache | Redis |
Queue | BullMQ |
Auth | NextAuth / Clerk |
Hosting | Vercel + Railway / AWS |

---

## 9. Security & Privacy

- All data encrypted at rest
- User owns their cognitive data
- No training on user data
- Export & delete anytime

---

## 10. Guiding Principles

- Clarity over features
- Depth over breadth
- User trust over monetization
- Reflection over automation

KeraMind is designed to help humans think better — not outsource thinking.
