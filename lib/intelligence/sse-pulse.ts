/**
 * SSE Pulse — Server-Sent Events for Real-Time Admin Dashboard
 * Hotels Vendors Intelligence Layer
 *
 * Uses SSE (not WebSockets) for unidirectional real-time updates.
 * Vercel Edge Functions compatible. Auto-reconnect. No persistent connections.
 */

// ─────────────────────────────────────────
// 1. EVENT TYPES
// ─────────────────────────────────────────

export type PulseEventType =
  | "order.approved"
  | "order.rejected"
  | "factoring.disbursed"
  | "factoring.defaulted"
  | "eta.validated"
  | "eta.rejected"
  | "risk.alert"
  | "security.breach"
  | "agent.action"
  | "system.health";

export interface PulseEvent {
  id: string;
  type: PulseEventType;
  timestamp: number;
  data: Record<string, unknown>;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

// ─────────────────────────────────────────
// 2. SSE STREAM GENERATOR
// ─────────────────────────────────────────

/**
 * Create an SSE stream for the admin dashboard.
 * Usage in API route:
 *
 * export async function GET(request: Request) {
 *   const stream = createPulseStream();
 *   return new Response(stream, {
 *     headers: {
 *       "Content-Type": "text/event-stream",
 *       "Cache-Control": "no-cache",
 *       "Connection": "keep-alive",
 *     },
 *   });
 * }
 */
export function createPulseStream(): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      // Send initial heartbeat
      controller.enqueue(encoder.encode("event: connected\ndata: {}\n\n"));

      // Subscribe to events
      const unsubscribe = subscribeToPulse((event) => {
        const sseMessage = formatSSE(event);
        controller.enqueue(encoder.encode(sseMessage));
      });

      // Keep-alive ping every 30 seconds
      const pingInterval = setInterval(() => {
        controller.enqueue(encoder.encode("event: ping\ndata: {}\n\n"));
      }, 30000);

      // Cleanup on close
      requestCloseSignal().then(() => {
        clearInterval(pingInterval);
        unsubscribe();
        controller.close();
      });
    },
  });
}

// ─────────────────────────────────────────
// 3. EVENT FORMATTING
// ─────────────────────────────────────────

function formatSSE(event: PulseEvent): string {
  const lines = [
    `id: ${event.id}`,
    `event: ${event.type}`,
    `data: ${JSON.stringify({
      timestamp: event.timestamp,
      severity: event.severity,
      ...event.data,
    })}`,
    "", // Empty line terminates the event
  ];
  return lines.join("\n") + "\n";
}

// ─────────────────────────────────────────
// 4. IN-MEMORY EVENT BUS (Development)
// ─────────────────────────────────────────

type PulseSubscriber = (event: PulseEvent) => void;

const subscribers = new Set<PulseSubscriber>();

export function subscribeToPulse(callback: PulseSubscriber): () => void {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

export function publishPulseEvent(event: PulseEvent): void {
  for (const subscriber of subscribers) {
    try {
      subscriber(event);
    } catch {
      // Ignore subscriber errors
    }
  }
}

// ─────────────────────────────────────────
// 5. PUBLISH HELPERS
// ─────────────────────────────────────────

export function publishOrderApproved(orderId: string, hotelName: string, amount: number): void {
  publishPulseEvent({
    id: `evt_${Date.now()}`,
    type: "order.approved",
    timestamp: Date.now(),
    severity: "INFO",
    data: { orderId, hotelName, amount, currency: "EGP" },
  });
}

export function publishFactoringDisbursed(invoiceId: string, supplierName: string, amount: number): void {
  publishPulseEvent({
    id: `evt_${Date.now()}`,
    type: "factoring.disbursed",
    timestamp: Date.now(),
    severity: "INFO",
    data: { invoiceId, supplierName, amount, currency: "EGP" },
  });
}

export function publishRiskAlert(hotelId: string, hotelName: string, riskTier: string, score: number): void {
  publishPulseEvent({
    id: `evt_${Date.now()}`,
    type: "risk.alert",
    timestamp: Date.now(),
    severity: score > 75 ? "CRITICAL" : "WARNING",
    data: { hotelId, hotelName, riskTier, score },
  });
}

export function publishSecurityBreach(userId: string, reason: string, severity: "WARNING" | "CRITICAL"): void {
  publishPulseEvent({
    id: `evt_${Date.now()}`,
    type: "security.breach",
    timestamp: Date.now(),
    severity,
    data: { userId, reason, lockedDown: severity === "CRITICAL" },
  });
}

export function publishAgentAction(agentName: string, action: string, result: string): void {
  publishPulseEvent({
    id: `evt_${Date.now()}`,
    type: "agent.action",
    timestamp: Date.now(),
    severity: "INFO",
    data: { agentName, action, result },
  });
}

export function publishSystemHealth(metric: string, value: number, unit: string): void {
  publishPulseEvent({
    id: `evt_${Date.now()}`,
    type: "system.health",
    timestamp: Date.now(),
    severity: value > 90 ? "WARNING" : "INFO",
    data: { metric, value, unit },
  });
}

// ─────────────────────────────────────────
// 6. STUB: CLOSE SIGNAL
// ─────────────────────────────────────────

function requestCloseSignal(): Promise<void> {
  // In production, this would detect client disconnect
  // For now, resolves after 5 minutes to prevent infinite streams
  return new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));
}
