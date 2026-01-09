import { DashboardShell } from '@/components/dashboard/shell';
import { ThoughtCapture } from '@/components/cognitive/thought-capture';

export default function NewThoughtPage() {
  return (
    <DashboardShell>
      <ThoughtCapture />
    </DashboardShell>
  );
}
