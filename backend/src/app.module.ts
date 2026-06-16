import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { RolesGuard } from "./common/auth/roles.guard";
import { SessionGuard } from "./common/auth/session.guard";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { AuditLogger } from "./common/logger/audit.logger";
import { AuthController } from "./modules/auth/auth.controller";
import { AuthService } from "./modules/auth/auth.service";
import { ContentTypesController } from "./modules/content-types/content-types.controller";
import { ContentTypesService } from "./modules/content-types/content-types.service";
import { DashboardController } from "./modules/dashboard/dashboard.controller";
import { DashboardService } from "./modules/dashboard/dashboard.service";
import { EntriesController } from "./modules/entries/entries.controller";
import { EntriesService } from "./modules/entries/entries.service";
import { EntryQueryService } from "./modules/entries/entry-query.service";
import { RevisionsService } from "./modules/entries/revisions.service";
import { SlugValidator } from "./modules/entries/validators/slug.validator";
import { AssetProcessingService } from "./modules/media/asset-processing.service";
import { MediaController } from "./modules/media/media.controller";
import { MediaService } from "./modules/media/media.service";
import { ObjectStorageAdapter } from "./modules/media/object-storage.adapter";
import { PublicationController } from "./modules/publication/publication.controller";
import { PublicationService } from "./modules/publication/publication.service";
import { ReviewTransitionsService } from "./modules/reviews/review-transitions.service";
import { ReviewsController } from "./modules/reviews/reviews.controller";
import { ReviewsService } from "./modules/reviews/reviews.service";
import { MockCmsStoreService } from "./modules/store/mock-cms-store.service";

@Module({
  imports: [],
  controllers: [
    AuthController,
    DashboardController,
    ContentTypesController,
    EntriesController,
    ReviewsController,
    PublicationController,
    MediaController,
  ],
  providers: [
    MockCmsStoreService,
    AuthService,
    AuditLogger,
    SessionGuard,
    RolesGuard,
    DashboardService,
    ContentTypesService,
    EntriesService,
    EntryQueryService,
    RevisionsService,
    SlugValidator,
    ReviewTransitionsService,
    ReviewsService,
    PublicationService,
    MediaService,
    AssetProcessingService,
    ObjectStorageAdapter,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
