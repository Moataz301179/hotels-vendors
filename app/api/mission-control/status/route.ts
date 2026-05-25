import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { readFileSync } from "fs";

const STATE_FILE = "/tmp/mission-control-state.json";

function readState(): any {
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const state = readState();

    let pm2: any[] = [];
    try {
      const pm2Raw = execSync("pm2 jlist", { encoding: "utf-8", timeout: 5000 });
      const pm2List = JSON.parse(pm2Raw);
      pm2 = pm2List.map((p: any) => ({
        name: p.name,
        status: p.pm2_env.status,
        uptime: formatUptime(Date.now() - p.pm2_env.pm_uptime),
        cpu: `${p.monit?.cpu || 0}%`,
        mem: `${Math.round((p.monit?.memory || 0) / 1024 / 1024)}MB`,
      }));
    } catch { pm2 = []; }

    let queues: any[] = [];
    try {
      const { redis } = await import("@/lib/redis");
      if (redis) {
        const queueNames = ["swarm_execution", "swarm_intelligence", "eta_submission", "email"];
        for (const name of queueNames) {
          const waiting = await redis.llen(`bull:${name}:wait`).catch(() => 0);
          const active = await redis.llen(`bull:${name}:active`).catch(() => 0);
          const failed = await redis.llen(`bull:${name}:failed`).catch(() => 0);
          queues.push({ name, waiting, active, completed: 0, failed });
        }
      }
    } catch { queues = []; }

    let hermesContainer = "unknown";
    try {
      const dockerPs = execSync("docker ps --filter name=hermes-agent-son5 --format '{{.Status}}'", { encoding: "utf-8", timeout: 3000 });
      if (dockerPs.trim()) hermesContainer = "running";
    } catch { hermesContainer = "down"; }

    let lastBuild = "No build recorded";
    try {
      const stat = execSync("stat -c %Y /var/www/hotelsvendors-v2/.next/BUILD_ID", { encoding: "utf-8", timeout: 2000 });
      const ts = parseInt(stat.trim()) * 1000;
      lastBuild = new Date(ts).toISOString();
    } catch { lastBuild = "No build recorded"; }

    return NextResponse.json({
      kimi: {
        agents: state.kimi?.agents || [],
        pm2,
        queues,
        lastBuild,
      },
      hermes: {
        agents: state.hermes?.agents || [],
        containerStatus: hermesContainer,
        lastSync: state.hermes?.lastSync || "never",
      },
      syncTime: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function formatUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}
