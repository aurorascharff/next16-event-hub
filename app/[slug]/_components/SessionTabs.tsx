'use client';

import { MessageCircle, HelpCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

type TabValue = 'comments' | 'questions';

type Props = {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
};

export function SessionTabs({ activeTab, onTabChange }: Props) {
  const tabs: { icon: React.ReactNode; label: string; value: TabValue }[] = [
    { icon: <MessageCircle className="size-3.5" />, label: 'Comments', value: 'comments' },
    { icon: <HelpCircle className="size-3.5" />, label: 'Questions', value: 'questions' },
  ];

  return (
    <div className="flex border-b">
      {tabs.map(tab => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            onClick={() => {
              onTabChange(tab.value);
            }}
            className={cn(
              'flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium transition-colors',
              isActive
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
