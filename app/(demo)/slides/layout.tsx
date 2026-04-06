import fs from 'fs';
import path from 'path';
import { parseSpeakerNotes, SlideDeck } from 'nextjs-slides';
import { slides } from './slides';

const speakerNotes = parseSpeakerNotes(
  fs.readFileSync(path.join(process.cwd(), 'app/(demo)/slides/notes.md'), 'utf-8'),
  { stripLeadingTitle: true },
);

export default function SlidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SlideDeck slides={slides} speakerNotes={speakerNotes} exitUrl="/" basePath="/slides" syncEndpoint="/api/nxs-sync" transition={false}>
      {children}
    </SlideDeck>
  );
}
