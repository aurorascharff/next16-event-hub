import {
  Slide,
  SlideTitle,
  SlideBadge,
  SlideSpeaker,
} from 'nextjs-slides';

function CycleBox({ children }: { children: React.ReactNode }) {
  return <div className="border-primary rounded-lg border px-6 py-3 text-lg font-medium">{children}</div>;
}

function CycleLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground text-base">{children}</span>;
}

function Primitive({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-primary border-primary/40 border-b-2 border-dashed pb-1 font-mono text-lg">
      {children}
    </span>
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
    <SlideTitle>Async React Render Cycle</SlideTitle>
    <div className="mt-16 flex items-center justify-center gap-4">
      <CycleBox>Event</CycleBox>
      <CycleBox>Update</CycleBox>
      <CycleBox>Render</CycleBox>
      <CycleBox>Commit</CycleBox>
    </div>
  </Slide>,

  // 3. With in-between states — busy, loading, done
  <Slide key="cycle-states">
    <SlideTitle>Async React Render Cycle</SlideTitle>
    <div className="mt-16 flex items-center justify-center gap-4">
      <CycleBox>Event</CycleBox>
      <CycleLabel>busy</CycleLabel>
      <CycleBox>Update</CycleBox>
      <CycleLabel>loading</CycleLabel>
      <CycleBox>Render</CycleBox>
      <CycleLabel>done</CycleLabel>
      <CycleBox>Commit</CycleBox>
    </div>
  </Slide>,

  // 4. Wrapped in a transition
  <Slide key="cycle-transition">
    <SlideTitle>Async React Render Cycle</SlideTitle>
    <div className="mt-12 flex flex-col items-center gap-8">
      <p className="text-primary text-xl font-bold tracking-wide">transition</p>
      <div className="border-primary/40 flex items-center gap-4 rounded-2xl border-2 px-6 py-5">
        <CycleBox>Event</CycleBox>
        <CycleLabel>busy</CycleLabel>
        <CycleBox>Update</CycleBox>
        <CycleLabel>loading</CycleLabel>
        <CycleBox>Render</CycleBox>
        <CycleLabel>done</CycleLabel>
        <CycleBox>Commit</CycleBox>
      </div>
    </div>
  </Slide>,

  // 5. With primitives mapped to each phase
  <Slide key="cycle-primitives">
    <SlideTitle>Async React Render Cycle</SlideTitle>
    <div className="mt-12 flex flex-col items-center gap-8">
      <p className="text-primary text-xl font-bold tracking-wide">transition</p>
      <div className="border-primary/40 flex items-center gap-4 rounded-2xl border-2 px-6 py-5">
        <CycleBox>Event</CycleBox>
        <CycleLabel>busy</CycleLabel>
        <CycleBox>Update</CycleBox>
        <CycleLabel>loading</CycleLabel>
        <CycleBox>Render</CycleBox>
        <CycleLabel>done</CycleLabel>
        <CycleBox>Commit</CycleBox>
      </div>
      <div className="flex gap-10">
        <Primitive>useOptimistic()</Primitive>
        <Primitive>&lt;Suspense&gt;</Primitive>
        <Primitive>&lt;ViewTransition&gt;</Primitive>
      </div>
    </div>
  </Slide>,

  // 6. Clean — when async is fast, it feels synchronous
  <Slide key="cycle-clean">
    <SlideTitle>Async React Render Cycle</SlideTitle>
    <div className="mt-12 flex flex-col items-center gap-8">
      <p className="text-primary text-xl font-bold tracking-wide">transition</p>
      <div className="border-primary/40 flex items-center gap-4 rounded-2xl border-2 px-6 py-5">
        <CycleBox>Event</CycleBox>
        <CycleBox>Update</CycleBox>
        <CycleBox>Render</CycleBox>
        <CycleBox>Commit</CycleBox>
      </div>
      <div className="flex gap-10">
        <Primitive>useOptimistic()</Primitive>
        <Primitive>&lt;Suspense&gt;</Primitive>
        <Primitive>&lt;ViewTransition&gt;</Primitive>
      </div>
    </div>
  </Slide>,
];
