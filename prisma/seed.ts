/* eslint-disable no-console */
// --- SQLite (local dev) ---
// import { PrismaLibSql } from '@prisma/adapter-libsql';
// import { PrismaClient } from '../generated/prisma/client';
// const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
// const prisma = new PrismaClient({ adapter });

// --- PostgreSQL (Vercel) ---
import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

dotenv.config({ path: '.env.local' });
const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_URL_NON_POOLING });
const prisma = new PrismaClient({ adapter });

function ago(minutes: number) {
  return new Date(Date.now() - minutes * 60_000);
}

const events = [
  // Day 1
  {
    day: 'day-1',
    description: 'Much of the user experience happens in the moments between actions and the final UI. This session demonstrates how Async React makes these in-between states manageable using Suspense, optimistic updates, and streaming.',
    labels: 'react,performance',
    location: 'Hyatt Regency Miami',
    name: 'Designing the In-Between States with Async React',
    slug: 'in-between-states',
    speaker: 'Aurora Scharff',
    time: '9:15 AM',
  },
  {
    day: 'day-1',
    description: 'El futuro de React es ahora — explorando las nuevas APIs, patrones y lo que viene para React.',
    labels: 'react',
    location: 'Hyatt Regency Miami',
    name: 'El futuro de React es ahora',
    slug: 'futuro-de-react',
    speaker: 'Miguel Ángel Durán',
    time: '9:40 AM',
  },
  {
    day: 'day-1',
    description: 'A look at what\'s new in React Router v8, the migration path from earlier versions, and what the future holds.',
    labels: 'react,tooling',
    location: 'Hyatt Regency Miami',
    name: 'React Router v8 and Beyond',
    slug: 'react-router-v8',
    speaker: 'Brooks Lybrand',
    time: '10:05 AM',
  },
  {
    day: 'day-1',
    description: 'Exploring the current state of brownfield adoption in React Native — integrating React Native into existing native apps.',
    labels: 'mobile',
    location: 'Hyatt Regency Miami',
    name: 'State of Brownfield in React Native',
    slug: 'brownfield-react-native',
    speaker: 'Artur Morys-Magiera',
    time: '11:00 AM',
  },
  {
    day: 'day-1',
    description: 'How to hack your React app and fix it too — a deep dive into common security vulnerabilities in React applications.',
    labels: 'react,security',
    location: 'Hyatt Regency Miami',
    name: 'React with Caution',
    slug: 'react-with-caution',
    speaker: 'Ramona Schwering',
    time: '11:25 AM',
  },
  {
    day: 'day-1',
    description: 'What we learned optimizing Base UI — patterns you can steal for faster React apps.',
    labels: 'react,performance',
    location: 'Hyatt Regency Miami',
    name: 'Optimizing Base UI',
    slug: 'optimizing-base-ui',
    speaker: 'Michał Dudak',
    time: '11:50 AM',
  },
  {
    day: 'day-1',
    description: 'The story of Voltra — from JSX to Live Activity, building native iOS experiences with React.',
    labels: 'mobile',
    location: 'Hyatt Regency Miami',
    name: 'JSX to Live Activity: The Story of Voltra',
    slug: 'jsx-to-live-activity',
    speaker: 'Szymon Chmal',
    time: '1:40 PM',
  },
  {
    day: 'day-1',
    description: 'What if useState() was your database? Exploring local-first architecture and state persistence.',
    labels: 'react',
    location: 'Hyatt Regency Miami',
    name: 'What if useState() was your database?',
    slug: 'usestate-database',
    speaker: 'Anselm Eickhoff',
    time: '2:05 PM',
  },
  {
    day: 'day-1',
    description: 'How to make your content generative-ready with React — integrating AI-powered content workflows.',
    labels: 'ai,react',
    location: 'Hyatt Regency Miami',
    name: 'Generative-Ready Content with React',
    slug: 'generative-content',
    speaker: 'Facundo Giuliani',
    time: '2:30 PM',
  },
  {
    day: 'day-1',
    description: 'Making code beautiful and approachable — design patterns and creative coding with React.',
    labels: 'design',
    location: 'Hyatt Regency Miami',
    name: 'Code, But Make it Cute',
    slug: 'code-but-cute',
    speaker: 'Bree Hall',
    time: '2:55 PM',
  },
  {
    day: 'day-1',
    description: 'Building delightful user experiences through whimsy — adding personality and surprise to your React apps.',
    labels: 'design',
    location: 'Hyatt Regency Miami',
    name: 'Whimsy-Driven Development',
    slug: 'whimsy-driven-development',
    speaker: 'Christina Martinez',
    time: '3:50 PM',
  },
  {
    day: 'day-1',
    description: 'AI broke hiring — what does the future look like for developers navigating AI-powered recruitment?',
    labels: 'ai,career',
    location: 'Hyatt Regency Miami',
    name: 'AI broke hiring...what now?',
    slug: 'ai-broke-hiring',
    speaker: 'Will King',
    time: '4:15 PM',
  },
  {
    day: 'day-1',
    description: 'A behind-the-scenes look at how Tailwind CSS is built — the architecture, decisions, and trade-offs.',
    labels: 'css,tooling',
    location: 'Hyatt Regency Miami',
    name: 'Behind the Scenes of Tailwind CSS',
    slug: 'tailwind-behind-scenes',
    speaker: 'Braydon Coyer',
    time: '4:40 PM',
  },
  {
    day: 'day-1',
    description: 'ai is ok i guess.',
    labels: 'ai',
    location: 'Hyatt Regency Miami',
    name: 'ai is ok i guess',
    slug: 'ai-is-ok',
    speaker: 'Ken Wheeler',
    time: '5:05 PM',
  },

  // Day 2
  {
    day: 'day-2',
    description: '10x your React development workflow with TanStack Query, HeyAPI, and AI copilots.',
    labels: 'react,ai,tooling',
    location: 'Hyatt Regency Miami',
    name: '10x React Development with TanStack Query, HeyAPI, and AI Copilots',
    slug: 'tanstack-query-heyapi',
    speaker: 'Devlin Duldulao',
    time: '9:15 AM',
  },
  {
    day: 'day-2',
    description: 'A guide to how the React Compiler handles rendering — what it optimizes and how to work with it.',
    labels: 'react,performance',
    location: 'Hyatt Regency Miami',
    name: 'A Guide to React Compiler Rendering',
    slug: 'react-compiler-rendering',
    speaker: 'Mark Erikson',
    time: '9:40 AM',
  },
  {
    day: 'day-2',
    description: 'The last website you\'ll ever visit in the browser — exploring the future of web experiences.',
    labels: 'react',
    location: 'Hyatt Regency Miami',
    name: 'The Last Website You\'ll Ever Visit',
    slug: 'last-website',
    speaker: 'Rizel Scarlett',
    time: '10:05 AM',
  },
  {
    day: 'day-2',
    description: 'React from another universe — exploring unconventional approaches and alternative paradigms in React.',
    labels: 'react',
    location: 'Hyatt Regency Miami',
    name: 'React From Another Universe',
    slug: 'react-another-universe',
    speaker: 'David Sancho Moreno',
    time: '11:00 AM',
  },
  {
    day: 'day-2',
    description: 'Solving your TypeScript performance problems — profiling, diagnosing, and fixing slow types.',
    labels: 'typescript,performance',
    location: 'Hyatt Regency Miami',
    name: 'Solving Your TypeScript Performance Problems',
    slug: 'typescript-performance',
    speaker: 'Dimitri Mitropoulos',
    time: '11:25 AM',
  },
  {
    day: 'day-2',
    description: 'Building autonomous AI workflows in React under real constraints — no magic, just practical patterns.',
    labels: 'ai,react',
    location: 'Hyatt Regency Miami',
    name: 'Agentic AI Without the Magic',
    slug: 'agentic-ai',
    speaker: 'Vinceline Bertrand',
    time: '11:50 AM',
  },
  {
    day: 'day-2',
    description: 'Fighting shiny object syndrome — staying focused and productive as a developer in 2026.',
    labels: 'career',
    location: 'Hyatt Regency Miami',
    name: 'The Anti-Shiny Object Syndrome',
    slug: 'anti-shiny-object',
    speaker: 'Serge Leon',
    time: '12:15 PM',
  },
  {
    day: 'day-2',
    description: 'Isograph: a compiler for your UI — building optimized, declarative UIs with compile-time analysis.',
    labels: 'react,tooling',
    location: 'Hyatt Regency Miami',
    name: 'Isograph: a compiler for your UI',
    slug: 'isograph',
    speaker: 'Robert Balicki',
    time: '2:05 PM',
  },
  {
    day: 'day-2',
    description: 'Robots can\'t taste — the irreplaceable role of human creativity and judgment in design and engineering.',
    labels: 'design,ai',
    location: 'Hyatt Regency Miami',
    name: 'Robots Can\'t Taste',
    slug: 'robots-cant-taste',
    speaker: 'James Mikrut',
    time: '2:30 PM',
  },
  {
    day: 'day-2',
    description: 'Shipping quality full stack TypeScript apps in the age of AI — practical patterns for production apps.',
    labels: 'typescript,ai',
    location: 'Hyatt Regency Miami',
    name: 'Shipping quality full stack TypeScript apps in the age of AI',
    slug: 'fullstack-typescript-ai',
    speaker: 'Rhys Sullivan',
    time: '2:55 PM',
  },
  {
    day: 'day-2',
    description: 'React-ing a backend framework — building backend tools and frameworks with React paradigms.',
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
    speaker: null,
    time: '7:00 PM',
  },
];

