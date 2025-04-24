import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardHeader } from '@/components/dashboard/header';
import { NotesGrid } from '@/components/notes/notes-grid';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Dashboard" 
        text="View all your notes and summaries."
      />
      <NotesGrid />
    </DashboardShell>
  );
}