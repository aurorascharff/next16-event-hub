/* eslint-disable no-console */

// --- PostgreSQL (Vercel) ---
// import { PrismaPg } from '@prisma/adapter-pg';
// import dotenv from 'dotenv';
// import { PrismaClient } from '../generated/prisma/client';
//
// dotenv.config({ path: '.env.local' });
// const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_URL_NON_POOLING });
// const prisma = new PrismaClient({ adapter });

// --- SQLite (local dev) ---
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const events = [
  // Day 1
  {
    day: 'day-1',
    description:
      'Kick off ReactConf with drinks, music, and good company. Meet fellow attendees and speakers before the talks begin.',
    labels: 'social',
    location: 'Lobby & Terrace',
    name: 'Welcome Reception',
    slug: 'welcome-reception',
    speaker: 'Organizers',
    time: '6:30 PM',
  },
  {
    day: 'day-1',
    description:
      "Much of the user experience happens in the moments between actions and the final UI. Page loads, navigations, filtering, and form submissions involve multiple steps where data and code arrive at different times, and handling these intermediate states is essential to keeping interfaces smooth and predictable. This session demonstrates how Async React makes these in-between states manageable. We'll explore patterns like Suspense, optimistic updates, and streaming, and show how caching, prerendering, and animations can smooth or remove intermediate states.",
    labels: 'react,performance',
    location: 'Main Stage',
    name: 'Designing the In-Between States with Async React',
    slug: 'in-between-states',
    speaker: 'Aurora Scharff',
    time: '9:15 AM',
  },
  {
    day: 'day-1',
    description:
      'Suspense boundaries define where your app shows fallback UI. But placing them wrong causes layout shifts, flash-of-loading, or waterfall fetches. This talk builds intuition for where boundaries belong and why getting it wrong makes everything feel slower.',
    labels: 'react,performance',
    location: 'Main Stage',
    name: 'Suspense Boundaries: Where to Draw the Line',
    slug: 'suspense-boundaries',
    speaker: 'Speaker A',
    time: '9:40 AM',
  },
  {
    day: 'day-1',
    description:
      "Server Actions let you call server code from JSX like a function. But what happens under the hood? We'll trace a form submission from the client through the framework, watch it serialize, execute, and return — and show the edge cases that trip people up.",
    labels: 'react',
    location: 'Main Stage',
    name: 'Server Actions Under the Hood',
    slug: 'server-actions-under-the-hood',
    speaker: 'Speaker B',
    time: '10:05 AM',
  },
  {
    day: 'day-1',
    description:
      "useOptimistic sounds simple — update the UI before the server responds. But what about rollbacks, race conditions, and stale closures? We'll build a real-world optimistic flow from scratch, break it in every way possible, and fix each case.",
    labels: 'react,performance',
    location: 'Main Stage',
    name: 'Optimistic UI: The Happy Path and Every Sad One',
    slug: 'optimistic-ui',
    speaker: 'Speaker C',
    time: '11:00 AM',
  },
  {
    day: 'day-1',
    description:
      'React Server Components stream HTML from the server, but CSS still blocks rendering. This talk shows how to co-locate styles with RSC, avoid FOUC, and keep your CSS budget under control with Tailwind, CSS Modules, and zero-runtime CSS-in-JS.',
    labels: 'react,css',
    location: 'Main Stage',
    name: 'Styling in the Age of Server Components',
    slug: 'styling-server-components',
    speaker: 'Speaker D',
    time: '11:25 AM',
  },
  {
    day: 'day-1',
    description:
      "The React Compiler rewrites your components at build time. But what is it actually doing? We'll decompile the output, compare it to hand-optimized code, find the cases where it's smarter than you, and the cases where it makes things worse.",
    labels: 'react,performance,tooling',
    location: 'Main Stage',
    name: 'Inside the React Compiler',
    slug: 'inside-react-compiler',
    speaker: 'Speaker E',
    time: '11:50 AM',
  },
  {
    day: 'day-1',
    description:
      "Page transitions in React used to require third-party libraries and layout tricks. The View Transition API changes everything — native crossfades, shared element animations, and directional slides. We'll build a full navigation experience from scratch.",
    labels: 'react,css',
    location: 'Main Stage',
    name: 'View Transitions in React',
    slug: 'view-transitions-react',
    speaker: 'Speaker F',
    time: '1:40 PM',
  },
  {
    day: 'day-1',
    description:
      "TypeScript doesn't just catch bugs — it shapes how you think about components. This talk explores advanced patterns: discriminated unions for component props, const assertions for route configs, template literal types for CSS utilities, and satisfies for type-safe defaults.",
    labels: 'react,typescript',
    location: 'Main Stage',
    name: 'TypeScript Patterns for React Developers',
    slug: 'typescript-patterns-react',
    speaker: 'Speaker G',
    time: '2:05 PM',
  },
  {
    day: 'day-1',
    description:
      'Every AI coding assistant generates React — but most of it is mediocre. This talk covers prompt patterns that produce production-quality components, when to trust the output, and the component architecture decisions AI consistently gets wrong.',
    labels: 'react,ai',
    location: 'Main Stage',
    name: 'AI-Generated React: Good, Bad, and Dangerous',
    slug: 'ai-generated-react',
    speaker: 'Speaker H',
    time: '2:30 PM',
  },
  {
    day: 'day-1',
    description:
      "Accessibility isn't a checklist — it's a design constraint that makes components better for everyone. We'll take five common React components (modal, dropdown, tabs, toast, combobox) and make them fully accessible, explaining every ARIA attribute along the way.",
    labels: 'react,design',
    location: 'Main Stage',
    name: 'Accessible Components from Scratch',
    slug: 'accessible-components',
    speaker: 'Speaker I',
    time: '2:55 PM',
  },
  {
    day: 'day-1',
    description:
      "Your bundle is 400kb and you don't know why. We'll use source-map-explorer, the React DevTools profiler, and Lighthouse to find the three imports that account for 60% of the weight, replace them, and measure the real-world difference on a 3G connection.",
    labels: 'performance,tooling',
    location: 'Main Stage',
    name: 'Bundle Forensics: Finding the Weight',
    slug: 'bundle-forensics',
    speaker: 'Speaker J',
    time: '3:50 PM',
  },
  {
    day: 'day-1',
    description:
      "React Native and React for the web keep converging. Shared components, shared routing, shared state. This talk shows how to build a component library that works on both platforms — the patterns that transfer cleanly and the ones that don't.",
    labels: 'react,mobile',
    location: 'Main Stage',
    name: 'One Codebase, Two Platforms',
    slug: 'one-codebase-two-platforms',
    speaker: 'Speaker K',
    time: '4:15 PM',
  },
  {
    day: 'day-1',
    description:
      "XSS in React isn't just dangerouslySetInnerHTML. Server Components introduce new attack surfaces — serialized props, streamed HTML, server action inputs. We'll exploit each one live, then fix them with validation, sanitization, and content security policies.",
    labels: 'react,security',
    location: 'Main Stage',
    name: 'Hacking React: XSS in the RSC Era',
    slug: 'hacking-react-xss',
    speaker: 'Speaker L',
    time: '4:40 PM',
  },
  {
    day: 'day-1',
    description:
      'Side projects keep you sharp. This is a rapid-fire tour of weird React experiments — a custom renderer for terminal UIs, a hook that syncs state via sound waves, and a component that renders differently based on the current moon phase.',
    labels: 'react',
    location: 'Main Stage',
    name: 'Weird React: A Lightning Tour',
    slug: 'weird-react',
    speaker: 'Speaker M',
    time: '5:05 PM',
  },
  {
    day: 'day-1',
    description: 'Board games, trivia, and karaoke hosted by the community. All skill levels welcome.',
    labels: 'social',
    location: 'Hotel Lounge',
    name: 'Community Game Night',
    slug: 'community-game-night',
    speaker: 'Community Leads',
    time: '7:00 PM',
  },

  // Day 2
  {
    day: 'day-2',
    description: 'Start your morning with a group run or yoga session. Coffee provided at the finish line.',
    labels: 'social',
    location: 'Waterfront Park',
    name: 'Morning Run & Yoga',
    slug: 'morning-run-yoga',
    speaker: 'Organizers',
    time: '7:30 AM',
  },
  {
    day: 'day-2',
    description:
      "useState and useReducer solve local problems. But when state needs to sync across tabs, persist to disk, and replicate to a server, you need something else. We'll build a collaborative React app using a local-first sync engine and explore the tradeoffs.",
    labels: 'react',
    location: 'Main Stage',
    name: 'Local-First React: State That Survives Anything',
    slug: 'local-first-react',
    speaker: 'Speaker N',
    time: '9:15 AM',
  },
  {
    day: 'day-2',
    description:
      'Forms are the hardest part of React. Validation, server errors, optimistic submission, pending states, progressive enhancement — getting all of these right simultaneously is brutal. This talk builds a form from zero that handles every case, using only React 19 primitives.',
    labels: 'react',
    location: 'Main Stage',
    name: "The Last Form Talk You'll Ever Need",
    slug: 'last-form-talk',
    speaker: 'Speaker O',
    time: '9:40 AM',
  },
  {
    day: 'day-2',
    description:
      "AI agents that browse your React app need more than pretty HTML. They need structured data, semantic landmarks, and machine-readable actions. We'll add MCP tooling and llms.txt to a Next.js app and watch an AI agent navigate it autonomously.",
    labels: 'react,ai',
    location: 'Main Stage',
    name: 'Building React Apps for AI Agents',
    slug: 'react-apps-ai-agents',
    speaker: 'Speaker P',
    time: '10:05 AM',
  },
  {
    day: 'day-2',
    description:
      "Streaming SSR sends HTML to the browser as it's generated. But streaming interacts with caching, error boundaries, and Suspense in ways that aren't obvious. This deep dive shows exactly what the server sends, when, and how to control it.",
    labels: 'react,performance',
    location: 'Main Stage',
    name: 'Streaming SSR: What the Server Actually Sends',
    slug: 'streaming-ssr',
    speaker: 'Speaker Q',
    time: '11:00 AM',
  },
  {
    day: 'day-2',
    description:
      "Your CI takes 12 minutes. TypeScript says 'type too complex to represent.' Your editor lags on a 200-line file. These are all the same problem. We'll use --generateTrace, find the expensive types, and cut type-check time by 60%.",
    labels: 'typescript,tooling',
    location: 'Main Stage',
    name: 'Why TypeScript Is Slow (And How to Fix It)',
    slug: 'typescript-slow',
    speaker: 'Speaker R',
    time: '11:25 AM',
  },
  {
    day: 'day-2',
    description:
      'Streaming AI responses into React components sounds easy until you try it. Tokens arrive one at a time, tool calls mutate state, and agents loop unpredictably. This talk shows the guardrails, patterns, and component boundaries that make agentic UIs stable.',
    labels: 'react,ai',
    location: 'Main Stage',
    name: 'Agentic UIs in React',
    slug: 'agentic-uis-react',
    speaker: 'Speaker S',
    time: '11:50 AM',
  },
  {
    day: 'day-2',
    description:
      "You don't need a state management library. You probably don't need a form library either. React 19 ships with useOptimistic, useActionState, use(), and Server Actions. This talk migrates a real app from Redux + React Hook Form to zero dependencies.",
    labels: 'react',
    location: 'Main Stage',
    name: 'Zero Dependencies: React 19 Is Enough',
    slug: 'zero-dependencies',
    speaker: 'Speaker T',
    time: '12:15 PM',
  },
  {
    day: 'day-2',
    description:
      "Tailwind v4 is a full rewrite. New engine, new config format, CSS-first configuration, and first-class container queries. We'll migrate a React component library from v3 to v4 live, covering every breaking change and the new features that make it worth it.",
    labels: 'css,tooling',
    location: 'Main Stage',
    name: 'Migrating to Tailwind v4',
    slug: 'migrating-tailwind-v4',
    speaker: 'Speaker U',
    time: '2:05 PM',
  },
  {
    day: 'day-2',
    description:
      'Design systems promise consistency but deliver rigidity. When every component is a black box, teams hack around it with wrapper divs and !important overrides. This talk presents a component API philosophy that stays flexible without breaking design constraints.',
    labels: 'react,design',
    location: 'Main Stage',
    name: "Design Systems That Don't Get in the Way",
    slug: 'design-systems',
    speaker: 'Speaker V',
    time: '2:30 PM',
  },
  {
    day: 'day-2',
    description:
      "Testing React components shouldn't be painful. This talk shows a practical approach: what to test (behavior, not implementation), how to structure test files alongside components, and how AI test generation actually performs on a real codebase.",
    labels: 'react,tooling',
    location: 'Main Stage',
    name: 'Testing React Without Losing Your Mind',
    slug: 'testing-react',
    speaker: 'Speaker W',
    time: '2:55 PM',
  },
  {
    day: 'day-2',
    description:
      "Server Components aren't just a React feature — they're an architecture. This talk explores what happens when you take RSC seriously: streaming HTML from the edge, zero-JS interactive islands, and a mental model that finally makes the server/client boundary feel natural.",
    labels: 'react,performance',
    location: 'Main Stage',
    name: 'Server Components as Architecture',
    slug: 'rsc-architecture',
    speaker: 'Speaker X',
    time: '3:20 PM',
  },
  {
    day: 'day-2',
    description: 'Celebrate the end of the conference! DJ set, drinks, and good vibes.',
    labels: 'social',
    location: 'Rooftop',
    name: 'Closing Party',
    slug: 'closing-party',
    speaker: 'Organizers',
    time: '7:00 PM',
  },
];

