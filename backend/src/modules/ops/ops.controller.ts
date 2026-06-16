import { Controller, Get, HttpCode, Param, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api/api-envelope";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { Roles } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import { SessionGuard } from "../../common/auth/session.guard";
import { SessionUser } from "../store/cms.types";
import { OpsService } from "./ops.service";

@Controller()
export class OpsController {
  constructor(private readonly opsService: OpsService) {}

  @Get("ops/health")
  getHealth() {
    return this.opsService.getHealth();
  }

  @Get("admin/backups")
  @UseGuards(SessionGuard, RolesGuard)
  @Roles("ADMIN", "OPERATOR")
  listBackups() {
    return ok("백업 이력을 조회했습니다.", this.opsService.listBackups());
  }

  @Post("admin/backups")
  @HttpCode(202)
  @UseGuards(SessionGuard, RolesGuard)
  @Roles("ADMIN", "OPERATOR")
  startBackup(@CurrentUser() user: SessionUser) {
    return ok("백업을 시작했습니다.", this.opsService.startBackup(user.id));
  }

  @Post("admin/backups/:backupRunId/restore")
  @HttpCode(202)
  @UseGuards(SessionGuard, RolesGuard)
  @Roles("ADMIN", "OPERATOR")
  restoreBackup(@Param("backupRunId") backupRunId: string, @CurrentUser() user: SessionUser) {
    return ok("복구를 시작했습니다.", this.opsService.restoreBackup(backupRunId, user.id));
  }
}
