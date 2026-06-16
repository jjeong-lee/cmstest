import { getDashboardSummary } from "@/features/dashboard/api/dashboard";
import { DashboardSummaryView } from "@/features/dashboard/components/dashboard-summary";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  return <DashboardSummaryView summary={summary} />;
}
