'use client';

import { DashboardShell } from '@/components/dashboard/shell';
import { DumpChat } from '@/components/cognitive/dump-chat';

export default function DumpTinglesPage() {
  return (
    <DashboardShell>
      <div className="h-[calc(100vh-180px)] min-h-[600px] glass rounded-[2.5rem] border-white/5 overflow-hidden">
        <DumpChat />
      </div>
    </DashboardShell>
  );
}