const comments = [
  // in-between-states — Aurora's talk, most activity
  { content: 'Just grabbed a seat in the front row. Let\'s go!', createdAt: ago(47), eventSlug: 'in-between-states', likes: 3, userName: 'DevDan' },
  { content: 'Aurora gave an amazing talk at React Day Berlin — this will be great.', createdAt: ago(42), eventSlug: 'in-between-states', likes: 7, userName: 'ReactFan42' },
  { content: 'Hoping for some live coding demos!', createdAt: ago(38), eventSlug: 'in-between-states', likes: 2, userName: 'CodeMaria' },
  { content: 'The Suspense streaming demo was so clean. No loading spinners!', createdAt: ago(25), eventSlug: 'in-between-states', likes: 5, userName: 'SuspenseSam' },
  { content: 'useOptimistic is a game changer. Never going back to manual state.', createdAt: ago(18), eventSlug: 'in-between-states', likes: 4, userName: 'OptimisticOlivia' },
  { content: 'Wait, so the form just... works? No loading state management?', createdAt: ago(12), eventSlug: 'in-between-states', likes: 1, userName: 'FormsFrank' },
  { content: 'This is exactly what I needed for my project at work.', createdAt: ago(8), eventSlug: 'in-between-states', likes: 0, userName: 'WorkplaceWendy' },
  { content: 'The ViewTransition slide-up on Suspense reveal looked incredible.', createdAt: ago(3), eventSlug: 'in-between-states', likes: 2, userName: 'AnimationAndy' },

  // futuro-de-react — Midudev
  { content: 'Midudev siempre delivers. Vamos!', createdAt: ago(50), eventSlug: 'futuro-de-react', likes: 8, userName: 'ReactFan42' },
  { content: 'Love seeing a talk in Spanish at a US conference.', createdAt: ago(35), eventSlug: 'futuro-de-react', likes: 5, userName: 'DevDan' },
  { content: 'The energy in this room is incredible.', createdAt: ago(20), eventSlug: 'futuro-de-react', likes: 3, userName: 'MiamiLocal' },

  // react-compiler-rendering — Mark Erikson
  { content: 'Mark always delivers the deep dives we need.', createdAt: ago(55), eventSlug: 'react-compiler-rendering', likes: 9, userName: 'ReduxLover' },
  { content: 'The before/after rendering comparison was mind-blowing.', createdAt: ago(30), eventSlug: 'react-compiler-rendering', likes: 6, userName: 'BundleBerta' },
  { content: 'So the compiler just... eliminates unnecessary re-renders?', createdAt: ago(15), eventSlug: 'react-compiler-rendering', likes: 2, userName: 'PerfPaula' },

  // optimizing-base-ui
  { content: 'Patterns you can steal — love that framing.', createdAt: ago(40), eventSlug: 'optimizing-base-ui', likes: 4, userName: 'DesignDevDina' },
  { content: 'Base UI is seriously underrated.', createdAt: ago(22), eventSlug: 'optimizing-base-ui', likes: 3, userName: 'UIUma' },

  // react-router-v8
  { content: 'Finally a clear migration path from v6!', createdAt: ago(44), eventSlug: 'react-router-v8', likes: 5, userName: 'RoutingRick' },
  { content: 'The new data loading patterns are so much cleaner.', createdAt: ago(28), eventSlug: 'react-router-v8', likes: 3, userName: 'FullStackFred' },

  // tailwind-behind-scenes
  { content: 'I use Tailwind every day but never thought about how it\'s built.', createdAt: ago(36), eventSlug: 'tailwind-behind-scenes', likes: 6, userName: 'CSSCarla' },
  { content: 'The v4 architecture is so elegant.', createdAt: ago(14), eventSlug: 'tailwind-behind-scenes', likes: 4, userName: 'DesignDevDina' },

  // ai-is-ok
  { content: 'Ken Wheeler on stage is always an experience.', createdAt: ago(32), eventSlug: 'ai-is-ok', likes: 11, userName: 'HypedHarry' },
  { content: 'Best talk title of the conference.', createdAt: ago(19), eventSlug: 'ai-is-ok', likes: 7, userName: 'PartyPete' },

  // afterparty
  { content: 'Who\'s coming to the afterparty? 🎉', createdAt: ago(60), eventSlug: 'afterparty', likes: 4, userName: 'PartyPete' },
  { content: 'The Wynwood venue is going to be amazing!', createdAt: ago(52), eventSlug: 'afterparty', likes: 3, userName: 'MiamiLocal' },
  { content: 'Last year the DJ was so good. Hoping for the same energy!', createdAt: ago(31), eventSlug: 'afterparty', likes: 2, userName: 'DJFan' },

  // agentic-ai
  { content: 'Finally a practical AI talk without the hype.', createdAt: ago(27), eventSlug: 'agentic-ai', likes: 5, userName: 'AIAlice' },
  { content: 'The real constraints framing is so refreshing.', createdAt: ago(11), eventSlug: 'agentic-ai', likes: 3, userName: 'PragmaticPat' },

  // code-but-cute
  { content: 'Bree\'s energy is amazing. This talk is so fun.', createdAt: ago(33), eventSlug: 'code-but-cute', likes: 6, userName: 'DesignDevDina' },

  // whimsy-driven-development
  { content: 'Adding whimsy to my apps starting TODAY.', createdAt: ago(24), eventSlug: 'whimsy-driven-development', likes: 4, userName: 'AnimationAndy' },
];

