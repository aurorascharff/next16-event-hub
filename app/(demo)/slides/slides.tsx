import { ChevronRight } from 'lucide-react';
import { Slide, SlideTitle, SlideBadge, SlideSpeaker } from 'nextjs-slides';

function CycleBox({ children, name }: { children: React.ReactNode; name: string }) {
  return (
    <div
      className="border-primary bg-primary/5 rounded-xl border px-7 py-3.5 text-xl font-semibold"
      style={{ viewTransitionName: name }}
    >
      {children}
    </div>
  );
}

function CycleArrow({ name }: { name: string }) {
  return <ChevronRight className="text-muted-foreground/40 size-5 shrink-0" style={{ viewTransitionName: name }} />;
}

function CycleLabel({ children, name }: { children: React.ReactNode; name: string }) {
  return (
    <span className="text-muted-foreground text-lg italic" style={{ viewTransitionName: name }}>
      {children}
    </span>
  );
}

function Primitive({ children, name }: { children: React.ReactNode; name: string }) {
  return (
    <span
      className="text-primary border-primary/40 border-b-2 border-dashed pb-1 font-mono text-lg"
      style={{ viewTransitionName: name }}
    >
      {children}
    </span>
  );
}

function NetworkNote({ children, name }: { children: React.ReactNode; name: string }) {
  return (
    <p className="text-muted-foreground text-base italic" style={{ viewTransitionName: name }}>
      {children}
    </p>
  );
}

