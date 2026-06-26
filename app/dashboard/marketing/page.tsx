"use client";

import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Megaphone, Users, Eye, Share2, ArrowRight, CalendarDays, BarChart3,
  CheckCircle2, Clock,
} from "lucide-react";

/* ─────────────────────────────────────────
   MOCK DATA — Replace with API calls
   ───────────────────────────────────────── */
const CAMPAIGNS: { id: string; name: string; channel: string; status: string; budget: string; spent: string; leads: number; ctr: string }[] = [
  { id: "C-001", name: "Summer Coastal Push", channel: "Email + LinkedIn", status: "active", budget: "EGP 120,000", spent: "EGP 78,400", leads: 342, ctr: "3.8%" },
  { id: "C-002", name: "Hurghada Resort Drive", channel: "Meta Ads", status: "active", budget: "EGP 85,000", spent: "EGP 52,100", leads: 196, ctr: "2.4%" },
  { id: "C-003", name: "ETA Compliance Awareness", channel: "LinkedIn", status: "paused", budget: "EGP 40,000", spent: "EGP 31,200", leads: 84, ctr: "1.9%" },
  { id: "C-004", name: "Supplier Onboarding Sprint", channel: "Email", status: "completed", budget: "EGP 60,000", spent: "EGP 58,900", leads: 127, ctr: "4.1%" },
];

const CONTENT_CALENDAR = [
  { date: "May 5", title: "Supplier Success: Nile Textiles", type: "Case Study", channel: "LinkedIn", status: "scheduled" },
  { date: "May 6", title: "Procurement Cost Calculator", type: "Tool Launch", channel: "All", status: "scheduled" },
  { date: "May 8", title: "Coastal Logistics Deep Dive", type: "Blog", channel: "Website", status: "draft" },
  { date: "May 10", title: "Hotel Spotlight: Four Seasons Giza", type: "Video", channel: "Instagram + LinkedIn", status: "in_review" },
  { date: "May 12", title: "ETA Compliance Webinar", type: "Webinar", channel: "Email + LinkedIn", status: "scheduled" },
];

const SOCIAL_METRICS: { platform: string; followers: string; engagement: string; posts: number; leads: number }[] = [
  { platform: "LinkedIn", followers: "12.4K", engagement: "6.2%", posts: 24, leads: 89 },
  { platform: "Instagram", followers: "8.7K", engagement: "4.8%", posts: 18, leads: 42 },
  { platform: "Facebook", followers: "15.1K", engagement: "3.1%", posts: 12, leads: 31 },
];

const RECENT_LEADS: { name: string; source: string; status: string; date: string; value: string }[] = [
  { name: "Stella Di Mare Resort", source: "LinkedIn", status: "qualified", date: "Today", value: "High" },
  { name: "Jaz Aquamarine", source: "Website", status: "contacted", date: "Today", value: "High" },
  { name: "Sunrise Palace", source: "Referral", status: "new", date: "Yesterday", value: "Medium" },
  { name: "Baron Resort Sharm", source: "Email", status: "qualified", date: "Yesterday", value: "High" },
  { name: "Hurghada Grand", source: "Meta Ads", status: "new", date: "2 days ago", value: "Medium" },
  { name: "Delta Hotels Hurghada", source: "Webinar", status: "contacted", date: "3 days ago", value: "Low" },
];

