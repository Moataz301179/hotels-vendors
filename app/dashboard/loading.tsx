import { Skeleton, SkeletonKpiGrid, SkeletonTable } from "@/components/dashboards/shared/skeleton";

export default function DashboardLoading() {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-3 w-72" />
      </div>
      <SkeletonKpiGrid cards={4} />
      <div style={{ height: 24 }} />
      <SkeletonTable rows={6} cols={5} />
    </div>
  );
}