const questions = [
  // in-between-states — most questions
  { content: 'How do you handle error boundaries with Suspense and optimistic updates?', createdAt: ago(40), eventSlug: 'in-between-states', userName: 'CuriousCoder', votes: 18 },
  { content: 'Can you show the difference between useTransition and startTransition?', createdAt: ago(32), eventSlug: 'in-between-states', userName: 'TransitionTom', votes: 14 },
  { content: 'What happens if two optimistic updates conflict? Does React reconcile them?', createdAt: ago(20), eventSlug: 'in-between-states', userName: 'ConflictCarl', votes: 9 },
  { content: 'Is the action props pattern something you use in production or just for demos?', createdAt: ago(11), eventSlug: 'in-between-states', userName: 'ProdPriya', votes: 7 },
  { content: 'How do ViewTransitions interact with Suspense boundaries?', createdAt: ago(4), eventSlug: 'in-between-states', userName: 'AnimationAndy', votes: 3 },

  // react-compiler-rendering
  { content: 'What\'s the performance impact on large codebases?', createdAt: ago(48), eventSlug: 'react-compiler-rendering', userName: 'PerfPaula', votes: 15 },
  { content: 'Does the compiler work with class components or just function components?', createdAt: ago(24), eventSlug: 'react-compiler-rendering', userName: 'ClassicClaire', votes: 6 },

  // react-router-v8
  { content: 'How does this compare to TanStack Router?', createdAt: ago(36), eventSlug: 'react-router-v8', userName: 'RoutingRick', votes: 10 },

  // typescript-performance
  { content: 'Any tips for profiling type-check times in monorepos?', createdAt: ago(30), eventSlug: 'typescript-performance', userName: 'MonorepoMax', votes: 12 },

  // agentic-ai
  { content: 'What\'s the best way to review AI-generated code for security issues?', createdAt: ago(27), eventSlug: 'agentic-ai', userName: 'SecuritySue', votes: 8 },

  // tailwind-behind-scenes
  { content: 'How does Tailwind v4 handle CSS-in-JS migration?', createdAt: ago(22), eventSlug: 'tailwind-behind-scenes', userName: 'CSSCarla', votes: 7 },

  // optimizing-base-ui
  { content: 'Are these patterns applicable to other component libraries too?', createdAt: ago(34), eventSlug: 'optimizing-base-ui', userName: 'LibraryLiam', votes: 5 },

  // ai-broke-hiring
  { content: 'What skills should junior devs focus on in the AI era?', createdAt: ago(18), eventSlug: 'ai-broke-hiring', userName: 'JuniorJade', votes: 14 },

  // futuro-de-react
  { content: 'Will there be English subtitles or a translated version later?', createdAt: ago(45), eventSlug: 'futuro-de-react', userName: 'MonolingualMark', votes: 4 },
];

