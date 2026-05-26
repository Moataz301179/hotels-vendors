'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
  Clock,
  ArrowLeft,
  Activity,
  Box,
  Send,
  Terminal,
  Rocket,
  Palette,
  Server,
  Brain,
  CreditCard,
  Layers,
  ListTodo,
  PanelLeft,
  Code2,
  TestTube2,
  FileSearch,
  Check,
  Radio,
} from 'lucide-react'
import { BrandLogo } from '@/components/layout/brand-logo'
import DesignStudio from './DesignStudio'

// ─── Types ─────────────────────────────────────────────────────────

type StageStatus = 'idle' | 'active' | 'done' | 'error'

type AgentStatus = 'idle' | 'working' | 'done' | 'error'

type TaskStatus = 'live' | 'pending' | 'done'

type DeployStatus = 'idle' | 'queued' | 'building' | 'deployed'

interface PipelineStage {
  name: string
  status: StageStatus
  progress: number
  eta: string
  icon: React.ReactNode
}

interface Agent {
  id: string
  name: string
  avatarColor: string
  task: string
  progress: number
  status: AgentStatus
  eta: string
}

interface TaskItem {
  id: string
  title: string
  agent: string
  priority: 'High' | 'Medium' | 'Low'
  eta: string
  status: TaskStatus
  timestamp?: string
}

interface TodoItem {
  id: string
  title: string
  done: boolean
}

// ─── Mock Data ─────────────────────────────────────────────────────

const INITIAL_PIPELINE: PipelineStage[] = [
  { name: 'Plan', status: 'done', progress: 100, eta: '—', icon: <FileSearch size={14} /> },
  { name: 'Design', status: 'done', progress: 100, eta: '—', icon: <Palette size={14} /> },
  { name: 'Code', status: 'active', progress: 67, eta: '4 min', icon: <Code2 size={14} /> },
  { name: 'Test', status: 'idle', progress: 0, eta: '8 min', icon: <TestTube2 size={14} /> },
  { name: 'Deploy', status: 'idle', progress: 0, eta: '12 min', icon: <Rocket size={14} /> },
]

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'hermes-ui',
    name: 'Hermes-UI',
    avatarColor: '#a3e635',
    task: 'Generating React components for hotel portal',
    progress: 78,
    status: 'working',
    eta: '2 min',
  },
  {
    id: 'hermes-api',
    name: 'Hermes-API',
    avatarColor: '#06b6d4',
    task: 'Writing supplier API route handlers',
    progress: 62,
    status: 'working',
    eta: '4 min',
  },
  {
    id: 'kimi-infra',
    name: 'Kimi-Infra',
    avatarColor: '#f59e0b',
    task: 'Provisioning Docker compose services',
    progress: 45,
    status: 'working',
    eta: '6 min',
  },
  {
    id: 'kimi-deploy',
    name: 'Kimi-Deploy',
    avatarColor: '#10b981',
    task: 'Waiting for build artifacts',
    progress: 0,
    status: 'idle',
    eta: '—',
  },
  {
    id: 'grok-brain',
    name: 'Grok-Brain',
    avatarColor: '#ef4444',
    task: 'Optimizing database query patterns',
    progress: 91,
    status: 'working',
    eta: '1 min',
  },
  {
    id: 'oliv-finance',
    name: 'Oliv-Finance',
    avatarColor: '#ec4899',
    task: 'Reviewing payment webhook schemas',
    progress: 33,
    status: 'working',
    eta: '5 min',
  },
]

