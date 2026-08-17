"use client";

import { useState, useEffect } from "react";
import { registry } from "@/lib/agos/registry";

const LeadsPage = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    status: "all",
    hotelSize: "all",
    location: "all",
    supplierTier: "all"
  });
  const [status, setStatus] = useState("");

  const agents = registry.getAgents();
  const tools = registry.getTools();

  // Demo lead data - in production, this would come from API
  const demoLeads: any[] = [
    {
      id: "LH-001",
      hotelName: "Four Seasons, Cairo",
      hotelId: "HS001",
      location: "Cairo, Egypt",
      hotelSize: "5-Star",
      supplierTier: "PREFERRED",
      contact: "Ahmed Mohammed",
      email: "ahmed@fourseasons-eg.com",
      phone: "+20 2 1234 5678",
      status: "qualified",
      engagementScore: 85,
      lastContact: "2026-08-10",
      notes: "Interested in F&B supplies, budget EGP 200K/month",
      agentId: "procurement-agent",
      nextAction: "Send F&B catalog",
      predictedClose: "2026-09-15",
      estimatedValue: "EGP 250,000"
    },
    {
      id: "LH-002",
      hotelName: "Sofitel, Alexandria",
      hotelId: "HS002",
      location: "Alexandria, Egypt",
      hotelSize: "5-Star",
      supplierTier: "STRATEGIC",
      contact: "Sarah Chen",
      email: "sarah@sofitel-alex.com",
      phone: "+20 3 8765 4321",
      status: "negotiating",
      engagementScore: 72,
      lastContact: "2026-08-08",
      notes: "Requesting sample shipments, budget EGP 150K/month",
      agentId: "procurement-agent",
      nextAction: "Follow up samples",
      predictedClose: "2026-09-01",
      estimatedValue: "EGP 180,000"
    },
    {
      id: "LH-003",
      hotelName: "Marriott, Luxor",
      hotelId: "HS003",
      location: "Luxor, Egypt",
      hotelSize: "4-Star",
      supplierTier: "CORE",
      contact: "Mohamed Ali",
      email: "mohamed@marriott-luxor.com",
      phone: "+20 95 7777 8888",
      status: "qualified",
      engagementScore: 68,
      lastContact: "2026-08-12",
      notes: "New procurement cycle starting, budget EGP 80K/month",
      agentId: "procurement-agent",
      nextAction: "Send welcome package",
      predictedClose: "2026-10-01",
      estimatedValue: "EGP 100,000"
    }
  ];

  useEffect(() => {
    setLeads(demoLeads);
  }, []);

  const handleExecute = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setSelectedLead(lead);
    setStatus(`Executing agent for ${lead.hotelName}...`);

    // Simulate agent execution
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = {
      leadId,
      status: "agent_executed",
      recommendations: [
        "Send F&B catalog to procurement@hotel.com",
        "Schedule video call with supplier panel",
        "Initiate credit assessment via factoring agent"
      ],
      predictedClose: lead.predictedClose,
      estimatedValue: lead.estimatedValue
    };

    setStatus(`Agent executed for ${lead.hotelName}`);
    setTimeout(() => setSelectedLead(null), 3000);
    return result;
  };

  const statusFilter = () =>
    filters.status === "all"
      ? leads
      : leads.filter(l => l.status === filters.status);

  const hotelSizeFilter = () =>
    filters.hotelSize === "all"
      ? leads
      : leads.filter(l => l.hotelSize === filters.hotelSize);

  const locationFilter = () =>
    filters.location === "all"
      ? leads
      : leads.filter(l => l.location === filters.location);

  const supplierTierFilter = () =>
    filters.supplierTier === "all"
      ? leads
      : leads.filter(l => l.supplierTier === filters.supplierTier);

  const filteredLeads = statusFilter()
    .filter(hotelSizeFilter)
    .filter(locationFilter)
    .filter(supplierTierFilter);

  if (selectedLead) {
    return (
      <div className="p-6 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold text-gray-200 mb-6">
          📊 Lead: {selectedLead.hotelName}
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Lead Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Hotel Name</p>
              <p className="font-medium">{selectedLead.hotelName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Location</p>
              <p className="font-medium">{selectedLead.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Hotel Size</p>
              <p className="font-medium bg-blue-500 text-white px-2 rounded">{selectedLead.hotelSize}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Supplier Tier</p>
              <p className="font-medium bg-green-500 text-white px-2 rounded">{selectedLead.supplierTier}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Contact Info</p>
            <ul className="space-y-2">
              <li>
                <strong>Contact:</strong> {selectedLead.contact}
              </li>
              <li>
                <strong>Email:</strong> <a href={`mailto:${selectedLead.email}`}>{selectedLead.email}</a>
              </li>
              <li>
                <strong>Phone:</strong> {selectedLead.phone}
              </li>
            </ul>

            <p className="text-sm text-gray-400 mt-4">Notes</p>
            <p className="text-gray-300 italic">{selectedLead.notes}</p>

            <p className="text-sm text-gray-400 mt-4">Predicted Close</p>
            <p className="font-medium bg-green-500 text-white px-2 rounded">{selectedLead.predictedClose}</p>

            <p className="text-sm text-gray-400 mt-4">Estimated Value</p>
            <p className="font-medium bg-yellow-500 text-white px-2 rounded">{selectedLead.estimatedValue}</p>

            <button
              onClick={() => setSelectedLead(null)}
              className="mt-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold text-gray-200 mb-4">📋 Lead Generation</h1>

      <div className="flex mb-4 gap-2">
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
        >
          <option value="all">All Statuses</option>
          <option value="qualified">Qualified</option>
          <option value="negotiating">Negotiating</option>
          <option value="contacted">Contacted</option>
        </select>

        <select
          value={filters.hotelSize}
          onChange={e => setFilters({ ...filters, hotelSize: e.target.value })}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white w-48"
        >
          <option value="all">All Sizes</option>
          <option value="5-Star">5-Star</option>
          <option value="4-Star">4-Star</option>
          <option value="3-Star">3-Star</option>
        </select>

        <select
          value={filters.supplierTier}
          onChange={e => setFilters({ ...filters, supplierTier: e.target.value })}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white w-48"
        >
          <option value="all">All Tiers</option>
          <option value="CORE">CORE</option>
          <option value="PREFERRED">PREFERRED</option>
          <option value="STRATEGIC">STRATEGIC</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition cursor-pointer"
            onClick={() => setSelectedLead(lead)}
          >
            <div className="flex items-center justify-between mb-2">
              <strong className="text-lg">{lead.hotelName}</strong>
              <span className="text-xs bg-blue-500 text-white px-2 rounded">
                {lead.status}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">{lead.location}</p>
            <p className="text-sm font-medium">
              {lead.estimatedValue} · {lead.hotelSize}
            </p>
            <p className="text-sm text-gray-400">
              {lead.contact} · Engagement: {lead.engagementScore}%
            </p>
          </div>
        ))}
      </div>

      {selectedLead && (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Agent Execution</h2>
          <p className="text-gray-300 mb-4">
            Executing {selectedLead.agentId} agent for {selectedLead.hotelName}...
          </p>
          <button
            onClick={() => handleExecute(selectedLead.id)}
            disabled={true}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium"
          >
            ▶ Run Agent
          </button>
          {status && (
            <p className="mt-2 text-sm text-gray-400">
              Agent status: <span className="font-medium bg-blue-500 text-white px-2 rounded">Running</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadsPage;