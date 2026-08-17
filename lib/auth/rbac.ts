export class PermissionDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionDeniedError';
  }
}

// RBAC helper functions
export function requirePermission(permission: string): void {
  throw new PermissionDeniedError(`Permission required: ${permission}`);
}

export function withPermission(
  permission: string,
  handler: (request: any, context: any) => any
) {
  return async (request: any, context: any) => {
    // Basic permission check - in real implementation this would be more sophisticated
    // For now, just pass through the handler
    return handler(request, context);
  };
}