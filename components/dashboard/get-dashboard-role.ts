/**
 * Role detection helper for per-role dashboards.
 *
 * Maps User.platformRole + User.roleId to one of five dashboard types.
 * Returns a stable key used by <RoleDashboard> to switch rendering.
 */

export type DashboardRole = "hotel" | "supplier" | "factoring" | "logistics" | "admin";

export interface RoleDetectionInput {
  platformRole?: string | null;
  roleId?: string | null;
}

/**
 * Determine which dashboard to show.
 *
 * Priority:
 *   1. platformRole (canonical source from JWT + DB)
 *   2. roleId fallback (future: look up Role.name if needed)
 *
 * Returns one of: 'hotel' | 'supplier' | 'factoring' | 'logistics' | 'admin'
 */
export function getDashboardRole(user: RoleDetectionInput | null | undefined): DashboardRole {
  if (!user) return "hotel";

  const raw = (user.platformRole || "").toUpperCase();

  switch (raw) {
    case "HOTEL":
      return "hotel";
    case "SUPPLIER":
      return "supplier";
    case "FACTORING":
      return "factoring";
    case "SHIPPING":
      return "logistics";
    case "ADMIN":
      return "admin";
    case "MARKETING":
      // Marketing team operates on behalf of the platform — treat as admin-level view
      return "admin";
    default:
      // Unknown role — safest default is hotel (least privileged)
      return "hotel";
  }
}
