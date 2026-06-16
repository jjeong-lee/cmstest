import { Controller, Get, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api/api-envelope";
import { Roles } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import { SessionGuard } from "../../common/auth/session.guard";
import { DashboardService } from "./dashboard.service";

@Controller("admin/dashboard")
@UseGuards(SessionGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Roles("ADMIN", "OPERATOR", "REVIEWER")
  getSummary() {
    return ok("대시보드 요약을 조회했습니다.", this.dashboardService.getSummary());
  }
}
