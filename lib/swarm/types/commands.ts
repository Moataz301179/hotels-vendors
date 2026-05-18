/**
 * Slash-Command Router Engine
 * Hotels Vendors Portal Assistants — Layer 4 UI Core
 *
 * Implements deterministic slash-command pattern matching, mapping standard institutional commands
 * directly to secure versioned API endpoints, and enforces strict input vector sandboxing.
 */

export interface SlashCommandDefinition {
  command: string;
  pattern: RegExp;
  targetEndpoint: string; // Dynamic path with parameters (e.g. /api/v1/factoring/consolidated/:id/factor)
  method: "POST" | "GET";
  description: string;
}

// Absolute system slash-command registry
export const SLASH_COMMAND_REGISTRY: SlashCommandDefinition[] = [
  {
    command: "/aggregate",
    pattern: /^\/aggregate$/,
    targetEndpoint: "/api/v1/receivables/aggregate",
    method: "POST",
    description: "Triggers multi-vendor child invoice grouping into an Aggregated Debt Package.",
  },
  {
    command: "/factor",
    pattern: /^\/factor\s+([a-zA-Z0-9_\-]+)$/,
    targetEndpoint: "/api/v1/factoring/consolidated/:id/factor",
    method: "POST",
    description: "Submits an Aggregated Debt Package to a Factoring Partner for early liquidation.",
  },
  {
    command: "/approve",
    pattern: /^\/approve\s+([a-zA-Z0-9_\-]+)$/,
    targetEndpoint: "/api/v1/factoring/consolidated/:id/approve",
    method: "POST",
    description: "Executes a Four-Eyes Attestation State Transition on a pending aggregated package.",
  },
  {
    command: "/risk-audit",
    pattern: /^\/risk-audit\s+([a-zA-Z0-9_\-]+)$/,
    targetEndpoint: "/api/v1/factoring/consolidated/:id/risk-audit",
    method: "GET",
    description: "Pulls the immutable non-repudiation cryptographic verification block for underwriters.",
  },
];

export interface RoutedCommand {
  targetUrl: string;
  method: "POST" | "GET";
  args: string[];
  matchedCommand: string;
}

/**
 * Parses and routes slash-commands from the UI workspace shell.
 * Enforces the 'UNAUTHORIZED_INPUT_VECTOR' invariant to prevent conversational script injections.
 */
export function routeSlashCommand(
  rawInput: string,
  sourceWidgetId: string,
  isSandboxedHelpWidget: boolean = false
): RoutedCommand {
  const trimmedInput = rawInput.trim();

  // Invariant check: Drop raw conversational text outside the sandboxed Help Widget
  if (!trimmedInput.startsWith("/")) {
    if (!isSandboxedHelpWidget) {
      throw new Error(
        `UNAUTHORIZED_INPUT_VECTOR: Unsanctioned conversational string execution attempted at widget [${sourceWidgetId}]. Conversational interface is blocked outside the sandboxed Help Widget. Use slash commands.`
      );
    }
    
    throw new Error(
      `UNSUPPORTED_CONVERSATIONAL_INPUT: Conversational triggers must be routed through standard help channels.`
    );
  }

  // Parse and match registered command patterns
  for (const definition of SLASH_COMMAND_REGISTRY) {
    const match = trimmedInput.match(definition.pattern);
    if (match) {
      const args = match.slice(1);
      let targetUrl = definition.targetEndpoint;
      
      // Interpolate parameter placeholders (e.g. :id)
      if (args.length > 0 && targetUrl.includes(":id")) {
        targetUrl = targetUrl.replace(":id", args[0]);
      }

      return {
        targetUrl,
        method: definition.method,
        args,
        matchedCommand: definition.command,
      };
    }
  }

  throw new Error(
    `INVALID_SLASH_COMMAND: Command "${trimmedInput}" is unrecognized. Refer to registered slash-commands list.`
  );
}
