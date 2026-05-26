"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Copy,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG" | "SUCCESS";
type LogTab = "PM2" | "Nginx Access" | "Nginx Error" | "Application" | "Audit";

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  stackTrace?: string;
  tab: LogTab;
}

const TAB_CONFIG: { key: LogTab; label: string }[] = [
  { key: "PM2", label: "PM2" },
  { key: "Nginx Access", label: "Nginx Access" },
  { key: "Nginx Error", label: "Nginx Error" },
  { key: "Application", label: "Application" },
  { key: "Audit", label: "Audit" },
];

const LEVEL_CONFIG: Record<
  LogLevel,
  { label: string; text: string; bg: string; border: string; icon: React.ElementType }
> = {
  ERROR: {
    label: "ERROR",
    text: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    icon: XCircle,
  },
  WARN: {
    label: "WARN",
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    icon: AlertTriangle,
  },
  INFO: {
    label: "INFO",
    text: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    icon: Info,
  },
  DEBUG: {
    label: "DEBUG",
    text: "text-white/40",
    bg: "bg-white/5",
    border: "border-white/10",
    icon: ScrollText,
  },
  SUCCESS: {
    label: "SUCCESS",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    icon: CheckCircle2,
  },
};

const ALL_LEVELS: LogLevel[] = ["ERROR", "WARN", "INFO", "DEBUG", "SUCCESS"];

const ITEMS_PER_PAGE = 20;

