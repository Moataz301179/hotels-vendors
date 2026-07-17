import IntegrationModeToggle from '@/app/(dashboard)/shared/integration-config/integration-mode-toggle';

export default function AdminIntegrationConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Oliv Integration Configuration</h1>
        <p className="text-gray-400 text-sm">Toggle between Phase 1 (Invoice Upload) and Phase 2 (Supplier Plugin)</p>
      </div>
      <IntegrationModeToggle />
    </div>
  );
}
