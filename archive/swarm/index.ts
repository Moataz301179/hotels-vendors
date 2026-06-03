/**
 * Swarm Autonomous Agent System — Public API
 * Export everything needed to interact with the swarm
 */

// Core engine
export { executeLLM, getProviderHealth, type RouterResult, type RouterOptions } from "./model-router";
export { addSwarmJob, setupScheduledJobs, initializeSwarmWorkers, type SwarmJobPayload } from "./scheduler";
export { storeMemory, getMemoryContext, searchMemories, getRecentMemories, cleanupExpiredMemories } from "./memory";
export { recordSwarmEvent, getSwarmHealth, getSquadPerformance, acknowledgeEvent } from "./monitoring";

// Director
export { createDailyBattlePlan, assignMissions, reviewSquadPerformance, runGrowthSnowball, triggerDirectorCycle } from "./director";

// Agent definitions
export { SWARM_AGENTS, getAgentById, getAgentsBySquad, getAllAgentIds, type SwarmAgentDef } from "./agents";
