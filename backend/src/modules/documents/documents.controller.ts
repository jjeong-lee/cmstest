import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Redirect, UseGuards, Inject } from "@nestjs/common";
import { ok } from "../../common/api/api-envelope";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { Roles } from "../../common/auth/roles.decorator";
import { RolesGuard } from "../../common/auth/roles.guard";
import { SessionGuard } from "../../common/auth/session.guard";
import { SessionUser } from "../store/cms.types";
import { DocumentsService } from "./documents.service";

@Controller("admin")
@UseGuards(SessionGuard, RolesGuard)
export class DocumentsController {
  constructor(@Inject(DocumentsService) private readonly documentsService: DocumentsService) {}

  @Post("documents")
  @Roles("ADMIN")
  createDocument(
    @Body() body: { folderId: string; title: string; markdownBody: string; visibilityScope?: "PUBLIC" | "INTERNAL"; summary?: string },
    @CurrentUser() user: SessionUser,
  ) {
    return ok("문서를 생성했습니다.", this.documentsService.createDocument(body, user.id));
  }

  @Get("documents/:documentId")
  @Roles("ADMIN", "REVIEWER", "OPERATOR")
  getDocument(@Param("documentId") documentId: string) {
    return ok("문서 상세를 조회했습니다.", this.documentsService.getDocument(documentId));
  }

  @Patch("documents/:documentId")
  @Roles("ADMIN")
  updateDocument(
    @Param("documentId") documentId: string,
    @Body()
    body: {
      folderId?: string;
      title?: string;
      markdownBody?: string;
      visibilityScope?: "PUBLIC" | "INTERNAL";
      summary?: string;
      changeSummary?: string;
      expectedVersionId?: string;
    },
    @CurrentUser() user: SessionUser,
  ) {
    return ok("문서를 수정했습니다.", this.documentsService.updateDocument(documentId, body, user.id));
  }

  @Delete("documents/:documentId")
  @Roles("ADMIN")
  deleteDocument(@Param("documentId") documentId: string, @CurrentUser() user: SessionUser) {
    return ok("문서를 삭제했습니다.", this.documentsService.deleteDocument(documentId, user.id));
  }

  @Post("documents/:documentId/submit-review")
  @HttpCode(200)
  @Roles("ADMIN")
  submitReview(
    @Param("documentId") documentId: string,
    @Body() body: { comment?: string },
    @CurrentUser() user: SessionUser,
  ) {
    return ok("검토 요청을 보냈습니다.", this.documentsService.submitReview(documentId, user.id, body.comment));
  }

  @Post("documents/:documentId/approve")
  @HttpCode(200)
  @Roles("ADMIN", "REVIEWER")
  approve(
    @Param("documentId") documentId: string,
    @Body() body: { comment?: string },
    @CurrentUser() user: SessionUser,
  ) {
    return ok("문서를 승인했습니다.", this.documentsService.approve(documentId, user.id, body.comment));
  }

  @Post("documents/:documentId/publish")
  @HttpCode(200)
  @Roles("ADMIN")
  publish(@Param("documentId") documentId: string, @CurrentUser() user: SessionUser) {
    return ok("문서를 발행했습니다.", this.documentsService.publish(documentId, user.id));
  }

  @Post("documents/:documentId/unpublish")
  @HttpCode(200)
  @Roles("ADMIN")
  unpublish(
    @Param("documentId") documentId: string,
    @Body() body: { reason?: string },
    @CurrentUser() user: SessionUser,
  ) {
    return ok("문서 게시를 중단했습니다.", this.documentsService.unpublish(documentId, user.id, body.reason));
  }

  @Post("documents/:documentId/attachments")
  @Roles("ADMIN")
  uploadAttachment(
    @Param("documentId") documentId: string,
    @Body() body: { fileName?: string; contentType?: string; fileSize?: number; linkRole?: "INLINE_IMAGE" | "REFERENCE_FILE" | "EXPORT_FILE" },
    @CurrentUser() user: SessionUser,
  ) {
    return ok("첨부파일을 등록했습니다.", this.documentsService.uploadAttachment(documentId, body, user.id));
  }

  @Delete("attachments/:attachmentId")
  @Roles("ADMIN")
  deleteAttachment(@Param("attachmentId") attachmentId: string, @CurrentUser() user: SessionUser) {
    return ok("첨부파일을 삭제했습니다.", this.documentsService.deleteAttachment(attachmentId, user.id));
  }

  @Get("attachments/:attachmentId/download")
  @Roles("ADMIN", "OPERATOR", "REVIEWER")
  @Redirect(undefined, 302)
  downloadAttachment(@Param("attachmentId") attachmentId: string, @CurrentUser() user: SessionUser) {
    return { url: this.documentsService.getAttachmentDownloadUrl(attachmentId, user.id) };
  }
}
