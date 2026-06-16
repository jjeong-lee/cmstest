import { Injectable } from "@nestjs/common";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class DocumentsService {
  constructor(private readonly store: MockCmsStoreService) {}

  createDocument(payload: { folderId: string; title: string; markdownBody: string; visibilityScope?: "PUBLIC" | "INTERNAL"; summary?: string }, actorId: string) {
    return this.store.createDocument(payload, actorId);
  }

  getDocument(documentId: string) {
    return this.store.getDocumentDetail(documentId);
  }

  updateDocument(
    documentId: string,
    payload: {
      folderId?: string;
      title?: string;
      markdownBody?: string;
      visibilityScope?: "PUBLIC" | "INTERNAL";
      summary?: string;
      changeSummary?: string;
      expectedVersionId?: string;
    },
    actorId: string,
  ) {
    return this.store.updateDocument(documentId, payload, actorId);
  }

  deleteDocument(documentId: string, actorId: string) {
    return this.store.deleteDocument(documentId, actorId);
  }

  submitReview(documentId: string, actorId: string, comment?: string) {
    return this.store.submitReview(documentId, comment, actorId);
  }

  approve(documentId: string, actorId: string, comment?: string) {
    return this.store.approveDocument(documentId, comment, actorId);
  }

  publish(documentId: string, actorId: string) {
    return this.store.publishDocument(documentId, actorId);
  }

  unpublish(documentId: string, actorId: string, reason?: string) {
    return this.store.unpublishDocument(documentId, actorId, reason);
  }

  uploadAttachment(
    documentId: string,
    payload: { fileName?: string; contentType?: string; fileSize?: number; linkRole?: "INLINE_IMAGE" | "REFERENCE_FILE" | "EXPORT_FILE" },
    actorId: string,
  ) {
    return this.store.createAttachment(
      documentId,
      {
        fileName: payload.fileName ?? "untitled.bin",
        contentType: payload.contentType,
        fileSize: payload.fileSize,
        linkRole: payload.linkRole,
      },
      actorId,
    );
  }

  deleteAttachment(attachmentId: string, actorId: string) {
    return this.store.deleteAttachment(attachmentId, actorId);
  }

  getAttachmentDownloadUrl(attachmentId: string, actorId: string) {
    return this.store.getAttachmentRedirect(attachmentId, actorId);
  }
}
