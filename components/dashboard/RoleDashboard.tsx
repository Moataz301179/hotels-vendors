import { DashboardRole } from "./get-dashboard-role";
import { HotelBuyerDashboard } from "./roles/HotelBuyerDashboard";
import { SupplierDashboard } from "./roles/SupplierDashboard";
import { FactoringDashboard } from "./roles/FactoringDashboard";
import { LogisticsDashboard } from "./roles/LogisticsDashboard";
import { AdminDashboard } from "./roles/AdminDashboard";

interface RoleDashboardProps {
  role: DashboardRole;
}

/**
 * Top-level switch that renders the correct role-specific dashboard.
 * Each sub-dashboard is a self-contained server component that fetches
 * its own data scoped to the user's tenant.
 */
export function RoleDashboard({ role }: RoleDashboardProps) {
  switch (role) {
    case "hotel":
      return <HotelBuyerDashboard />;
    case "supplier":
      return <SupplierDashboard />;
    case "factoring":
      return <FactoringDashboard />;
    case "logistics":
      return <LogisticsDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <HotelBuyerDashboard />;
  }
}