const INITIAL_TASKS: TaskItem[] = [
  { id: 't1', title: 'Generate hotel booking modal', agent: 'Hermes-UI', priority: 'High', eta: '2 min', status: 'live', timestamp: '2m ago' },
  { id: 't2', title: 'Write supplier GET /list endpoint', agent: 'Hermes-API', priority: 'High', eta: '3 min', status: 'live', timestamp: '5m ago' },
  { id: 't3', title: 'Optimize Prisma connection pool', agent: 'Grok-Brain', priority: 'Medium', eta: '1 min', status: 'live', timestamp: '8m ago' },
  { id: 't4', title: 'Configure Redis cache layer', agent: 'Kimi-Infra', priority: 'Medium', eta: '5 min', status: 'live', timestamp: '1m ago' },
  { id: 't5', title: 'Build Next.js production bundle', agent: 'Hermes-UI', priority: 'High', eta: '6 min', status: 'pending' },
  { id: 't6', title: 'Write payment intent controller', agent: 'Oliv-Finance', priority: 'High', eta: '4 min', status: 'pending' },
  { id: 't7', title: 'Provision PostgreSQL replica', agent: 'Kimi-Infra', priority: 'Low', eta: '10 min', status: 'pending' },
  { id: 't8', title: 'Run Lighthouse performance audit', agent: 'Grok-Brain', priority: 'Medium', eta: '3 min', status: 'pending' },
  { id: 't9', title: 'Initialize build pipeline', agent: 'Hermes-UI', priority: 'High', eta: '—', status: 'done', timestamp: '12m ago' },
  { id: 't10', title: 'Lint and type-check', agent: 'Hermes-API', priority: 'High', eta: '—', status: 'done', timestamp: '10m ago' },
  { id: 't11', title: 'Sync design tokens to Figma', agent: 'Hermes-UI', priority: 'Medium', eta: '—', status: 'done', timestamp: '15m ago' },
  { id: 't12', title: 'Validate env schema', agent: 'Kimi-Infra', priority: 'Medium', eta: '—', status: 'done', timestamp: '14m ago' },
]

const INITIAL_TODOS: TodoItem[] = [
  { id: 'td1', title: 'Review hotel portal design', done: false },
  { id: 'td2', title: 'Approve supplier API schema', done: false },
  { id: 'td3', title: 'Configure payment webhooks', done: false },
  { id: 'td4', title: 'Test factoring flow end-to-end', done: false },
  { id: 'td5', title: 'Deploy to production', done: false },
]

const LAST_DEPLOY_AT = '2026-05-25T22:42:00Z'

// ─── Helpers ───────────────────────────────────────────────────────

function statusIcon(status: StageStatus | AgentStatus | TaskStatus | string, size = 16) {
  const cls = `w-${size === 14 ? '3.5' : '4'} h-${size === 14 ? '3.5' : '4'}`
  switch (status) {
    case 'done':
    case 'Done':
      return <CheckCircle2 className={`${cls} text-emerald-400`} />
    case 'active':
    case 'working':
    case 'live':
    case 'In Progress':
    case 'Running':
      return <Loader2 className={`${cls} text-[#a3e635] animate-spin`} />
    case 'error':
      return <AlertCircle className={`${cls} text-red-400`} />
    case 'queued':
    case 'building':
      return <Loader2 className={`${cls} text-amber-400 animate-spin`} />
    case 'deployed':
      return <CheckCircle2 className={`${cls} text-emerald-400`} />
    default:
      return <Circle className={`${cls} text-white/20`} />
  }
}

function statusBadgeClasses(status: AgentStatus | TaskStatus | DeployStatus) {
  switch (status) {
    case 'working':
    case 'live':
      return 'text-[#a3e635] border-[#a3e635]/20 bg-[#a3e635]/10'
    case 'done':
      return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
    case 'error':
      return 'text-red-400 border-red-500/20 bg-red-500/10'
    case 'queued':
    case 'building':
      return 'text-amber-400 border-amber-500/20 bg-amber-500/10'
    case 'idle':
    case 'pending':
    default:
      return 'text-white/30 border-white/10 bg-white/[0.03]'
  }
}

function priorityClasses(priority: string) {
  switch (priority) {
    case 'High':
      return 'text-red-400 border-red-500/20 bg-red-500/10'
    case 'Medium':
      return 'text-amber-400 border-amber-500/20 bg-amber-500/10'
    case 'Low':
      return 'text-white/40 border-white/10 bg-white/[0.03]'
    default:
      return 'text-white/30 border-white/10 bg-white/[0.03]'
  }
}

