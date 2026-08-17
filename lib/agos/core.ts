// ════════════════════════════════════════════════════════════
// AgentOS Core Runtime
// Real-time agent execution, task management, and orchestration
// ════════════════════════════════════════════════════════════

interface Agent {
  id: string;
  name: string;
  type: 'agent' | 'tool' | 'skill';
  status: 'active' | 'idle' | 'failed' | 'running';
  currentTask?: string;
  lastRunTime?: number;
  metadata?: Record<string, unknown>;
}

interface Task {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agentId: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

interface RouterOptions {
  taskComplexity?: 'simple' | 'medium' | 'complex';
  timeoutMs?: number;
  model?: string;
}

export class AgentOS {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private registry: Map<string, Agent> = new Map();

  /** Register a new agent */
  registerAgent(id: string, name: string, type: 'agent' | 'tool' | 'skill', metadata?: Record<string, unknown>) {
    const agent: Agent = {
      id,
      name,
      type,
      status: 'idle',
      metadata
    };
    this.agents.set(id, agent);
    this.registry.set(id, agent);
    return agent;
  }

  /** Get agent by ID */
  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  /** Register a tool */
  registerTool(id: string, name: string, type: 'tool') {
    this.agents.set(id, {
      id,
      name,
      type,
      metadata: {}
    });
  }

  /** Register a skill */
  registerSkill(id: string, name: string, description: string) {
    this.agents.set(id, {
      id,
      name,
      description,
      type: 'skill',
      metadata: {}
    });
  }

  /** Execute a task on an agent */
  executeTask(taskId: string, agentId: string): Promise<{ result: unknown; status: string }> {
    const task = this.tasks.get(taskId);
    if (!task || !this.agents.has(agentId)) {
      throw new Error(`Task ${taskId} or agent ${agentId} not found`);
    }

    const agent = this.agents.get(agentId)!;
    const { taskComplexity = 'simple', timeoutMs = 300 } = this.routerOptions || {};

    return new Promise((resolve) => {
      const startTime = Date.now();
      const timer = setTimeout(() => {
        this.executeTaskInternal(taskId, agentId, task, agent, timeoutMs);
        resolve({ result: undefined, status: 'completed' });
      }, timeoutMs);

      // Simulate agent execution
      setTimeout(() => {
        const agent = this.agents.get(agentId);
        if (agent) {
          agent.status = 'running';
          agent.lastRunTime = Date.now();
          resolve({ result: 'execution_completed', status: 'completed' });
        } else {
          resolve({ result: 'execution_failed', status: 'failed' });
        }
      }, 2000);
    });
  }

  /** List all agents */
  listAgents(): Array<Agent> {
    return Array.from(this.agents.values());
  }

  /** List all tasks */
  listTasks(): Array<Task> {
    return Array.from(this.tasks.values());
  }

  /** Get task status */
  getTaskStatus(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /** Start a new task */
  startTask(taskId: string, agentId: string, description: string) {
    const task: Task = {
      id: taskId,
      name: description,
      description,
      status: 'pending',
      agentId,
      createdAt: Date.now(),
      startedAt: Date.now()
    };
    this.tasks.set(taskId, task);
    return task;
  }

  /** Mark task as completed */
  completeTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'completed';
      task.completedAt = Date.now();
    }
  }

  /** Get agent statistics */
  getAgentStats(agentId: string): Record<string, unknown> {
    const agent = this.agents.get(agentId);
    if (!agent) return {};
    return {
      id: agent.id,
      name: agent.name,
      type: agent.type,
      status: agent.status,
      taskCount: this.tasks.filter(t => t.agentId === agentId).length,
      lastActive: agent.lastRunTime
    };
  }
}

// Singleton instance
export const agentOS = new AgentOS();