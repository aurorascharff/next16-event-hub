import fs from 'fs';
import path from 'path';
import { parseSpeakerNotes, SlideNotesView } from 'nextjs-slides';

const notes = parseSpeakerNotes(
  fs.readFileSync(path.join(process.cwd(), 'app/(demo)/slides/notes.md'), 'utf-8'),
  { stripLeadingTitle: true },
);

export default function NotesPage() {
  return <SlideNotesView notes={notes} syncEndpoint="/api/nxs-sync" />;
}
