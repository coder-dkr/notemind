import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardHeader } from '@/components/dashboard/header';
import { NotesGrid } from '@/components/notes/notes-grid';

export default function NotesPage() {
  return (
    <DashboardShell>
      <DashboardHeader 
        heading="My Notes" 
        text="All your thoughts and recordings in one place."
      />
      <div className="mt-8">
        <NotesGrid />
      </div>
    </DashboardShell>
  );
}
