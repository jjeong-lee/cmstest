import { Controller, Get, Param, Query, Redirect } from "@nestjs/common";
import { ok } from "../../common/api/api-envelope";
import { PortalService } from "./portal.service";

@Controller("portal")
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Get("tree")
  getTree() {
    return ok("포털 트리를 조회했습니다.", this.portalService.getTree());
  }

  @Get("folders/:folderId")
  getFolder(@Param("folderId") folderId: string) {
    return ok("포털 폴더를 조회했습니다.", this.portalService.getFolder(folderId));
  }

  @Get("documents/:documentId")
  getDocument(@Param("documentId") documentId: string) {
    return ok("포털 문서를 조회했습니다.", this.portalService.getDocument(documentId));
  }

  @Get("search")
  search(@Query("q") query: string, @Query("page") page?: string, @Query("size") size?: string) {
    return ok(
      "검색 결과를 조회했습니다.",
      this.portalService.search(query, Number(page ?? "1"), Number(size ?? "20")),
    );
  }

  @Get("attachments/:attachmentId/download")
  @Redirect(undefined, 302)
  downloadAttachment(@Param("attachmentId") attachmentId: string) {
    return { url: this.portalService.getAttachmentDownloadUrl(attachmentId) };
  }
}
