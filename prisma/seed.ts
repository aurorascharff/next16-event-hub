/* eslint-disable no-console */

// --- PostgreSQL (Vercel) ---
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/client';

dotenv.config({ path: '.env.local' });
const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_URL_NON_POOLING });
const prisma = new PrismaClient({ adapter });

// --- SQLite (local dev) ---
// import { PrismaLibSql } from '@prisma/adapter-libsql';
// import { PrismaClient } from '../generated/prisma/client';
//
// const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
// const prisma = new PrismaClient({ adapter });

const events = [
  // Day 1
  {
    day: 'day-1',
    description:
      'Kick off React Miami 2026 with drinks, music, and great company at Cerveceria La Tropical. Meet fellow attendees and speakers before the conference begins.',
    labels: 'social',
    location: 'Cerveceria La Tropical',
    name: 'Opening Party',
    slug: 'opening-party',
    speaker: 'React Miami Team',
    time: '6:30 PM',
  },
  {
    day: 'day-1',
    description:
      "Much of the user experience happens in the moments between actions and the final UI. Page loads, navigations, filtering, and form submissions involve multiple steps where data and code arrive at different times, and handling these intermediate states is essential to keeping interfaces smooth and predictable. This session demonstrates how Async React makes these in-between states manageable. In the context of Next.js, we'll explore patterns like Suspense, optimistic updates, and streaming, and show how caching, prerendering, and animations can smooth or remove intermediate states, making page updates, navigation, and interactions feel fast, reliable, and polished.",
    labels: 'react,performance',
    location: 'Hyatt Regency Miami',
    name: 'Designing the In-Between States with Async React',
    slug: 'in-between-states',
    speaker: 'Aurora Scharff',
    time: '9:15 AM',
  },
  {
    day: 'day-1',
    description:
      "React isn't trying to do more. It's trying to do what we already do, but better. In this talk, we'll explore new hooks like use and useEventEffect, View Transitions, Partial Prerendering, and the React Compiler. We'll look at the real problems they solve, how they're reshaping application architecture, and what we can expect heading into 2027. This talk will be presented in Spanish.",
    labels: 'react',
    location: 'Hyatt Regency Miami',
    name: 'El futuro de React es ahora',
    slug: 'futuro-de-react',
    speaker: 'Miguel Ángel Durán',
    time: '9:40 AM',
  },
  {
    day: 'day-1',
    description:
      "React Router turns 12 this year. After eight major versions we learned how to add features our users want while stripping away old APIs without leaving everyone stranded. This release focuses on better type safety, first-class middleware, RSC support, and much more. I'll cover the key changes in v8, how open governance influenced the release, and a practical upgrade plan with common pitfalls.",
    labels: 'react,tooling',
    location: 'Hyatt Regency Miami',
    name: 'React Router v8 and Beyond',
    slug: 'react-router-v8',
    speaker: 'Brooks Lybrand',
    time: '10:05 AM',
  },
  {
    day: 'day-1',
    description:
      "We'll look at how engineering teams can introduce React Native and JS into mature, native-only applications. The session walks through practical strategies for phased adoption, cutting-edge tooling, and effective architectural choices. We'll dig into the real challenges that come with hybrid integration and wrap up with advanced areas like brownfield state and data exchange.",
    labels: 'mobile',
    location: 'Hyatt Regency Miami',
    name: 'State of Brownfield in React Native',
    slug: 'brownfield-react-native',
    speaker: 'Artur Morys-Magiera',
    time: '11:00 AM',
  },
  {
    day: 'day-1',
    description:
      "React is an excellent framework from a security standpoint, but you need to remain vigilant. Join me in hacking a React application to better understand threats like XSS, injection attacks, and other dangers. You'll learn how React already keeps you secure, and where you need to be the last line of defence. Together, we'll learn how to keep your users secure!",
    labels: 'react,security',
    location: 'Hyatt Regency Miami',
    name: 'React with Caution — How to Hack Your React App (And Fix It Too)',
    slug: 'react-with-caution',
    speaker: 'Ramona Schwering',
    time: '11:25 AM',
  },
  {
    day: 'day-1',
    description:
      "Performance problems in React apps often come from perfectly \"valid\" code: context updates that rerender too much, event handlers that change identity, or state that's too reactive. While preparing the first stable release of Base UI, we had to confront these issues head-on. I'll show concrete patterns we used to eliminate unnecessary re-renders and move work out of React's render cycle.",
    labels: 'react,performance',
    location: 'Hyatt Regency Miami',
    name: 'What we learned optimizing Base UI',
    slug: 'optimizing-base-ui',
    speaker: 'Michał Dudak',
    time: '11:50 AM',
  },
  {
    day: 'day-1',
    description:
      "What if you could ship native iOS Live Activities and Dynamic Island experiences without writing a single line of Swift? This talk tells the story of Voltra, a library born from a viral tweet to bridge the gap between React and native iOS extensions. We'll go behind the scenes of building a custom React renderer from scratch to translate JSX into SwiftUI primitives.",
    labels: 'mobile',
    location: 'Hyatt Regency Miami',
    name: 'JSX to Live Activity: The Story of Voltra',
    slug: 'jsx-to-live-activity',
    speaker: 'Szymon Chmal',
    time: '1:40 PM',
  },
  {
    day: 'day-1',
    description:
      "React's useState() can only be used for temporary, frontend state. To interact with important objects in your app, you usually have to query a backend and use state to hold results. In this talk we'll explore how sync engines and local-first databases give you global, persistent reactive state — as if you had a local plus cloud database that looked like useState(), without worrying about networking.",
    labels: 'react',
    location: 'Hyatt Regency Miami',
    name: 'What if useState() was your database?',
    slug: 'usestate-database',
    speaker: 'Anselm Eickhoff',
    time: '2:05 PM',
  },
  {
    day: 'day-1',
    description:
      'Most content on the internet was created for human consumption: Pages, posts, and SEO. But as LLMs and RAG pipelines become part of everyday applications, content needs to be optimized for machines as well. Let\'s explore how React developers can evolve beyond "just rendering" to building generative-ready experiences where content is structured and served in ways that LLMs can reliably retrieve.',
    labels: 'ai,react',
    location: 'Hyatt Regency Miami',
    name: 'Generative-Ready Content with React',
    slug: 'generative-content',
    speaker: 'Facundo Giuliani',
    time: '2:30 PM',
  },
  {
    day: 'day-1',
    description:
      "Ever built a solid React app that works well but lacks personality? We'll explore how to transform functional applications into visually engaging, delightful experiences using React and animation libraries like GSAP. Through practical examples, you'll learn how small, intentional design choices can dramatically enhance user experience without sacrificing performance.",
    labels: 'design',
    location: 'Hyatt Regency Miami',
    name: 'Code, But Make it Cute',
    slug: 'code-but-cute',
    speaker: 'Bree Hall',
    time: '2:55 PM',
  },
  {
    day: 'day-1',
    description:
      "In today's dev economy, whimsy is a survival skill. Learn why building silly software isn't just a side quest, but a useful practice to stay connected, motivated, and sharp.",
    labels: 'design',
    location: 'Hyatt Regency Miami',
    name: 'Whimsy-Driven Development',
    slug: 'whimsy-driven-development',
    speaker: 'Christina Martinez',
    time: '3:50 PM',
  },
  {
    day: 'day-1',
    description:
      "AI radically changed hiring. Anyone can now submit flawless resumes, thoughtful cover letters, and pristine portfolios, but hiring was never about perfection. It's about trust. For companies, hiring is risk. Instead of reducing that risk, AI has obscured the signals used to evaluate it. So what is the reality for you to get hired, and where does AI actually fit in that process?",
    labels: 'ai,career',
    location: 'Hyatt Regency Miami',
    name: 'AI broke hiring...what now?',
    slug: 'ai-broke-hiring',
    speaker: 'Will King',
    time: '4:15 PM',
  },
  {
    day: 'day-1',
    description:
      "Have you ever wondered how Tailwind CSS actually works? We'll explore how thousands of utility classes are generated, the purging techniques that scan your templates to keep bundle sizes small, and how JIT compilation provides unlimited arbitrary values without hurting performance. You'll leave with practical knowledge that you can apply right away!",
    labels: 'css,tooling',
    location: 'Hyatt Regency Miami',
    name: 'Behind the Scenes of Tailwind CSS',
    slug: 'tailwind-behind-scenes',
    speaker: 'Braydon Coyer',
    time: '4:40 PM',
  },
  {
    day: 'day-1',
    description:
      "In the ever changing AI landscape, with so much noise and so little signal, it can be hard to keep up. Between people selling things, delusional takes and downright misinformation, it's hard to really get signal. In this talk I'll be examining the landscape, exploring LLM assisted coding techniques and separating the wheat from the chaff.",
    labels: 'ai',
    location: 'Hyatt Regency Miami',
    name: 'ai is ok i guess',
    slug: 'ai-is-ok',
    speaker: 'Ken Wheeler',
    time: '5:05 PM',
  },
  {
    day: 'day-1',
    description:
      'Wind down after a full day of talks with community-led activities across multiple locations in Miami. Board games, karaoke, networking dinners, and more.',
    labels: 'social',
    location: 'Multiple Locations',
    name: 'Community Activities',
    slug: 'community-activities',
    speaker: 'Community Leads',
    time: '6:30 PM',
  },

  // Day 2
  {
    day: 'day-2',
    description:
      'Start your morning with a 5K run or yoga session at Bayfront Park before the talks begin. All fitness levels welcome.',
    labels: 'social',
    location: 'Bayfront Park',
    name: 'Dev Health 5K + Yoga',
    slug: 'dev-health-5k',
    speaker: 'React Miami Team',
    time: '7:30 AM',
  },
  {
    day: 'day-2',
    description:
      "Last year, I deployed a large-scale React application where I personally wrote less than 1% of the codebase—yet delivered a product that impressed users, managers, and engineers alike. In this session, I'll reveal the workflow: TanStack Query for robust data synchronization, TanStack Router for type-safe routing, HeyAPI for automated API client generation, and AI copilots for the heavy lifting.",
    labels: 'react,ai,tooling',
    location: 'Hyatt Regency Miami',
    name: '10x React Development with TanStack Query, HeyAPI, and AI Copilots',
    slug: 'tanstack-query-heyapi',
    speaker: 'Devlin Duldulao',
    time: '9:15 AM',
  },
  {
    day: 'day-2',
    description:
      "The new React Compiler promises to \"automatically optimize your React app\"... but what is it actually doing to your component? We'll clear up the confusion and provide a solid foundation for understanding when, why, and how React renders. We'll demystify the Compiler's output, break down exactly what that code does, and see how the Compiler rewrites our mindset of using React itself.",
    labels: 'react,performance',
    location: 'Hyatt Regency Miami',
    name: 'A Guide to React Compiler Rendering',
    slug: 'react-compiler-rendering',
    speaker: 'Mark Erikson',
    time: '9:40 AM',
  },
  {
    day: 'day-2',
    description:
      "We are moving from a navigation-based web, where you go to a site, to an intent-based web, where the result comes to you. If the user won't go to your URL, your app has to go to them. Learn about MCP-UI and MCP Apps, an open standard that allows developers to render fully interactive interfaces directly inside AI agents. Your React skills position you to build the mini apps of the agentic era.",
    labels: 'react,ai',
    location: 'Hyatt Regency Miami',
    name: "The Last Website You'll Ever Visit (in the Browser)",
    slug: 'last-website',
    speaker: 'Rizel Scarlett',
    time: '10:05 AM',
  },
  {
    day: 'day-2',
    description:
      "React introduced a generation of developers to functional programming. For me, it was the start of an obsession that sent me down the rabbit hole of learning a new paradigm, working with different languages, shipping a few compilers, implementing a type system, and eventually reimplementing React. I'll share insights that transformed me from someone who uses React to someone who understands why it works.",
    labels: 'react',
    location: 'Hyatt Regency Miami',
    name: 'React From Another Universe',
    slug: 'react-another-universe',
    speaker: 'David Sancho Moreno',
    time: '11:00 AM',
  },
  {
    day: 'day-2',
    description:
      'TypeScript performance problems are one of the most common and least understood sources of pain in large React codebases. These issues quietly slow you down, showing up as sluggish editors, long CI times, and confusing "type too complex" errors. You\'ll learn how to diagnose what\'s actually happening and fix it with tools like --generateTrace, Attest, and TypeSlayer.',
    labels: 'typescript,performance',
    location: 'Hyatt Regency Miami',
    name: 'Solving Your TypeScript Performance Problems',
    slug: 'typescript-performance',
    speaker: 'Dimitri Mitropoulos',
    time: '11:25 AM',
  },
  {
    day: 'day-2',
    description:
      'Agentic AI promises program autonomy and "intelligent" workflows. But integrating agentic systems into React introduces real challenges: indefinite loops, stalled responses, unpredictable state updates, UI desynchronization, and missing guardrails. I\'ll share lessons from building agentic workflows and practical patterns for making agents observable, controllable, and user-safe in a React UI.',
    labels: 'ai,react',
    location: 'Hyatt Regency Miami',
    name: 'Agentic AI Without the Magic',
    slug: 'agentic-ai',
    speaker: 'Vinceline Bertrand',
    time: '11:50 AM',
  },
  {
    day: 'day-2',
    description:
      'A long-term, real-world case study of how a React monorepo actually evolves in production — beyond blog-post architectures and conference demos. Rather than celebrating every new framework or pattern, this talk focuses on what stayed, what broke, and what quietly paid off. Topics include dependency discipline, state management migrations, and how to evaluate "new" React ideas without destabilizing your system.',
    labels: 'career',
    location: 'Hyatt Regency Miami',
    name: 'The Anti-Shiny Object Syndrome',
    slug: 'anti-shiny-object',
    speaker: 'Serge Leon',
    time: '12:15 PM',
  },
  {
    day: 'day-2',
    description:
      'Isograph is an opinionated, compiler-driven framework for building stable and performant data-driven apps. The compiler scans your codebase and generates files containing queries for all the data needed by a given screen. Want to dynamically load part of your page? One annotation. Want to load JavaScript only for rendered components? Also one annotation. Come find out more!',
    labels: 'react,tooling',
    location: 'Hyatt Regency Miami',
    name: 'Isograph: a compiler for your UI',
    slug: 'isograph',
    speaker: 'Robert Balicki',
    time: '2:05 PM',
  },
  {
    day: 'day-2',
    description:
      'We spent years abstracting away the hardest parts of building software. Now, LLMs use tools like Payload to do the heavy lifting. But when anyone can spin up functioning software, implementation is no longer a superpower. AI is great at producing code, but it has no taste. No point of view. No opinion about what should exist. That part is still on you.',
    labels: 'design,ai',
    location: 'Hyatt Regency Miami',
    name: "Robots Can't Taste",
    slug: 'robots-cant-taste',
    speaker: 'James Mikrut',
    time: '2:30 PM',
  },
  {
    day: 'day-2',
    description:
      'How I fully rewrote my application over the course of 2 weeks to a new architecture using AI that unlocked being able to ship quality software faster. Covering setting up development environments for AI, EffectTS, best practices for debugging production, and a starter template you can use for your own applications.',
    labels: 'typescript,ai',
    location: 'Hyatt Regency Miami',
    name: 'Shipping quality full stack TypeScript apps in the age of AI',
    slug: 'fullstack-typescript-ai',
    speaker: 'Rhys Sullivan',
    time: '2:55 PM',
  },
  {
    day: 'day-2',
    description:
      "This talk covers building a backend framework at the intersection of MCP, DX & UI. A major turning point was integrating React and introducing native support for rendering components inside tools, rethinking this backend-first framework. This takes tools to the next level and redefines how users interact with interfaces. We'll cover practical examples, implementation details, and lessons learned.",
    labels: 'react',
    location: 'Hyatt Regency Miami',
    name: 'React-ing a backend framework',
    slug: 'reacting-backend',
    speaker: 'Valentina Bearzotti',
    time: '3:20 PM',
  },
  {
    day: 'day-2',
    description: 'Celebrate the end of React Miami 2026! DJ, drinks, and good vibes in Wynwood.',
    labels: 'social',
    location: 'Wynwood Marketplace',
    name: 'Afterparty at Wynwood',
    slug: 'afterparty',
    speaker: 'React Miami Team',
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

  // Test data from Aurora for the demo — gives us something to show on screen
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
