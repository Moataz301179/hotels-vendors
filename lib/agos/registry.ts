// ════════════════════════════════════════════════════════════
// AgentOS Registry
// Central registry for agents, tools, and skills
// ════════════════════════════════════════════════════════════

export interface RegistryEntry {
  id: string;
  name: string;
  description?: string;
  type: 'agent' | 'tool' | 'skill';
  metadata?: Record<string, unknown>;
  createdAt: number;
  config?: unknown;
}

export class AgentRegistry {
  private entries: Map<string, RegistryEntry> = new Map();

  /** Register an agent */
  registerAgent(agent: RegistryEntry): void {
    this.entries.set(agent.id, {
      ...agent,
      createdAt: Date.now()
    });
  }

  /** Register a tool */
  registerTool(agent: RegistryEntry): void {
    this.registerAgent(agent);
  }

  /** Register a skill */
  registerSkill(agent: RegistryEntry): void {
    this.registerAgent(agent);
  }

  /** Get registered entry */
  getEntry(id: string): RegistryEntry | undefined {
    return this.entries.get(id);
  }

  /** List all entries */
  listEntries(): Array<RegistryEntry> {
    return Array.from(this.entries.values());
  }

  /** Get all agents */
  getAgents(): Array<RegistryEntry> {
    return Array.from(this.entries.values()).filter((e) => e.type === 'agent');
  }

  /** Get all tools */
  getTools(): Array<RegistryEntry> {
    return Array.from(this.entries.values()).filter((e) => e.type === 'tool');
  }

  /** Get all skills */
  getSkills(): Array<RegistryEntry> {
    return Array.from(this.entries.values()).filter((e) => e.type === 'skill');
  }

  /** Update entry metadata */
  updateMetadata(id: string, metadata: Record<string, unknown>): void {
    const entry = this.entries.get(id);
    if (entry) {
      entry.metadata = { ...entry.metadata, ...metadata };
    }
  }
}

// Export singleton registry
export const registry = new AgentRegistry();