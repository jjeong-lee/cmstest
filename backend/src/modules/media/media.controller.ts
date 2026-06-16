import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { Roles } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import { SessionGuard } from "../../common/auth/session.guard";
import { SessionUser } from "../store/cms.types";
import { MediaService } from "./media.service";

@Controller("media")
@UseGuards(SessionGuard, RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  listAssets() {
    return this.mediaService.listAssets();
  }

  @Get(":assetId")
  getAsset(@Param("assetId") assetId: string) {
    return this.mediaService.getAsset(assetId);
  }

  @Post("upload")
  @Roles("admin", "editor", "publisher")
  uploadAsset(@Body() body: { fileName: string; altText: string; tagIds?: string[] }, @CurrentUser() user: SessionUser) {
    return this.mediaService.uploadAsset(body, user.id);
  }
}