async function main() {
  console.log('Seeding database...');

  await prisma.commentLike.deleteMany();
  await prisma.questionVote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.presence.deleteMany();
  await prisma.event.deleteMany();

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  const likeUsers = ['DevDan', 'ReactFan42', 'CodeMaria', 'SuspenseSam', 'OptimisticOlivia',
    'FullStackFred', 'ReduxLover', 'HypedHarry', 'AIAlice', 'PartyPete', 'DesignDevDina', 'MiamiLocal'];

  for (const comment of comments) {
    const created = await prisma.comment.create({
      data: {
        content: comment.content,
        createdAt: comment.createdAt,
        eventSlug: comment.eventSlug,
        likes: comment.likes,
        userName: comment.userName,
      },
    });

    const likers = likeUsers
      .filter(u => {return u !== comment.userName})
      .slice(0, comment.likes);
    for (const liker of likers) {
      await prisma.commentLike.create({
        data: { commentId: created.id, userName: liker },
      });
    }
  }

  const voteUsers = ['CuriousCoder', 'TransitionTom', 'ConflictCarl', 'ProdPriya', 'AnimationAndy',
    'PerfPaula', 'ClassicClaire', 'RoutingRick', 'MonorepoMax', 'SecuritySue', 'CSSCarla',
    'DevDan', 'ReactFan42', 'FullStackFred', 'ReduxLover', 'HypedHarry', 'AIAlice', 'BundleBerta'];

  for (const question of questions) {
    const created = await prisma.question.create({
      data: {
        content: question.content,
        createdAt: question.createdAt,
        eventSlug: question.eventSlug,
        userName: question.userName,
        votes: question.votes,
      },
    });

    const voters = voteUsers
      .filter(u => {return u !== question.userName})
      .slice(0, question.votes);
    for (const voter of voters) {
      await prisma.questionVote.create({
        data: { questionId: created.id, userName: voter },
      });
    }
  }

  const presenceData = [
    { eventSlug: 'in-between-states', lastSeen: ago(0), userName: 'DevDan' },
    { eventSlug: 'in-between-states', lastSeen: ago(0), userName: 'ReactFan42' },
    { eventSlug: 'in-between-states', lastSeen: ago(0), userName: 'CodeMaria' },
    { eventSlug: 'in-between-states', lastSeen: ago(0), userName: 'SuspenseSam' },
    { eventSlug: 'in-between-states', lastSeen: ago(0), userName: 'OptimisticOlivia' },
    { eventSlug: 'in-between-states', lastSeen: ago(0), userName: 'AnimationAndy' },
    { eventSlug: 'react-compiler-rendering', lastSeen: ago(0), userName: 'BundleBerta' },
    { eventSlug: 'react-compiler-rendering', lastSeen: ago(0), userName: 'PerfPaula' },
    { eventSlug: 'futuro-de-react', lastSeen: ago(0), userName: 'MiamiLocal' },
    { eventSlug: 'afterparty', lastSeen: ago(0), userName: 'PartyPete' },
    { eventSlug: 'afterparty', lastSeen: ago(0), userName: 'DJFan' },
  ];

  for (const presence of presenceData) {
    await prisma.presence.create({ data: presence });
  }

  console.log(`Seeded ${events.length} events, ${comments.length} comments, ${questions.length} questions, ${presenceData.length} active users`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