function agentIcon(name: string) {
  if (name.includes('UI')) return <Palette size={14} />
  if (name.includes('API')) return <Code2 size={14} />
  if (name.includes('Infra')) return <Server size={14} />
  if (name.includes('Deploy')) return <Rocket size={14} />
  if (name.includes('Brain')) return <Brain size={14} />
  if (name.includes('Finance')) return <CreditCard size={14} />
  return <Box size={14} />
}

// ─── Sub-components ────────────────────────────────────────────────

function TopBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#000000]"
    >
      <div className="flex items-center gap-3">
        <BrandLogo variant="dark" size="sm" />
        <div className="h-6 w-px bg-white/[0.08]" />
        <h1 className="text-sm font-semibold text-white tracking-tight">Build Swarm Workshop</h1>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="/mission-control"
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-3 py-1.5 text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-colors"
        >
          <ArrowLeft size={13} />
          Back
        </a>

        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Online</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/30 tabular-nums">
          <Clock size={13} />
          {time}
        </div>
      </div>
    </motion.header>
  )
}

function PipelineBar({ pipeline }: { pipeline: PipelineStage[] }) {
  const activeIndex = pipeline.findIndex((s) => s.status === 'active')

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="shrink-0 px-5 py-3 border-b border-white/[0.06] bg-[#000000]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#a3e635]" />
          <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Build Pipeline</span>
        </div>
      </div>

      <div className="relative mt-3">
        {/* Connecting line background */}
        <div className="absolute top-[15px] left-[calc(10%+8px)] right-[calc(10%+8px)] h-px bg-white/[0.06]" />
        {/* Active progress line */}
        <div
          className="absolute top-[15px] left-[calc(10%+8px)] h-px bg-[#a3e635]/60"
          style={{
            width:
              activeIndex >= 0
                ? `${(activeIndex / (pipeline.length - 1)) * 100}%`
                : `${(pipeline.filter((s) => s.status === 'done').length / (pipeline.length - 1)) * 100}%`,
          }}
        />

        <div className="relative flex justify-between">
          {pipeline.map((stage, i) => {
            const isActive = stage.status === 'active'
            const isDone = stage.status === 'done'
            return (
              <div key={stage.name} className="flex flex-col items-center gap-2 w-[20%]">
                <div
                  className={
                    'w-8 h-8 rounded-full flex items-center justify-center border transition-colors ' +
                    (isDone
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : isActive
                      ? 'border-[#a3e635]/40 bg-[#a3e635]/10'
                      : stage.status === 'error'
                      ? 'border-red-500/30 bg-red-500/10'
                      : 'border-white/[0.08] bg-[#0a0a0a]')
                  }
                >
                  {isDone ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <span className={isActive ? 'text-[#a3e635]' : 'text-white/20'}>{stage.icon}</span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className={
                      'text-[11px] uppercase tracking-wider font-medium ' +
                      (isActive ? 'text-[#a3e635]' : isDone ? 'text-white/60' : 'text-white/25')
                    }
                  >
                    {stage.name}
                  </span>
                  <span className="text-[10px] text-white/20 tabular-nums">
                    {isDone ? '100%' : isActive ? `${stage.progress}%` : stage.eta}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-3.5"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{ backgroundColor: agent.avatarColor }}
          >
            {agent.name.split('-').map((p) => p[0]).join('')}
          </div>
          <div>
            <div className="text-xs font-medium text-white/90">{agent.name}</div>
            <div className="text-[10px] text-white/30">{agent.task}</div>
          </div>
        </div>
        <span
          className={
            'text-[10px] px-1.5 py-0.5 rounded-full border font-medium capitalize ' +
            statusBadgeClasses(agent.status)
          }
        >
          {agent.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2.5">
        <div className="flex-1 h-1 rounded-full bg-white/[0.06]">
          <motion.div
            className="h-1 rounded-full bg-[#a3e635]"
            initial={{ width: 0 }}
            animate={{ width: `${agent.progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className="text-[10px] text-white/30 tabular-nums w-7 text-right">{agent.progress}%</span>
      </div>

      <div className="flex items-center gap-1 mt-1.5">
        <Clock size={11} className="text-white/20" />
        <span className="text-[10px] text-white/25">ETA {agent.eta}</span>
      </div>
    </motion.div>
  )
}

function SystemStats({ agents }: { agents: Agent[] }) {
  const activeCount = agents.filter((a) => a.status === 'working').length
  const queued = agents.filter((a) => a.status === 'idle').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3 }}
      className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Radio size={14} className="text-[#a3e635]" />
        <h3 className="text-xs font-medium text-white/70">System Stats</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
          <div className="text-[10px] text-white/30 mb-1">Active Agents</div>
          <div className="text-lg font-semibold text-white tabular-nums">{activeCount}</div>
        </div>
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
          <div className="text-[10px] text-white/30 mb-1">Tasks Queued</div>
          <div className="text-lg font-semibold text-white tabular-nums">{queued}</div>
        </div>
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
          <div className="text-[10px] text-white/30 mb-1">Build Queue</div>
          <div className="text-lg font-semibold text-white tabular-nums">3</div>
        </div>
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
          <div className="text-[10px] text-white/30 mb-1">Last Deploy</div>
          <div className="text-[11px] font-medium text-white/60 tabular-nums">{new Date(LAST_DEPLOY_AT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    </motion.div>
  )
}

function TaskQueue({ tasks }: { tasks: TaskItem[] }) {
  const [tab, setTab] = useState<TaskStatus>('live')

  const filtered = tasks.filter((t) => t.status === tab)

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#a3e635]" />
          <h3 className="text-xs font-medium text-white/70">Task Queue</h3>
        </div>
      </div>

      <div className="flex px-4 pb-2 gap-1">
        {(['live', 'pending', 'done'] as TaskStatus[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              'px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ' +
              (tab === t
                ? 'text-white bg-white/[0.06]'
                : 'text-white/30 hover:text-white/50 hover:bg-white/[0.02]')
            }
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-3 pb-3 space-y-1.5 max-h-[280px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filtered.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] text-white/80 leading-snug">{task.title}</p>
                <span
                  className={
                    'shrink-0 text-[9px] px-1.5 py-0.5 rounded border font-medium ' +
                    priorityClasses(task.priority)
                  }
                >
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/25">{task.agent}</span>
                  {task.timestamp && (
                    <>
                      <span className="text-white/10">·</span>
                      <span className="text-[10px] text-white/20">{task.timestamp}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {statusIcon(task.status, 12)}
                  <span className="text-[10px] text-white/25">{task.eta}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-6 text-[11px] text-white/20">No tasks</div>
        )}
      </div>
    </motion.div>
  )
}

function TodoList() {
  const [items, setItems] = useState(INITIAL_TODOS)

  const toggle = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <ListTodo size={14} className="text-[#a3e635]" />
        <h3 className="text-xs font-medium text-white/70">Todo List</h3>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className="w-full flex items-center gap-2.5 rounded-lg border border-white/[0.04] bg-white/[0.015] p-2.5 text-left hover:bg-white/[0.03] transition-colors"
          >
            {item.done ? (
              <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
            ) : (
              <div className="shrink-0 w-3.5 h-3.5 rounded border border-white/20" />
            )}
            <span
              className={
                'text-xs ' + (item.done ? 'text-white/30 line-through' : 'text-white/70')
              }
            >
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function ApplyToHermes() {
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle')
  const [isDeploying, setIsDeploying] = useState(false)
  const [lastDeploy, setLastDeploy] = useState(LAST_DEPLOY_AT)

  const handleDeploy = () => {
    if (isDeploying) return
    setIsDeploying(true)
    setDeployStatus('queued')
    setTimeout(() => setDeployStatus('building'), 1200)
    setTimeout(() => {
      setDeployStatus('deployed')
      setIsDeploying(false)
      setLastDeploy(new Date().toISOString())
    }, 3500)
  }

  const statusLabel = deployStatus === 'idle' ? 'Idle' : deployStatus === 'queued' ? 'Queued' : deployStatus === 'building' ? 'Building' : 'Deployed'

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Rocket size={14} className="text-[#a3e635]" />
        <h3 className="text-xs font-medium text-white/70">Apply to Hermes</h3>
      </div>

      <div className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3 mb-3">
        <div className="text-[10px] text-white/30 mb-1">Design Summary</div>
        <div className="text-[11px] text-white/60 leading-relaxed">
          Hotel portal v2 — 14 components, 6 API routes, 3 Prisma models. Theme: dark mode default with #a3e635 accent.
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white transition-all hover:brightness-110 disabled:opacity-60 disabled:hover:brightness-100"
          style={{ backgroundColor: '#a3e635' }}
        >
          {isDeploying ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          {isDeploying ? 'Deploying...' : 'Deploy to Hermes'}
        </button>
        <button
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] px-3 py-2 text-xs font-medium text-white/50 hover:text-white/70 hover:bg-white/[0.03] transition-colors"
        >
          <Layers size={13} />
          Queue Build
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            {deployStatus === 'building' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />}
            <span
              className={
                'relative inline-flex rounded-full h-2 w-2 ' +
                (deployStatus === 'deployed'
                  ? 'bg-emerald-400'
                  : deployStatus === 'building' || deployStatus === 'queued'
                  ? 'bg-amber-400'
                  : 'bg-white/20')
              }
            />
          </span>
          <span className="text-[11px] text-white/40">{statusLabel}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-white/25">
          <Clock size={11} />
          Last: {new Date(lastDeploy).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function WorkshopPage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)
  const [pipeline, setPipeline] = useState<PipelineStage[]>(INITIAL_PIPELINE)
  const [tasks] = useState<TaskItem[]>(INITIAL_TASKS)

  // Simulate agent progress updates every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.status === 'working') {
            const increment = Math.floor(Math.random() * 6) + 1
            const nextProgress = Math.min(agent.progress + increment, 99)
            return { ...agent, progress: nextProgress, eta: nextProgress > 90 ? '<1 min' : agent.eta }
          }
          if (agent.status === 'idle' && Math.random() > 0.85) {
            return { ...agent, status: 'working', progress: 5, eta: '8 min', task: 'Picked up queued task' }
          }
          return agent
        })
      )

      setPipeline((prev) =>
        prev.map((stage) => {
          if (stage.status === 'active') {
            const nextProgress = Math.min(stage.progress + Math.floor(Math.random() * 4) + 1, 99)
            if (nextProgress >= 95) {
              const nextStage = prev.find((s) => s.status === 'idle')
              if (nextStage && Math.random() > 0.7) {
                return { ...stage, progress: 100, status: 'done' as StageStatus, eta: '—' }
              }
            }
            return { ...stage, progress: nextProgress }
          }
          return stage
        })
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#000000]">
      <TopBar />
      <PipelineBar pipeline={pipeline} />

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-[300px] shrink-0 flex flex-col gap-3 overflow-y-auto border-r border-white/[0.06] bg-[#000000] p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <PanelLeft size={14} className="text-[#a3e635]" />
            <h2 className="text-xs font-medium text-white/70 uppercase tracking-wider">Agent Swarm</h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {agents.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
          <div className="h-px bg-white/[0.06] my-1" />
          <SystemStats agents={agents} />
        </motion.aside>

        {/* Center Panel */}
        <section className="flex-1 flex flex-col overflow-hidden bg-[#000000]">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06]">
            <Palette size={14} className="text-[#a3e635]" />
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Design Studio</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <DesignStudio />
          </div>
        </section>

        {/* Right Panel */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-[320px] shrink-0 flex flex-col gap-3 overflow-y-auto border-l border-white/[0.06] bg-[#000000] p-4"
        >
          <TaskQueue tasks={tasks} />
          <TodoList />
          <ApplyToHermes />
        </motion.aside>
      </main>
    </div>
  )
}
