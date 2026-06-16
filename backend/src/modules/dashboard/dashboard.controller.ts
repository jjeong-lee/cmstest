import { Controller, Get, UseGuards } from "@nestjs/common";
import { RolesGuard } from "../../common/auth/roles.guard";
import { SessionGuard } from "../../common/auth/session.guard";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@UseGuards(SessionGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("summary")
  getSummary() {
    return this.dashboardService.getSummary();
  }
}
