import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { Roles } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import { SessionGuard } from "../../common/auth/session.guard";
import { SessionUser } from "../store/cms.types";
import { PublicationService } from "./publication.service";

@Controller("publication")
@UseGuards(SessionGuard, RolesGuard)
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post(":entryId/publish")
  @Roles("admin", "publisher")
  publish(@Param("entryId") entryId: string, @CurrentUser() user: SessionUser) {
    return this.publicationService.publish(entryId, user.id);
  }

  @Post(":entryId/schedule")
  @Roles("admin", "publisher")
  schedule(
    @Param("entryId") entryId: string,
    @Body() body: { scheduledFor: string },
    @CurrentUser() user: SessionUser,
  ) {
    return this.publicationService.schedule(entryId, body.scheduledFor, user.id);
  }

  @Post(":entryId/unpublish")
  @Roles("admin", "publisher")
  unpublish(
    @Param("entryId") entryId: string,
    @Body() body: { reason?: string },
    @CurrentUser() user: SessionUser,
  ) {
    return this.publicationService.unpublish(entryId, body.reason, user.id);
  }
}