function generateMockLogs(): LogEntry[] {
  const logs: LogEntry[] = [];
  const now = new Date();

  const appMessages: { level: LogLevel; message: string; stackTrace?: string }[] = [
    { level: "INFO", message: "User session created for vendor #4821" },
    { level: "INFO", message: "Cache invalidated for product catalog" },
    { level: "SUCCESS", message: "Order #99231 completed successfully" },
    { level: "WARN", message: "Slow query detected on table bookings (1.2s)" },
    {
      level: "ERROR",
      message: "Database connection pool exhausted — retrying",
      stackTrace:
        "Error: Connection pool exhausted\n    at Pool.acquire (/app/node_modules/pg-pool/index.js:123:11)\n    at async executeQuery (/app/src/db/client.ts:45:20)\n    at async getVendorProducts (/app/src/services/vendor.ts:112:15)",
    },
    {
      level: "ERROR",
      message: "Unhandled rejection in payment webhook handler",
      stackTrace:
        "UnhandledPromiseRejection: Stripe signature verification failed\n    at verifyWebhookSignature (/app/src/payments/stripe.ts:88:9)\n    at async handleWebhook (/app/src/routes/webhooks.ts:34:5)",
    },
    { level: "INFO", message: "Cron job invoice-reminder executed at 06:00 UTC" },
    { level: "WARN", message: "JWT token refreshed for user u-9921" },
    { level: "SUCCESS", message: "Bulk import finished: 432 products updated" },
    {
      level: "ERROR",
      message: "Stripe API rate limit approached (78/100)",
      stackTrace:
        "StripeRateLimitError: Request rate limit exceeded\n    at Function.generate (/app/node_modules/stripe/lib/Error.js:42:16)\n    at res.toJSON.then.StripeAPIError.message (/app/node_modules/stripe/lib/StripeResource.js:219:23)",
    },
    { level: "INFO", message: "Email queued: welcome-v2 to 12 recipients" },
    { level: "WARN", message: "Memory usage exceeded 75% threshold on worker-3" },
    { level: "DEBUG", message: "Parsed request body: { vendorId: 4821, filters: { active: true } }" },
    { level: "DEBUG", message: "Redis cache hit for key: vendor:4821:dashboard" },
    { level: "SUCCESS", message: "Payment intent pi_3Oxxxxx confirmed for $299.00" },
    { level: "INFO", message: "Webhook delivered to https://vendor.example.com/hooks/order" },
    { level: "WARN", message: "Deprecation warning: API v1 endpoints will be removed in v3.0" },
    {
      level: "ERROR",
      message: "Failed to connect to Redis cluster node redis-02.internal",
      stackTrace:
        "RedisConnectionError: Connection refused\n    at Socket.<anonymous> (/app/node_modules/ioredis/built/redis/index.js:341:37)\n    at Object.onceWrapper (node:events:632:26)",
    },
    { level: "INFO", message: "Background job dispatched: generate-monthly-reports" },
    { level: "DEBUG", message: "Prisma query: SELECT * FROM Booking WHERE status = 'confirmed'" },
  ];

  const pm2Messages: { level: LogLevel; message: string; stackTrace?: string }[] = [
    { level: "INFO", message: "PM2 Starting app hotels-api in cluster_mode" },
    { level: "SUCCESS", message: "App hotels-api successfully started (pid 18421)" },
    { level: "WARN", message: "App hotels-web exceeded memory limit (528MB)" },
    {
      level: "ERROR",
      message: "App hotels-worker exited with code 1 via signal SIGTERM",
      stackTrace:
        "SIGTERM received\n    at process.exit (node:internal/process/per_thread.js:184:15)\n    at /app/node_modules/pm2/lib/ProcessContainer.js:303:15",
    },
    { level: "INFO", message: "PM2 Stopping app hotels-worker" },
    { level: "SUCCESS", message: "App hotels-worker successfully stopped" },
    { level: "INFO", message: "PM2 Starting app hotels-worker in fork_mode" },
    { level: "WARN", message: "App hotels-api restart count exceeded 5 in 1 minute" },
    {
      level: "ERROR",
      message: "Process hotels-api unreachable after 3 health checks",
      stackTrace:
        "HealthCheckFailed: No response from /health on port 3000\n    at checkProcessHealth (/app/node_modules/pm2/lib/God/ActionMethods.js:445:19)",
    },
    { level: "INFO", message: "PM2 log rotation triggered for hotels-api" },
    { level: "DEBUG", message: "PM2 Monitoring: cpu=12.4% mem=184MB for hotels-api" },
    { level: "SUCCESS", message: "App hotels-api restarted gracefully (zero downtime)" },
    { level: "WARN", message: "App hotels-worker memory limit set to 512MB but using 498MB" },
    { level: "INFO", message: "PM2 Saving process list to /root/.pm2/dump.pm2" },
    { level: "DEBUG", message: "PM2 God daemon heartbeat: pid 1, uptime 14d 3h" },
    { level: "ERROR", message: "App hotels-cron not found in process list" },
    { level: "SUCCESS", message: "App hotels-cron started (pid 29104)" },
    { level: "INFO", message: "PM2 watchdog enabled for all processes" },
    { level: "WARN", message: "App hotels-web high CPU usage detected: 94% for 30s" },
  ];

  const nginxAccessMessages: { level: LogLevel; message: string }[] = [
    { level: "INFO", message: "GET /api/v2/products?page=3 HTTP/1.1 200 4.2ms" },
    { level: "INFO", message: "POST /api/v2/orders HTTP/1.1 201 12.8ms" },
    { level: "WARN", message: "GET /admin/legacy-reports HTTP/1.1 404 1.1ms" },
    { level: "ERROR", message: "POST /api/v2/payments/charge HTTP/1.1 502 30.1ms" },
    { level: "INFO", message: "GET /_next/static/chunks/main.js HTTP/1.1 200 0.8ms" },
    { level: "INFO", message: "GET /dashboard/analytics HTTP/1.1 200 8.4ms" },
    { level: "WARN", message: "GET /api/v1/deprecated/feed HTTP/1.1 410 2.3ms" },
    { level: "ERROR", message: "POST /webhooks/stripe HTTP/1.1 500 45.2ms" },
    { level: "INFO", message: "GET /health/live HTTP/1.1 200 0.4ms" },
    { level: "INFO", message: "GET /api/v2/vendors/4821/profile HTTP/1.1 200 3.1ms" },
    { level: "DEBUG", message: "GET /api/v2/search?q=resort HTTP/1.1 200 156ms" },
    { level: "INFO", message: "POST /api/v2/auth/refresh HTTP/1.1 200 2.1ms" },
    { level: "WARN", message: "GET /wp-admin.php HTTP/1.1 403 0.3ms" },
    { level: "INFO", message: "GET /api/v2/bookings/upcoming HTTP/1.1 200 6.7ms" },
    { level: "SUCCESS", message: "POST /api/v2/checkout/confirm HTTP/1.1 200 18.3ms" },
    { level: "INFO", message: "GET /sitemap.xml HTTP/1.1 200 1.2ms" },
    { level: "WARN", message: "GET /.env HTTP/1.1 403 0.2ms" },
    { level: "DEBUG", message: "GET /api/v2/admin/metrics HTTP/1.1 200 4.5ms" },
    { level: "INFO", message: "POST /api/v2/reviews HTTP/1.1 201 7.8ms" },
  ];

  const nginxErrorMessages: { level: LogLevel; message: string; stackTrace?: string }[] = [
    {
      level: "ERROR",
      message: "upstream prematurely closed connection while reading response header from upstream",
      stackTrace:
        "upstream: \"http://127.0.0.1:3000/api/v2/payments/charge\"\nrequest: \"POST /api/v2/payments/charge HTTP/1.1\"\nhost: \"api.hotelsvendors.com\"",
    },
    { level: "WARN", message: "client intended to send too large body: 15728640 bytes" },
    {
      level: "ERROR",
      message: "no live upstreams while connecting to upstream",
      stackTrace:
        "upstream: \"hotels_api_cluster\"\nrequest: \"GET /health HTTP/1.1\"\nhost: \"localhost\"",
    },
    { level: "WARN", message: "an upstream response is buffered to a temporary file" },
    {
      level: "ERROR",
      message: "SSL_do_handshake() failed (SSL: error:0A00006C:SSL routines::bad key share)",
      stackTrace:
        "SSL: error:0A00006C:SSL routines::bad key share\nclient: 192.168.1.105, server: hotelsvendors.com",
    },
    {
      level: "ERROR",
      message: "connect() failed (111: Connection refused) while connecting to upstream",
      stackTrace:
        "upstream: \"http://127.0.0.1:3001\"\nrequest: \"POST /webhooks/stripe HTTP/1.1\"",
    },
    { level: "WARN", message: "limiting requests, excess: 0.432 by zone \"api_limit\"" },
    {
      level: "ERROR",
      message: "recv() failed (104: Connection reset by peer) while reading response from upstream",
      stackTrace:
        "upstream: \"http://127.0.0.1:3000\"\nrequest: \"GET /api/v2/products HTTP/1.1\"",
    },
    { level: "WARN", message: "request body exceeded maximum permitted size" },
    { level: "ERROR", message: "upstream sent invalid header: \"X-Internal-Trace\"" },
    { level: "WARN", message: "access forbidden by rule, client: 45.142.212.11" },
    {
      level: "ERROR",
      message: "upstream timed out (110: Connection timed out) while reading response header",
      stackTrace:
        "upstream: \"http://127.0.0.1:3000/api/v2/reports/export\"\nrequest: \"GET /api/v2/reports/export?format=csv HTTP/1.1\"",
    },
    { level: "INFO", message: "signal process started" },
    { level: "WARN", message: "using inherited sockets from \"6;\"" },
    {
      level: "ERROR",
      message: "cannot load certificate \"/etc/nginx/ssl/cert.pem\": BIO_new_file() failed",
      stackTrace:
        "SSL: error:80000002:system library::No such file or directory\npath: /etc/nginx/ssl/cert.pem",
    },
    { level: "DEBUG", message: "ngx_http_upstream_get_round_robin_peer, current: 0" },
    { level: "WARN", message: "client 103.55.144.2 closed keepalive connection" },
    { level: "INFO", message: "nginx reload signal received from master process" },
    { level: "ERROR", message: "open() \"/var/www/html/favicon.ico\" failed (2: No such file or directory)" },
    { level: "DEBUG", message: "epoll add event: fd:12 op:1 ev:00002001" },
  ];

  const auditMessages: { level: LogLevel; message: string }[] = [
    { level: "INFO", message: "User login from IP 197.45.122.8" },
    { level: "SUCCESS", message: "Role changed: admin granted to u-8842 by u-1001" },
    { level: "WARN", message: "Failed login attempt for user admin@hotelsvendors.com" },
    { level: "ERROR", message: "Unauthorized access attempt to /admin/users from IP 45.142.212.11" },
    { level: "INFO", message: "API key rotated for tenant t-441" },
    { level: "SUCCESS", message: "Two-factor authentication enabled for u-7712" },
    { level: "WARN", message: "Suspicious bulk export: 12,000 rows by u-5541" },
    { level: "ERROR", message: "Permission escalation blocked: u-3321 attempted super-admin" },
    { level: "INFO", message: "Password reset initiated for u-8891" },
    { level: "SUCCESS", message: "Vendor onboarding completed for v-9912 by u-2001" },
    { level: "WARN", message: "Login from new device: u-6612 (iOS 17, Cairo)" },
    { level: "ERROR", message: "Brute force detected: 47 failed attempts from IP 103.55.144.2" },
    { level: "INFO", message: "User logout: u-9921 from IP 197.45.122.8" },
    { level: "DEBUG", message: "Audit event queued: user_profile_update (u-4412)" },
    { level: "SUCCESS", message: "Data retention policy executed: 1,204 records archived" },
    { level: "WARN", message: "Inactive session terminated for u-2219 after 8h timeout" },
    { level: "INFO", message: "SSO integration verified for domain hotelsvendors.com" },
    { level: "DEBUG", message: "Audit log batch flushed: 512 events in 12ms" },
    { level: "ERROR", message: "GDPR data export failed for user u-9912: S3 bucket unreachable" },
    { level: "SUCCESS", message: "Security patch applied: CVE-2024-1234 remediation verified" },
  ];

  const tabMessages: Record<LogTab, { level: LogLevel; message: string; stackTrace?: string }[]> =
    {
      Application: appMessages,
      PM2: pm2Messages,
      "Nginx Access": nginxAccessMessages,
      "Nginx Error": nginxErrorMessages,
      Audit: auditMessages,
    };

  const sources: Record<LogTab, string[]> = {
    Application: ["hotels-api", "hotels-web", "hotels-worker", "stripe-webhook", "cron-runner"],
    PM2: ["pm2-god", "pm2-god", "pm2-god", "pm2-god", "pm2-god"],
    "Nginx Access": ["nginx", "nginx", "nginx", "nginx", "nginx"],
    "Nginx Error": ["nginx", "nginx", "nginx", "nginx", "nginx"],
    Audit: ["audit-service", "audit-service", "audit-service", "audit-service", "audit-service"],
  };

  let idCounter = 1;

  TAB_CONFIG.forEach((tab) => {
    const msgs = tabMessages[tab.key];
    const srcs = sources[tab.key];
    for (let i = 0; i < 14; i++) {
      const msg = msgs[i % msgs.length];
      const minutesAgo = idCounter * 2;
      const ts = new Date(now.getTime() - minutesAgo * 60000);
      logs.push({
        id: `log-${idCounter.toString().padStart(4, "0")}`,
        timestamp: ts.toISOString(),
        level: msg.level,
        source: srcs[i % srcs.length],
        message: msg.message,
        stackTrace: msg.stackTrace,
        tab: tab.key,
      });
      idCounter++;
    }
  });

  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function LevelBadge({ level }: { level: LogLevel }) {
  const config = LEVEL_CONFIG[level];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${config.text} ${config.bg} ${config.border}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function LogRow({
  log,
  index,
  onCopy,
}: {
  log: LogEntry;
  index: number;
  onCopy: (text: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, delay: index * 0.015 }}
      className={`flex flex-col border-b border-white/[0.06] transition-colors hover:bg-white/[0.03] ${
        index % 2 === 0 ? "bg-white/[0.015]" : ""
      }`}
    >
      <div className="flex flex-wrap items-start gap-3 px-4 py-3">
        <div className="flex min-w-[160px] items-center gap-1.5 text-[13px] text-white/30 shrink-0">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          {formatTimestamp(log.timestamp)}
        </div>
        <div className="shrink-0 pt-0.5">
          <LevelBadge level={log.level} />
        </div>
        <div className="min-w-[100px] text-[13px] font-medium text-white/70 shrink-0">
          {log.source}
        </div>
        <div className="flex-1 min-w-[200px] text-[13px] text-white/90">
          <span className="break-all">{log.message}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onCopy(log.message)}
            className="inline-flex items-center rounded-md p-1.5 text-white/30 transition hover:bg-white/[0.08] hover:text-white/70"
            title="Copy message"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center rounded-md p-1.5 text-[#7c3aed] transition hover:bg-[#7c3aed]/10"
            title={expanded ? "Collapse" : "Expand"}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-3 rounded-lg border border-white/[0.06] bg-[#0a0a12] p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                Full Details
              </div>
              <div className="grid gap-2 text-[12px]">
                <div className="flex gap-2">
                  <span className="text-white/30 shrink-0 w-20">ID:</span>
                  <span className="text-white/70 font-mono">{log.id}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-white/30 shrink-0 w-20">Timestamp:</span>
                  <span className="text-white/70 font-mono">{log.timestamp}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-white/30 shrink-0 w-20">Level:</span>
                  <span className="text-white/70">{log.level}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-white/30 shrink-0 w-20">Source:</span>
                  <span className="text-white/70">{log.source}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-white/30 shrink-0 w-20">Tab:</span>
                  <span className="text-white/70">{log.tab}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-white/30 shrink-0 w-20">Message:</span>
                  <span className="text-white/90 break-all">{log.message}</span>
                </div>
                {log.stackTrace && (
                  <div className="mt-1">
                    <span className="text-white/30 shrink-0 w-20 block mb-1">Stack Trace:</span>
                    <pre className="rounded-md border border-red-400/20 bg-red-400/5 p-3 text-[11px] text-red-300 font-mono whitespace-pre-wrap overflow-auto">
                      {log.stackTrace}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminLogsPage() {
  const [activeTab, setActiveTab] = useState<LogTab>("Application");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<Set<LogLevel>>(new Set(ALL_LEVELS));
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [autoRefresh, setAutoRefresh] = useState<"off" | "5s" | "10s" | "30s">("off");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const refreshLogs = useCallback(() => {
    setLogs(generateMockLogs());
    setPage(1);
  }, []);

  useEffect(() => {
    refreshLogs();
  }, [refreshLogs]);

  useEffect(() => {
    if (autoRefresh === "off") return;
    const ms = autoRefresh === "5s" ? 5000 : autoRefresh === "10s" ? 10000 : 30000;
    const interval = setInterval(() => {
      refreshLogs();
    }, ms);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshLogs]);

  useEffect(() => {
    if (copyFeedback) {
      const t = setTimeout(() => setCopyFeedback(null), 1500);
      return () => clearTimeout(t);
    }
  }, [copyFeedback]);

  const handleCopy = useCallback(
    (text: string) => {
      if (typeof navigator !== "undefined") {
        navigator.clipboard.writeText(text).then(() => setCopyFeedback("Copied!"));
      }
    },
    []
  );

  const toggleLevel = (level: LogLevel) => {
    setSelectedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
    setPage(1);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (log.tab !== activeTab) return false;
      if (!selectedLevels.has(log.level)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!log.message.toLowerCase().includes(q)) return false;
      }

      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (new Date(log.timestamp) < from) return false;
      }

      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(log.timestamp) > to) return false;
      }

      return true;
    });
  }, [logs, activeTab, selectedLevels, searchQuery, dateFrom, dateTo]);

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, page]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${activeTab.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Clear all visible logs? This is a mock action.")
    ) {
      setLogs((prev) => prev.filter((l) => l.tab !== activeTab));
      setPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0a0a12]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 md:px-6">
          {/* Top row: Brand + Title + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BrandLogo variant="dark" size="sm" className="h-10 w-auto" />
              <div>
                <h1 className="text-lg font-semibold text-white">Hotels Vendors</h1>
                <p className="text-[12px] text-white/30">System Logs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-[13px] text-white/80 transition hover:bg-white/[0.08] active:scale-[0.98]"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-[13px] text-red-400 transition hover:bg-red-400/10 active:scale-[0.98]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
              <div className="relative">
                <button
                  onClick={() => setAutoRefresh((prev) => (prev === "off" ? "5s" : prev === "5s" ? "10s" : prev === "10s" ? "30s" : "off"))}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] transition active:scale-[0.98] ${
                    autoRefresh !== "off"
                      ? "border-[#7c3aed]/40 bg-[#7c3aed]/10 text-[#7c3aed]"
                      : "border-white/[0.06] bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                  }`}
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${autoRefresh !== "off" ? "animate-spin" : ""}`}
                    style={{ animationDuration: autoRefresh === "5s" ? "3s" : autoRefresh === "10s" ? "5s" : autoRefresh === "30s" ? "8s" : "0s" }}
                  />
                  Auto {autoRefresh !== "off" ? autoRefresh : "Off"}
                </button>
              </div>
            </div>
          </div>

          {/* Search + Filter toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] py-2 pl-9 pr-4 text-[13px] text-white placeholder:text-white/20 outline-none focus:border-[#7c3aed]/50 focus:ring-1 focus:ring-[#7c3aed]/30"
              />
            </div>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] transition active:scale-[0.98] ${
                showFilters
                  ? "border-[#7c3aed]/40 bg-[#7c3aed]/10 text-[#7c3aed]"
                  : "border-white/[0.06] bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </button>
          </div>

          {/* Expanded filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-end gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                  {/* Level multi-select */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
                      Levels
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_LEVELS.map((level) => {
                        const active = selectedLevels.has(level);
                        const cfg = LEVEL_CONFIG[level];
                        return (
                          <button
                            key={level}
                            onClick={() => toggleLevel(level)}
                            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition border ${
                              active
                                ? `${cfg.text} ${cfg.bg} ${cfg.border}`
                                : "border-white/[0.06] bg-white/[0.04] text-white/30 hover:bg-white/[0.08] hover:text-white/50"
                            }`}
                          >
                            <cfg.icon className="h-3 w-3" />
                            {cfg.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date range */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
                      Date Range
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => {
                            setDateFrom(e.target.value);
                            setPage(1);
                          }}
                          className="rounded-lg border border-white/[0.06] bg-white/[0.04] py-1.5 pl-8 pr-3 text-[12px] text-white outline-none focus:border-[#7c3aed]/50 focus:ring-1 focus:ring-[#7c3aed]/30"
                        />
                      </div>
                      <span className="text-white/20 text-[12px]">to</span>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => {
                            setDateTo(e.target.value);
                            setPage(1);
                          }}
                          className="rounded-lg border border-white/[0.06] bg-white/[0.04] py-1.5 pl-8 pr-3 text-[12px] text-white outline-none focus:border-[#7c3aed]/50 focus:ring-1 focus:ring-[#7c3aed]/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reset filters */}
                  <button
                    onClick={() => {
                      setSelectedLevels(new Set(ALL_LEVELS));
                      setDateFrom("");
                      setDateTo("");
                      setSearchQuery("");
                      setPage(1);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/50 transition hover:bg-white/[0.08] hover:text-white/70"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 border-b border-white/[0.06] pb-0">
            {TAB_CONFIG.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-[13px] font-medium transition ${
                    active
                      ? "border-[#7c3aed] text-[#7c3aed]"
                      : "border-transparent text-white/40 hover:text-white/70"
                  }`}
                >
                  <ScrollText className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Copy feedback toast */}
      <AnimatePresence>
        {copyFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[13px] text-emerald-400"
          >
            {copyFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log Table */}
      <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-6">
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a0a12]">
          {/* Table header */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/30">
            <div className="min-w-[160px] shrink-0">Timestamp</div>
            <div className="shrink-0">Level</div>
            <div className="min-w-[100px] shrink-0">Source</div>
            <div className="flex-1">Message</div>
            <div className="min-w-[60px] text-right shrink-0">Actions</div>
          </div>

          {/* Rows */}
          <AnimatePresence mode="popLayout">
            {paginatedLogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-12 text-center text-[13px] text-white/30"
              >
                No logs match your filters.
              </motion.div>
            ) : (
              paginatedLogs.map((log, idx) => (
                <LogRow key={log.id} log={log} index={idx} onCopy={handleCopy} />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-white/30">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(page * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length}{" "}
              entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/60 transition hover:bg-white/[0.08] disabled:opacity-30 disabled:hover:bg-white/[0.04]"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                )
                .map((p, i, arr) => {
                  const showEllipsis = i > 0 && p - arr[i - 1] > 1;
                  return (
                    <span key={`page-${p}`} className="flex items-center gap-1">
                      {showEllipsis && (
                        <span className="px-1 text-white/20 text-[12px]">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-medium transition ${
                          p === page
                            ? "bg-[#7c3aed]/15 text-[#7c3aed] ring-1 ring-[#7c3aed]/30"
                            : "border border-white/[0.06] bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/60 transition hover:bg-white/[0.08] disabled:opacity-30 disabled:hover:bg-white/[0.04]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