export const slides = [
  // 1. Title
  <Slide key="title">
    <SlideBadge>React Miami 2026</SlideBadge>
    <SlideTitle>Designing the In-Between States with Async React</SlideTitle>
    <SlideSpeaker name="Aurora Scharff" title="DX Engineer at Vercel" avatar="/aurora.png" />
  </Slide>,

  // 2. Basic render cycle — Event → Update → Render → Commit
  <Slide key="cycle-basic">
    <div style={{ viewTransitionName: 'cycle-title' }}>
      <SlideTitle>Async React Render Cycle</SlideTitle>
    </div>
    <div className="mt-16 flex items-center justify-center gap-5">
      <CycleBox name="box-event">Event</CycleBox>
      <CycleArrow name="arrow-1" />
      <CycleBox name="box-update">Update</CycleBox>
      <CycleArrow name="arrow-2" />
      <CycleBox name="box-render">Render</CycleBox>
      <CycleArrow name="arrow-3" />
      <CycleBox name="box-commit">Commit</CycleBox>
    </div>
  </Slide>,

  // 3. With in-between states — busy, loading, done
  <Slide key="cycle-states">
    <div style={{ viewTransitionName: 'cycle-title' }}>
      <SlideTitle>Async React Render Cycle</SlideTitle>
    </div>
    <div className="mt-16 flex items-center justify-center gap-5">
      <CycleBox name="box-event">Event</CycleBox>
      <CycleArrow name="arrow-1" />
      <CycleLabel name="label-busy">busy</CycleLabel>
      <CycleArrow name="arrow-2" />
      <CycleBox name="box-update">Update</CycleBox>
      <CycleArrow name="arrow-3" />
      <CycleLabel name="label-loading">loading</CycleLabel>
      <CycleArrow name="arrow-4" />
      <CycleBox name="box-render">Render</CycleBox>
      <CycleArrow name="arrow-5" />
      <CycleLabel name="label-done">done</CycleLabel>
      <CycleArrow name="arrow-6" />
      <CycleBox name="box-commit">Commit</CycleBox>
    </div>
  </Slide>,

  // 4. Wrapped in a transition
  <Slide key="cycle-transition">
    <div style={{ viewTransitionName: 'cycle-title' }}>
      <SlideTitle>Async React Render Cycle</SlideTitle>
    </div>
    <div className="mt-12 flex flex-col items-center gap-6">
      <p
        className="text-primary font-mono text-xl font-bold tracking-wide"
        style={{ viewTransitionName: 'transition-label' }}
      >
        transition
      </p>
      <div
        className="bg-primary/5 border-primary/30 flex items-center gap-5 rounded-2xl border-2 border-dashed px-8 py-6"
        style={{ viewTransitionName: 'transition-border' }}
      >
        <CycleBox name="box-event">Event</CycleBox>
        <CycleArrow name="arrow-1" />
        <CycleLabel name="label-busy">busy</CycleLabel>
        <CycleArrow name="arrow-2" />
        <CycleBox name="box-update">Update</CycleBox>
        <CycleArrow name="arrow-3" />
        <CycleLabel name="label-loading">loading</CycleLabel>
        <CycleArrow name="arrow-4" />
        <CycleBox name="box-render">Render</CycleBox>
        <CycleArrow name="arrow-5" />
        <CycleLabel name="label-done">done</CycleLabel>
        <CycleArrow name="arrow-6" />
        <CycleBox name="box-commit">Commit</CycleBox>
      </div>
    </div>
  </Slide>,

  // 5. With primitives mapped to each phase
  <Slide key="cycle-primitives">
    <div style={{ viewTransitionName: 'cycle-title' }}>
      <SlideTitle>Async React Render Cycle</SlideTitle>
    </div>
    <div className="mt-12 flex flex-col items-center gap-6">
      <p
        className="text-primary font-mono text-xl font-bold tracking-wide"
        style={{ viewTransitionName: 'transition-label' }}
      >
        transition
      </p>
      <div
        className="inline-grid items-center gap-x-5 gap-y-6"
        style={{ gridTemplateColumns: 'repeat(13, auto)' }}
      >
        <div
          className="bg-primary/5 border-primary/30 col-span-full grid grid-cols-subgrid items-center rounded-2xl border-2 border-dashed px-8 py-6"
          style={{ viewTransitionName: 'transition-border' }}
        >
          <CycleBox name="box-event">Event</CycleBox>
          <CycleArrow name="arrow-1" />
          <CycleLabel name="label-busy">busy</CycleLabel>
          <CycleArrow name="arrow-2" />
          <CycleBox name="box-update">Update</CycleBox>
          <CycleArrow name="arrow-3" />
          <CycleLabel name="label-loading">loading</CycleLabel>
          <CycleArrow name="arrow-4" />
          <CycleBox name="box-render">Render</CycleBox>
          <CycleArrow name="arrow-5" />
          <CycleLabel name="label-done">done</CycleLabel>
          <CycleArrow name="arrow-6" />
          <CycleBox name="box-commit">Commit</CycleBox>
        </div>
        <div style={{ gridColumn: '1 / 6', gridRow: '2', justifySelf: 'center' }}>
          <Primitive name="prim-optimistic">useOptimistic()</Primitive>
        </div>
        <div style={{ gridColumn: '5 / 10', gridRow: '2', justifySelf: 'center' }}>
          <Primitive name="prim-suspense">&lt;Suspense&gt;</Primitive>
        </div>
        <div style={{ gridColumn: '9 / 14', gridRow: '2', justifySelf: 'center' }}>
          <Primitive name="prim-vt">&lt;ViewTransition&gt;</Primitive>
        </div>
      </div>
    </div>
  </Slide>,

  // 6. Clean — when async is fast, it feels synchronous
  <Slide key="cycle-clean">
    <div style={{ viewTransitionName: 'cycle-title' }}>
      <SlideTitle>Async React Render Cycle</SlideTitle>
    </div>
    <div className="mt-12 flex flex-col items-center gap-6">
      <p
        className="text-primary font-mono text-xl font-bold tracking-wide"
        style={{ viewTransitionName: 'transition-label' }}
      >
        transition
      </p>
      <div
        className="inline-grid items-center gap-x-5 gap-y-6"
        style={{ gridTemplateColumns: 'repeat(7, auto)' }}
      >
        <div
          className="bg-primary/5 border-primary/30 col-span-full grid grid-cols-subgrid items-center rounded-2xl border-2 border-dashed px-8 py-6"
          style={{ viewTransitionName: 'transition-border' }}
        >
          <CycleBox name="box-event">Event</CycleBox>
          <CycleArrow name="arrow-1" />
          <CycleBox name="box-update">Update</CycleBox>
          <CycleArrow name="arrow-2" />
          <CycleBox name="box-render">Render</CycleBox>
          <CycleArrow name="arrow-3" />
          <CycleBox name="box-commit">Commit</CycleBox>
        </div>
        <div style={{ gridColumn: '1 / 4', gridRow: '2', justifySelf: 'center' }}>
          <Primitive name="prim-optimistic">useOptimistic()</Primitive>
        </div>
        <div style={{ gridColumn: '3 / 6', gridRow: '2', justifySelf: 'center' }}>
          <Primitive name="prim-suspense">&lt;Suspense&gt;</Primitive>
        </div>
        <div style={{ gridColumn: '5 / 8', gridRow: '2', justifySelf: 'center' }}>
          <Primitive name="prim-vt">&lt;ViewTransition&gt;</Primitive>
        </div>
      </div>
      <NetworkNote name="network-note">
        &lt; 150ms — feels synchronous · &gt; 150ms — in-between states appear
      </NetworkNote>
    </div>
  </Slide>,
];
