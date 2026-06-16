import {
  listChangeRequests,
  listDeliverables,
  listDeployments,
  listRisks,
  listSchedules,
  listScopeItems,
  listSoftwareInventory,
  listStaffAssignments,
} from "@/features/governance/api/governance";
import { GovernanceDashboard } from "@/features/governance/components/governance-dashboard";

export default async function GovernancePage() {
  const [softwareInventory, deployments, schedules, scopeItems, staffAssignments, risks, deliverables, changeRequests] =
    await Promise.all([
      listSoftwareInventory(),
      listDeployments(),
      listSchedules(),
      listScopeItems(),
      listStaffAssignments(),
      listRisks(),
      listDeliverables(),
      listChangeRequests(),
    ]);

  return (
    <GovernanceDashboard
      softwareInventory={softwareInventory}
      deployments={deployments}
      schedules={schedules}
      scopeItems={scopeItems}
      staffAssignments={staffAssignments}
      risks={risks}
      deliverables={deliverables}
      changeRequests={changeRequests}
    />
  );
}
