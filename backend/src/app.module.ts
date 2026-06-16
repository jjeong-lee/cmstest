import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { RolesGuard } from "./common/auth/roles.guard";
import { SessionGuard } from "./common/auth/session.guard";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { AuditLogger } from "./common/logger/audit.logger";
import { AuthController } from "./modules/auth/auth.controller";
import { AuthService } from "./modules/auth/auth.service";
import { DashboardController } from "./modules/dashboard/dashboard.controller";
import { DashboardService } from "./modules/dashboard/dashboard.service";
import { DocumentsController } from "./modules/documents/documents.controller";
import { DocumentsService } from "./modules/documents/documents.service";
import { FoldersController } from "./modules/folders/folders.controller";
import { FoldersService } from "./modules/folders/folders.service";
import { GovernanceController } from "./modules/governance/governance.controller";
import { GovernanceService } from "./modules/governance/governance.service";
import { OpsController } from "./modules/ops/ops.controller";
import { OpsService } from "./modules/ops/ops.service";
import { PortalController } from "./modules/portal/portal.controller";
import { PortalService } from "./modules/portal/portal.service";
import { MockCmsStoreService } from "./modules/store/mock-cms-store.service";

@Module({
  imports: [],
  controllers: [
    AuthController,
    DashboardController,
    FoldersController,
    DocumentsController,
    PortalController,
    OpsController,
    GovernanceController,
  ],
  providers: [
    MockCmsStoreService,
    AuthService,
    AuditLogger,
    SessionGuard,
    RolesGuard,
    DashboardService,
    FoldersService,
    DocumentsService,
    PortalService,
    OpsService,
    GovernanceService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
