import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api/api-envelope";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { Roles } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import { SessionGuard } from "../../common/auth/session.guard";
import { SessionUser } from "../store/cms.types";
import { GovernanceService } from "./governance.service";

@Controller("admin")
@UseGuards(SessionGuard, RolesGuard)
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Get("software-inventory")
  @Roles("ADMIN", "OPERATOR")
  listSoftwareInventory() {
    return ok("소프트웨어 목록을 조회했습니다.", this.governanceService.listSoftwareInventory());
  }

  @Post("software-inventory")
  @Roles("ADMIN", "OPERATOR")
  createSoftwareInventoryItem(@Body() body: Record<string, unknown>, @CurrentUser() user: SessionUser) {
    return ok("소프트웨어 항목을 등록했습니다.", this.governanceService.createSoftwareInventoryItem(user.id, body));
  }

  @Get("deployments")
  @Roles("ADMIN", "OPERATOR")
  listDeployments() {
    return ok("배포 이력을 조회했습니다.", this.governanceService.listDeployments());
  }

  @Get("project/schedules")
  @Roles("ADMIN", "OPERATOR")
  listSchedules() {
    return ok("일정을 조회했습니다.", this.governanceService.listSchedules());
  }

  @Post("project/schedules")
  @Roles("ADMIN", "OPERATOR")
  createSchedule(@Body() body: Record<string, unknown>, @CurrentUser() user: SessionUser) {
    return ok("일정을 등록했습니다.", this.governanceService.createSchedule(user.id, body));
  }

  @Get("project/scope-items")
  @Roles("ADMIN", "OPERATOR")
  listScopeItems() {
    return ok("범위 추적표를 조회했습니다.", this.governanceService.listScopeItems());
  }

  @Get("project/staff-assignments")
  @Roles("ADMIN", "OPERATOR")
  listStaffAssignments() {
    return ok("인력 현황을 조회했습니다.", this.governanceService.listStaffAssignments());
  }

  @Get("project/risk-issues")
  @Roles("ADMIN", "OPERATOR")
  listRisks() {
    return ok("위험 및 이슈를 조회했습니다.", this.governanceService.listRisks());
  }

  @Get("project/deliverables")
  @Roles("ADMIN", "OPERATOR")
  listDeliverables() {
    return ok("산출물을 조회했습니다.", this.governanceService.listDeliverables());
  }

  @Get("project/change-requests")
  @Roles("ADMIN", "OPERATOR")
  listChangeRequests() {
    return ok("변경 요청을 조회했습니다.", this.governanceService.listChangeRequests());
  }

  @Post("project/change-requests")
  @Roles("ADMIN", "OPERATOR")
  createChangeRequest(@Body() body: Record<string, unknown>, @CurrentUser() user: SessionUser) {
    return ok("변경 요청을 등록했습니다.", this.governanceService.createChangeRequest(user.id, body));
  }
}
