import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { Roles } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import { SessionGuard } from "../../common/auth/session.guard";
import { SessionUser } from "../store/cms.types";
import { EntriesService } from "./entries.service";
import { RevisionsService } from "./revisions.service";

@Controller("entries")
@UseGuards(SessionGuard, RolesGuard)
export class EntriesController {
  constructor(
    private readonly entriesService: EntriesService,
    private readonly revisionsService: RevisionsService,
  ) {}

  @Get()
  listEntries(
    @Query("status") status?: string,
    @Query("contentType") contentType?: string,
    @Query("authorId") authorId?: string,
    @Query("tag") tag?: string,
    @Query("locale") locale?: string,
    @Query("q") q?: string,
  ) {
    return this.entriesService.listEntries({
      status: status as never,
      contentType: contentType as never,
      authorId,
      tag,
      locale,
      q,
    });
  }

  @Post()
  @Roles("admin", "editor")
  createEntry(@Body() body: Record<string, unknown>, @CurrentUser() user: SessionUser) {
    return this.entriesService.createEntry(body as never, user.id);
  }

  @Get(":entryId")
  getEntry(@Param("entryId") entryId: string) {
    return this.entriesService.getEntry(entryId);
  }

  @Patch(":entryId")
  @Roles("admin", "editor")
  updateEntry(
    @Param("entryId") entryId: string,
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: SessionUser,
  ) {
    return this.entriesService.updateEntry(entryId, body as never, user.id);
  }

  @Delete(":entryId")
  @HttpCode(204)
  @Roles("admin", "editor", "publisher")
  archiveEntry(@Param("entryId") entryId: string, @CurrentUser() user: SessionUser) {
    this.entriesService.archiveEntry(entryId, user.id);
    return undefined;
  }

  @Post(":entryId/submit")
  @Roles("admin", "editor")
  submitForReview(
    @Param("entryId") entryId: string,
    @Body() body: { submissionNote?: string },
    @CurrentUser() user: SessionUser,
  ) {
    return this.entriesService.submitForReview(entryId, body?.submissionNote, user.id);
  }

  @Get(":entryId/revisions")
  listRevisions(@Param("entryId") entryId: string) {
    return this.revisionsService.listEntryRevisions(entryId);
  }
}