async function main() {
  console.log('Seeding database...');

  await prisma.commentLike.deleteMany();
  await prisma.questionVote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.event.deleteMany();

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  const demoSlug = 'in-between-states';

  await prisma.comment.createMany({
    data: [
      {
        content: 'Testing comments before the talk — making sure everything works!',
        eventSlug: demoSlug,
        userName: 'Aurora',
      },
      { content: 'The skeleton fallbacks look great on the projector.', eventSlug: demoSlug, userName: 'Aurora' },
      { content: 'This is a test comment to verify the delete flow.', eventSlug: demoSlug, userName: 'Aurora' },
    ],
  });

  await prisma.question.createMany({
    data: [
      {
        content: 'How does useOptimistic handle rollback on error?',
        eventSlug: demoSlug,
        userName: 'Aurora',
        votes: 3,
      },
      { content: 'Can ViewTransition work with CSS modules?', eventSlug: demoSlug, userName: 'Aurora', votes: 1 },
      {
        content: 'What happens when two transitions run at the same time?',
        eventSlug: demoSlug,
        userName: 'Aurora',
        votes: 0,
      },
    ],
  });

  await prisma.favorite.create({
    data: { eventSlug: demoSlug, userName: 'Aurora' },
  });

  console.log(`Seeded ${events.length} events + demo comments/questions/favorite from Aurora`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
