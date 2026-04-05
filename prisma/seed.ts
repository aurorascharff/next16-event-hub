/* eslint-disable no-console */
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const events = [
  {
    day: 'day-1',
    description: 'Kick off React Miami 2026 with a look at where React is headed — new APIs, new patterns, and the road ahead.',
    location: 'Main Stage',
    name: 'Opening Keynote',
    slug: 'opening-keynote',
    speaker: 'TBD',
    time: '9:00 AM',
    track: 'main',
  },
  {
    day: 'day-1',
    description: 'Much of the user experience happens in the moments between actions and the final UI. This session demonstrates how Async React makes these in-between states manageable using Suspense, optimistic updates, and streaming.',
    location: 'Main Stage',
    name: 'Designing the In-Between States with Async React',
    slug: 'in-between-states',
    speaker: 'Aurora Scharff',
    time: '10:30 AM',
    track: 'main',
  },
  {
    day: 'day-1',
    description: 'A deep dive into React Server Components — how they work under the hood, when to use them, and patterns for building full-stack React apps.',
    location: 'Main Stage',
    name: 'Server Components Deep Dive',
    slug: 'server-components-deep-dive',
    speaker: 'Mark Erikson',
    time: '1:00 PM',
    track: 'main',
  },
  {
    day: 'day-1',
    description: 'The React Compiler automatically optimizes your components. Learn what it does, how to adopt it, and what changes in how you write React.',
    location: 'Community Room',
    name: 'Building with the React Compiler',
    slug: 'react-compiler',
    speaker: 'David Sancho Moreno',
    time: '2:00 PM',
    track: 'community',
  },
  {
    day: 'day-1',
    description: 'Explore how design engineers bridge design and engineering — building beautiful, accessible, animated interfaces with modern React.',
    location: 'Community Room',
    name: 'Design Engineering in Practice',
    slug: 'design-engineering',
    speaker: 'Will King',
    time: '3:30 PM',
    track: 'community',
  },
  {
    day: 'day-2',
    description: 'State management in 2026 — from signals to stores to server state. What patterns survive, what fades, and what the React team recommends.',
    location: 'Main Stage',
    name: 'The State of State Management',
    slug: 'state-management',
    speaker: 'Mark Erikson',
    time: '9:30 AM',
    track: 'main',
  },
  {
    day: 'day-2',
    description: 'AI-powered dev tools are changing how we write code. A look at agent-driven development, AI code review, and what it means for React developers.',
    location: 'Main Stage',
    name: 'AI and the Future of React Development',
    slug: 'ai-react-development',
    speaker: 'Miguel Ángel Durán',
    time: '11:00 AM',
    track: 'main',
  },
  {
    day: 'day-2',
    description: 'Wrapping up React Miami 2026 — key takeaways, community shoutouts, and what to look forward to next year.',
    location: 'Main Stage',
    name: 'Closing Keynote',
    slug: 'closing-keynote',
    speaker: 'TBD',
    time: '4:00 PM',
    track: 'main',
  },
  {
    day: 'workshop',
    description: 'Hands-on workshop covering React Native with Expo — build a cross-platform app from scratch using the latest APIs.',
    location: 'Workshop Room A',
    name: 'React Native with Expo Workshop',
    slug: 'react-native-workshop',
    speaker: 'Anselm Eickhoff',
    time: '9:00 AM',
    track: null,
  },
  {
    day: 'day-2',
    description: 'Celebrate the end of React Miami 2026! DJ, drinks, and good vibes in Wynwood.',
    location: 'Wynwood Marketplace',
    name: 'Afterparty at Wynwood',
    slug: 'afterparty',
    speaker: null,
    time: '7:00 PM',
    track: null,
  },
];

const comments = [
  { content: 'So excited for this talk! Async patterns are something I struggle with daily.', eventSlug: 'in-between-states', userName: 'DevDan' },
  { content: 'Aurora gave an amazing talk at React Day Berlin — this will be great.', eventSlug: 'in-between-states', userName: 'ReactFan42' },
  { content: 'Hoping for some live coding demos!', eventSlug: 'in-between-states', userName: 'CodeMaria' },
  { content: 'Finally someone explaining RSC in a way that makes sense.', eventSlug: 'server-components-deep-dive', userName: 'FullStackFred' },
  { content: 'Mark always delivers. Can\'t wait.', eventSlug: 'server-components-deep-dive', userName: 'ReduxLover' },
  { content: 'Who\'s coming to the afterparty? 🎉', eventSlug: 'afterparty', userName: 'PartyPete' },
  { content: 'The Wynwood venue is going to be amazing!', eventSlug: 'afterparty', userName: 'MiamiLocal' },
  { content: 'Will there be a recording of the workshop?', eventSlug: 'react-native-workshop', userName: 'MobileDevSara' },
];

const questions = [
  { content: 'How do you handle error boundaries with Suspense and optimistic updates?', eventSlug: 'in-between-states', userName: 'CuriousCoder', votes: 12 },
  { content: 'Can you show the difference between useTransition and startTransition?', eventSlug: 'in-between-states', userName: 'TransitionTom', votes: 8 },
  { content: 'What\'s the performance impact of the React Compiler on large codebases?', eventSlug: 'react-compiler', userName: 'PerfPaula', votes: 15 },
  { content: 'How do Server Components interact with client-side state management?', eventSlug: 'server-components-deep-dive', userName: 'StateSteve', votes: 6 },
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

  for (const comment of comments) {
    await prisma.comment.create({ data: comment });
  }

  for (const question of questions) {
    await prisma.question.create({ data: question });
  }

  console.log(`Seeded ${events.length} events, ${comments.length} comments, ${questions.length} questions`);
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
