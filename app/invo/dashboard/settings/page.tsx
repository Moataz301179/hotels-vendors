import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { User, Building2, CreditCard, Bell, Shield, ChevronRight } from "lucide-react";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

async function getUserProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hv_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    const userId = payload.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: { select: { name: true } },
        supplier: { select: { name: true, taxId: true, bankName: true, bankAccount: true } },
      },
    });

    return user;
  } catch {
    return null;
  }
}

export default async function SettingsPage() {
  const user = await getUserProfile();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] font-medium text-white tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-[14px] text-white/40">
          Your profile, company details, and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <section className="mb-8">
        <h2 className="text-[13px] font-medium text-white/25 uppercase tracking-wider mb-4">
          Profile
        </h2>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
          <SettingRow
            icon={User}
            label="Name"
            value={user?.name || "—"}
          />
          <SettingRow
            icon={Building2}
            label="Email"
            value={user?.email || "—"}
          />
          <SettingRow
            icon={Shield}
            label="Tenant"
            value={user?.tenant?.name || "—"}
          />
        </div>
      </section>

      {/* Company Section */}
      <section className="mb-8">
        <h2 className="text-[13px] font-medium text-white/25 uppercase tracking-wider mb-4">
          Company
        </h2>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
          <SettingRow
            icon={Building2}
            label="Company Name"
            value={user?.supplier?.name || "—"}
          />
          <SettingRow
            icon={Shield}
            label="Tax ID"
            value={user?.supplier?.taxId || "—"}
          />
          <SettingRow
            icon={CreditCard}
            label="Bank"
            value={user?.supplier?.bankName || "Not set"}
          />
          <SettingRow
            icon={CreditCard}
            label="Bank Account"
            value={user?.supplier?.bankAccount || "Not set"}
            mono
          />
        </div>
      </section>

      {/* Preferences */}
      <section className="mb-8">
        <h2 className="text-[13px] font-medium text-white/25 uppercase tracking-wider mb-4">
          Preferences
        </h2>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
          <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-white/25" />
              <span className="text-[13px] text-white/60">Notifications</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/15" />
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-[13px] font-medium text-red-400/40 uppercase tracking-wider mb-4">
          Danger Zone
        </h2>
        <div className="rounded-xl border border-red-500/[0.08] bg-red-500/[0.02] p-4">
          <p className="text-[13px] text-white/40 mb-3">
            Cancel your INVO subscription. You will lose access to factoring
            and your supplier listing.
          </p>
          <button className="text-[13px] font-medium text-red-400/60 hover:text-red-400 transition-colors px-4 py-2 rounded-lg border border-red-500/[0.15] hover:border-red-500/[0.25]">
            Cancel Subscription
          </button>
        </div>
      </section>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Icon className="w-4 h-4 text-white/20 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-white/25 mb-0.5">{label}</p>
        <p className={`text-[13px] text-white/60 truncate ${mono ? "font-mono" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
