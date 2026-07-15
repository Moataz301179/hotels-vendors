'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface IntegrationConfig {
  phase1Enabled: boolean;
  phase2Enabled: boolean;
  olimIntegrationMode: 'upload' | 'plugin' | 'both';
  minOrderAmount: number;
  platformFeeRate: number;
  advanceRate: number;
  financingDays: number[];
}

export default function IntegrationModeToggle() {
  const [config, setConfig] = useState<IntegrationConfig>({
    phase1Enabled: true,
    phase2Enabled: false,
    olimIntegrationMode: 'upload',
    minOrderAmount: 5000,
    platformFeeRate: 2,
    advanceRate: 88,
    financingDays: [30, 60, 90, 120],
  });
  const [saving, setSaving] = useState(false);

  const handleToggle = async (phase: 'phase1' | 'phase2') => {
    const newConfig = { ...config };
    if (phase === 'phase1') {
      newConfig.phase1Enabled = !newConfig.phase1Enabled;
      if (!newConfig.phase1Enabled && !newConfig.phase2Enabled) {
        newConfig.phase1Enabled = true; // At least one must be active
      }
    } else {
      newConfig.phase2Enabled = !newConfig.phase2Enabled;
      if (!newConfig.phase1Enabled && !newConfig.phase2Enabled) {
        newConfig.phase2Enabled = true;
      }
    }

    // Update integration mode
    if (newConfig.phase1Enabled && newConfig.phase2Enabled) {
      newConfig.olimIntegrationMode = 'both';
    } else if (newConfig.phase1Enabled) {
      newConfig.olimIntegrationMode = 'upload';
    } else {
      newConfig.olimIntegrationMode = 'plugin';
    }

    setConfig(newConfig);
    await saveConfig(newConfig);
  };

  const saveConfig = async (cfg: IntegrationConfig) => {
    setSaving(true);
    try {
      await fetch('/api/v1/admin/integration-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
    } catch (err) {
      console.error('Failed to save config:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Oliv Integration Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Phase 1 Toggle */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Phase 1: Invoice Upload</p>
              <p className="text-sm text-gray-400 mt-1">
                Hotels upload paper invoices for financing. Zero supplier integration needed.
              </p>
              <p className="text-xs text-[#39ff7e] mt-2">Active — works immediately</p>
            </div>
            <button
              onClick={() => handleToggle('phase1')}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                config.phase1Enabled ? 'bg-[#39ff7e]' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  config.phase1Enabled ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Phase 2 Toggle */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white font-medium">Phase 2: Supplier Plugin</p>
              <p className="text-sm text-gray-400 mt-1">
                Drop-in checkout widget for supplier e-commerce platforms.
              </p>
              <p className="text-xs text-[#c455ff] mt-2">
                {config.phase2Enabled ? 'Enabled — plugin available' : 'Disabled — enable when suppliers are ready'}
              </p>
            </div>
            <button
              onClick={() => handleToggle('phase2')}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                config.phase2Enabled ? 'bg-[#39ff7e]' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  config.phase2Enabled ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Current Mode Display */}
          <div className="p-4 bg-[#39ff7e]/5 border border-[#39ff7e]/20 rounded-xl">
            <p className="text-sm text-gray-400">Current Integration Mode</p>
            <p className="text-lg font-bold text-[#39ff7e] mt-1">
              {config.olimIntegrationMode === 'upload' && 'Phase 1 Only — Invoice Upload'}
              {config.olimIntegrationMode === 'plugin' && 'Phase 2 Only — Supplier Plugin'}
              {config.olimIntegrationMode === 'both' && 'Both Phases Active'}
            </p>
          </div>

          {/* Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Min Order (EGP)</label>
              <input
                type="number"
                value={config.minOrderAmount}
                onChange={(e) => setConfig({ ...config, minOrderAmount: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#39ff7e] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Platform Fee (%)</label>
              <input
                type="number"
                value={config.platformFeeRate}
                onChange={(e) => setConfig({ ...config, platformFeeRate: parseFloat(e.target.value) })}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#39ff7e] focus:outline-none"
                step="0.1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Advance Rate (%)</label>
              <input
                type="number"
                value={config.advanceRate}
                onChange={(e) => setConfig({ ...config, advanceRate: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#39ff7e] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Financing Days</label>
              <input
                type="text"
                value={config.financingDays.join(', ')}
                onChange={(e) => setConfig({ ...config, financingDays: e.target.value.split(',').map(Number) })}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#39ff7e] focus:outline-none"
              />
            </div>
          </div>

          {saving && (
            <p className="text-xs text-gray-400 text-right">Saving...</p>
          )}
        </CardContent>
      </Card>

      {/* Plugin Code Snippet (Phase 2) */}
      {config.phase2Enabled && (
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Supplier Plugin Code</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-3">
              Share this snippet with suppliers to add HotelsVendors financing to their checkout:
            </p>
            <pre className="bg-black/40 rounded-lg p-4 text-sm text-[#39ff7e] overflow-x-auto">
              {`<script src="https://hotelsvendors.com/plugin.js"
  data-api-key="hv_SUPPLIER_API_KEY"
  data-supplier-id="SUPPLIER_ID">
</script>`}
            </pre>
            <p className="text-xs text-gray-500 mt-2">
              Each supplier gets a unique API key and ID from the admin panel.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
