import { Avatar } from '@/components/common/Avatar';
import { getCurrentUser } from '@/data/queries/auth';
import { getEventBySlug } from '@/data/queries/event';
import { getQuestionsByEvent } from '@/data/queries/question';
import type { Metadata } from 'next';
import { QrCodeDialog } from './_components/QrCodeDialog';
import { QuestionList } from './_components/QuestionList';

export async function generateMetadata({ params }: PageProps<'/[slug]/questions'>): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    description: `Ask and vote on questions for ${event.name}`,
    title: `Questions · ${event.name} | Event Hub`,
  };
}

export default function QuestionsPage({ params }: PageProps<'/[slug]/questions'>) {
  return (
    <>
      <EventHeader params={params} />
      <div className="mt-3">
        <QuestionFeed params={params} />
      </div>
    </>
  );
}

async function EventHeader({ params }: Pick<PageProps<'/[slug]/questions'>, 'params'>) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return (
    <div className="flex items-center gap-3">
      {event.speaker && <Avatar name={event.speaker} variant="speaker" size="lg" />}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-sans text-sm font-bold tracking-tight sm:text-base">{event.name}</h1>
        {event.speaker && <p className="text-muted-foreground text-xs">{event.speaker}</p>}
      </div>
      <QrCodeDialog eventName={event.name} />
    </div>
  );
}

async function QuestionFeed({ params }: Pick<PageProps<'/[slug]/questions'>, 'params'>) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();
  const questions = await getQuestionsByEvent(slug, currentUser);
  return <QuestionList initialQuestions={questions} eventSlug={slug} currentUser={currentUser} />;
}
