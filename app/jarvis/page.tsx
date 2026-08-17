"use client";

import { useState, useEffect } from "react";
import { registry } from "@/lib/agos/registry";
import { agentOS } from "@/lib/agos/core";

// Types defined here
interface Agent {
  id: string;
  name: string;
  type: "agent" | "tool" | "skill";
  status: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
  agentId: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

const JarvisRoom = () => {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [taskId, setTaskId] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [status, setStatus] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Initialize with sample data
    const initAgents = () => {
      // Register demo agents if not already registered
      if (registry.listEntries().length === 0) {
        registry.registerAgent({
          id: "procurement-agent",
          name: "Procurement Agent",
          description: "Handles supplier orders and procurement tasks",
          type: "agent",
          createdAt: Date.now()
        });

        registry.registerAgent({
          id: "finance-agent",
          name: "Finance Agent",
          description: "Handles payment processing and financial reports",
          type: "agent",
          createdAt: Date.now()
        });

        registry.registerTool({
          id: "eta-bridge",
          name: "ETA e-Invoicing Bridge",
          description: "Handles Egyptian Tax Authority submissions",
          type: "tool",
          createdAt: Date.now()
        });
      }

      setAgents(agentOS.listAgents());
      setTasks(agentOS.listTasks());
    };
    initAgents();
  }, []);

  const handleStartTask = async () => {
    if (!taskId || !selectedAgent) return;
    const task = agentOS.startTask(taskId, selectedAgent, taskDescription);
    setStatus("Task started");
    setTasks(agentOS.listTasks());
  };

  const handleExecute = async () => {
    if (!taskId || !selectedAgent) return;
    setStatus("Executing task...");
    
    try {
      await agentOS.executeTask(taskId, selectedAgent);
      setStatus("Task completed");
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : "Unknown"}`);
    }
    setTasks(agentOS.listTasks());
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-mono">
      <header className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">AgentOS Control Room</h1>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Agent Registry */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Agents</h3>
            <ul className="space-y-2">
              {agents.map(agent => (
                <li key={agent.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <span>{agent.name}</span>
                  <button onClick={() => setSelectedAgent(agent.id)} className="text-xs bg-blue-600 px-2 py-1 rounded">Select</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Task Execution */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Execute Task</h2>
          <div className="space-y-3">
            <div>
              <label className="block mb-1">Agent:</label>
              <select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)} className="w-full bg-gray-700 p-2 rounded">
                <option value="">Select an agent</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Task ID:</label>
              <input value={taskId} onChange={e => setTaskId(e.target.value)} placeholder="unique-task-id" className="w-full bg-gray-700 p-2 rounded" />
            </div>

            <div>
              <label className="block mb-1">Task Description:</label>
              <textarea value={taskDescription} onChange={e => setTaskDescription(e.target.value)} placeholder="Task description..." className="w-full bg-gray-700 p-2 rounded" />
            </div>

            <button onClick={handleExecute} disabled={!taskId || !selectedAgent} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
              Execute Task
            </button>
          </div>
        </div>

        <div className="mt-4">
          {status && <p className="text-sm text-gray-300">Status: {status}</p>}
        </div>
      </div>
    </div>
  );
};

export default JarvisRoom;