"use client";

import { useState } from "react";
import { registry } from "@/lib/agos/registry";

const OutreachPage = () => {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("whatsapp");
  const [campaigns, setCampaigns] = useState([]);
  const [status, setStatus] = useState("");
  const [agents] = registry.getAgents();

  const channels = [
    { value: "whatsapp", label: "📱 WhatsApp Business" },
    { value: "email", label: "📧 Email" },
    { value: "facebook", label: "📘 Facebook Messenger" },
    { value: "instagram", label: "📸 Instagram DM" }
  ];

  const channelLabels: Record<string, string> = {
    whatsapp: "WhatsApp Business",
    email: "Email",
    facebook: "Facebook Messenger",
    instagram: "Instagram DM"
  };

  const channelIcons: Record<string, string> = {
    whatsapp: "📱",
    email: "📧",
    facebook: "📘",
    instagram: "📸"
  };

  const handleStartCampaign = async () => {
    if (!campaignName || !selectedAgent) {
      setStatus("Please select agent and campaign name");
      return;
    }

    setStatus(`Starting campaign "${campaignName}" on ${channelLabels[selectedChannel]}...`);

    // Simulate campaign start
    await new Promise(resolve => setTimeout(resolve, 1500));

    const campaign = {
      id: `CAM-${Date.now()}`,
      name: campaignName,
      agentId: selectedAgent,
      channel: selectedChannel,
      status: "active",
      createdAt: Date.now(),
      leadsTargeted: 0,
      leadsReached: 0,
      conversionRate: 0
    };

    setCampaigns(prev => [...prev, campaign]);
    setCampaignName("");
    setSelectedAgent("");
    setStatus(`Campaign "${campaignName}" started successfully`);
  };

  const handleStopCampaign = async (campaignId: string) => {
    setStatus(`Stopping campaign ${campaignId}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    setStatus("Campaign stopped");
  };

  const handleAddLead = (leadId: string) => {
    setStatus(`Adding lead ${leadId} to campaign...`);
    // In production: would integrate with Meta Business API
    setTimeout(() => setStatus("Lead added to campaign"), 500);
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold text-gray-200 mb-6">
        📢 Customer Outreach Engine
      </h1>

      {/* Campaign Creator */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Campaign</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Campaign Name
            </label>
            <input
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              placeholder="e.g. Q3 F&B Push, Ramadan Special..."
              className="w-full bg-gray-700 text-white border border-gray-700 rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={selectedAgent}
              onChange={e => setSelectedAgent(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white border border-gray-700 w-full"
            >
              <option value="">Select Agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>

            <select
              value={selectedChannel}
              onChange={e => setSelectedChannel(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white border border-gray-700 w-full"
            >
              <option value="whatsapp">WhatsApp Business</option>
              <option value="email">Email</option>
              <option value="facebook">Facebook Messenger</option>
              <option value="instagram">Instagram DM</option>
            </select>
          </div>

          <button
            onClick={handleStartCampaign}
            disabled={!campaignName || !selectedAgent}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-medium"
          >
            ▶ Start Campaign
          </button>
        </div>

        {status && (
          <p className="mt-3 text-sm text-gray-300">{status}</p>
        )}
      </div>

      {/* Active Campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500 hover:bg-gray-700 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <strong className="text-sm">{campaign.name}</strong>
              <span className="text-xs bg-green-500 text-white px-1 rounded">
                {campaign.status}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Channel: {channelLabels[campaign.channel]} · Agent: {campaign.agentId}
            </p>
            <button
              onClick={() => handleStopCampaign(campaign.id)}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded"
            >
              ⏹ Stop
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Recent Activity</h2>
        <div className="space-y-3 text-sm text-gray-400">
          <div>
            <span className="font-medium">WhatsApp Bot</span>
            <span>Sent 150 auto-responses to new leads</span>
          </div>
          <div>
            <span className="font-medium">Email Sequences</span>
            <span>3 campaigns active, 420 emails sent</span>
          </div>
          <div>
            <span className="font-medium">Meta Ads</span>
            <span>287 leads generated this month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutreachPage;