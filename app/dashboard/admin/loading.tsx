import { Skeleton, SkeletonKpiGrid } from "@/components/dashboards/shared/skeleton";

export default function AdminLoading() {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <Skeleton className="h-6 w-56 mb-2" />
        <Skeleton className="h-3 w-96" />
      </div>
      <SkeletonKpiGrid cards={5} />
      <div style={{ height: 24 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
