'use client';

import { ArrowLeft, CalendarDays, HelpCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { BottomNav } from '@/components/design/BottomNav';
import type { Route } from 'next';

type Props = {
  children: React.ReactNode;
};

export function SessionTabs({ children }: Props) {
  const router = useRouter();

  return (
    <>
      {children}
      <Suspense>
        <SessionTabsNav
          onChange={href => {
            return router.push(href);
          }}
        />
      </Suspense>
    </>
  );
}

function SessionTabsNav({ onChange }: { onChange: (href: Route) => void }) {
  const { slug } = useParams<{ slug: string }>();
  const sessionHref = `/${slug}`;
  const questionsHref = `${sessionHref}/questions`;

  return (
    <BottomNav
      tabs={[
        { href: '/', icon: <ArrowLeft className="size-5" />, label: 'Back' },
        {
          href: sessionHref as Route,
          icon: <CalendarDays className="size-5" />,
          label: 'Session',
        },
        {
          href: questionsHref as Route,
          icon: <HelpCircle className="size-5" />,
          label: 'Questions',
        },
      ]}
      onChange={onChange}
    />
  );
}
