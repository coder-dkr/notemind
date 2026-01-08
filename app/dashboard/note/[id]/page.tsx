import { DashboardShell } from '@/components/dashboard/shell';
import { NoteEditor } from '@/components/notes/note-editor';

export default async function NotePage({ params }: { params: { id: string } }) {
  const { id } =  params;
  
  return (
    <DashboardShell>
      <NoteEditor id={id} />
    </DashboardShell>
  );
}
