import { DashboardShell } from '@/components/dashboard/shell';
import { NoteEditor } from '@/components/notes/note-editor';

export default function NotePage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <NoteEditor id={params.id} />
    </DashboardShell>
  );
}