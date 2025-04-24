import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardHeader } from '@/components/dashboard/header';
import { UserSettings } from '@/components/settings/user-settings';

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your account and preferences."
      />
      <UserSettings />
    </DashboardShell>
  );
}