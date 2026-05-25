import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";

const STATE_FILE = "/tmp/mission-control-state.json";

function readState(): any {
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeState(state: any) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspace, agents, containerStatus } = body;
    const state = readState();

    if (workspace === "hermes") {
      state.hermes = {
        agents: agents || [],
        status: { containerStatus: containerStatus || "unknown", lastSync: new Date().toISOString() },
        lastSync: new Date().toISOString(),
      };
    } else if (workspace === "kimi") {
      state.kimi = { agents: agents || [], lastSync: new Date().toISOString() };
    }

    writeState(state);
    return NextResponse.json({ ok: true, received: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