/* ───────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, any> = {
    active: "success",
    completed: "default",
    paused: "warning",
    scheduled: "info",
    draft: "secondary",
    in_review: "warning",
    qualified: "success",
    new: "info",
    contacted: "default",
  };
  return <Badge variant={variantMap[status] || "default"}>{status.replace("_", " ")}</Badge>;
}

export default function MarketingDashboardPage() {
  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <PageHeader
        title="Marketing Command"
        description="Campaign performance, content pipeline, and lead flow"
        action={
          <Button size="sm">
            <Megaphone className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Campaigns"
          value="2"
          change="+1 from last month"
          changeType="positive"
          icon={Megaphone}
        />
        <StatCard
          title="Leads This Month"
          value="638"
          change="+24% vs April"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Social Engagement"
          value="5.8%"
          change="+0.6% avg rate"
          changeType="positive"
          icon={Share2}
        />
        <StatCard
          title="Content Pipeline"
          value="12"
          change="3 pending review"
          changeType="neutral"
          icon={Eye}
        />
      </div>

      {/* Campaigns + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard
          title="Active Campaigns"
          description="Multi-channel performance overview"
          className="lg:col-span-2"
          action={
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>CTR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CAMPAIGNS.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.channel}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell className="text-[var(--foreground-secondary)]">{c.spent} / {c.budget}</TableCell>
                  <TableCell>{c.leads}</TableCell>
                  <TableCell>{c.ctr}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard
          title="Content Calendar"
          description="Upcoming publishing schedule"
          action={
            <Button variant="ghost" size="sm" className="gap-1">
              <CalendarDays className="w-4 h-4" />
            </Button>
          }
        >
          <div className="space-y-3">
            {CONTENT_CALENDAR.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface-raised)]/50 border border-[var(--border-subtle)]">
                <div className="flex flex-col items-center min-w-[40px]">
                  <span className="text-[10px] uppercase text-[var(--foreground-muted)] tracking-wider">{item.date.split(" ")[0]}</span>
                  <span className="text-lg font-bold text-[var(--foreground)]">{item.date.split(" ")[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-[var(--foreground-secondary)]">{item.type}</span>
                    <span className="text-[var(--border-strong)]">•</span>
                    <span className="text-[11px] text-[var(--foreground-secondary)]">{item.channel}</span>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Social Metrics + Lead Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Social Performance"
          description="Platform reach and engagement breakdown"
          action={
            <Button variant="ghost" size="sm" className="gap-1">
              <BarChart3 className="w-4 h-4" />
            </Button>
          }
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            {SOCIAL_METRICS.map((s) => (
              <Card key={s.platform} glass className="text-center py-4">
                <CardContent className="p-0">
                  <p className="text-xs text-[var(--foreground-secondary)] mb-1">{s.platform}</p>
                  <p className="text-xl font-bold text-[var(--foreground)]">{s.followers}</p>
                  <p className="text-[11px] text-[var(--success)] mt-1">{s.engagement} eng.</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Leads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SOCIAL_METRICS.map((s) => (
                <TableRow key={s.platform}>
                  <TableCell className="font-medium">{s.platform}</TableCell>
                  <TableCell>{s.posts}</TableCell>
                  <TableCell>{s.engagement}</TableCell>
                  <TableCell>{s.leads}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard
          title="Recent Leads"
          description="Inbound prospects from all channels"
          action={
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECENT_LEADS.map((l, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--foreground)]">{l.name}</span>
                      <span className="text-[11px] text-[var(--foreground-muted)]">{l.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[var(--foreground-secondary)]">{l.source}</TableCell>
                  <TableCell><StatusBadge status={l.status} /></TableCell>
                  <TableCell>
                    <Badge variant={l.value === "High" ? "success" : l.value === "Medium" ? "warning" : "secondary"}>
                      {l.value}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      {/* Swarm Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-500)]/10 flex items-center justify-center text-lg">
                📢
              </div>
              <div>
                <CardTitle>Marketing Agent</CardTitle>
                <CardDescription>Campaign orchestration & lead generation</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground-secondary)]">Active campaigns managed</span>
              <span className="font-medium text-[var(--foreground)]">5</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground-secondary)]">Last action</span>
              <span className="font-medium text-[var(--foreground)]">2h ago — optimized Summer Coastal Push bids</span>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
              <span className="text-xs text-[var(--foreground-secondary)]">Autonomous mode active</span>
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-500)]/10 flex items-center justify-center text-lg">
                🎬
              </div>
              <div>
                <CardTitle>Social Media Director</CardTitle>
                <CardDescription>Content strategy & social presence</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground-secondary)]">Scheduled posts this week</span>
              <span className="font-medium text-[var(--foreground)]">8</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--foreground-secondary)]">Last action</span>
              <span className="font-medium text-[var(--foreground)]">30m ago — drafted LinkedIn case study</span>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Clock className="w-4 h-4 text-[var(--warning)]" />
              <span className="text-xs text-[var(--foreground-secondary)]">3 posts awaiting approval</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
