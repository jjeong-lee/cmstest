import { listBackups, getHealthStatus } from "@/features/ops/api/ops";
import { OperationsDashboard } from "@/features/ops/components/operations-dashboard";

export default async function OperationsPage() {
  const [health, backups] = await Promise.all([getHealthStatus(), listBackups()]);
  return <OperationsDashboard health={health} backups={backups} />;
}
