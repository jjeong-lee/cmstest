import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api/api-envelope";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { Roles } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import { SessionGuard } from "../../common/auth/session.guard";
import { SessionUser } from "../store/cms.types";
import { FoldersService } from "./folders.service";

@Controller("admin/folders")
@UseGuards(SessionGuard, RolesGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get()
  @Roles("ADMIN", "REVIEWER", "OPERATOR")
  listRootFolders() {
    return ok("루트 폴더 목록을 조회했습니다.", this.foldersService.listRootFolders());
  }

  @Post()
  @Roles("ADMIN")
  createFolder(
    @Body() body: { parentId?: string | null; name: string; status?: "ACTIVE" | "INACTIVE"; sortOrder?: number },
    @CurrentUser() user: SessionUser,
  ) {
    return ok("폴더를 생성했습니다.", this.foldersService.createFolder(body, user.id));
  }

  @Patch(":folderId")
  @Roles("ADMIN")
  updateFolder(
    @Param("folderId") folderId: string,
    @Body() body: { parentId?: string | null; name?: string; status?: "ACTIVE" | "INACTIVE"; sortOrder?: number },
    @CurrentUser() user: SessionUser,
  ) {
    return ok("폴더를 수정했습니다.", this.foldersService.updateFolder(folderId, body, user.id));
  }

  @Delete(":folderId")
  @Roles("ADMIN")
  deleteFolder(@Param("folderId") folderId: string, @CurrentUser() user: SessionUser) {
    return ok("폴더를 삭제했습니다.", this.foldersService.deleteFolder(folderId, user.id));
  }

  @Get(":folderId/children")
  @Roles("ADMIN", "REVIEWER", "OPERATOR")
  getChildren(@Param("folderId") folderId: string) {
    return ok("폴더 하위 항목을 조회했습니다.", this.foldersService.getChildren(folderId));
  }

  @Post(":folderId/reorder")
  @HttpCode(200)
  @Roles("ADMIN")
  reorder(
    @Param("folderId") folderId: string,
    @Body() body: { items: Array<{ id: string; sortOrder: number }> },
    @CurrentUser() user: SessionUser,
  ) {
    return ok("정렬 순서를 변경했습니다.", this.foldersService.reorder(folderId, body.items ?? [], user.id));
  }
}
