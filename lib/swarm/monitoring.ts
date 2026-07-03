// Stub — swarm monitoring was archived. These functions are no-ops.

export async function recordSwarmEvent(..._args: unknown[]): Promise<void> {
  // No-op — swarm monitoring archived
}

export async function getSquadPerformance(_squad?: string | number): Promise<unknown> {
  return { status: "archived", metrics: {} };
}
