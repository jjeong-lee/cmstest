import { Injectable, Inject } from "@nestjs/common";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class PortalService {
  constructor(@Inject(MockCmsStoreService) private readonly store: MockCmsStoreService) {}

  getTree() {
    return this.store.getPortalTree();
  }

  getFolder(folderId: string) {
    return this.store.getPortalFolder(folderId);
  }

  getDocument(documentId: string) {
    return this.store.getPortalDocument(documentId);
  }

  search(query: string, page?: number, size?: number) {
    return this.store.searchDocuments(query, page, size);
  }

  getAttachmentDownloadUrl(attachmentId: string) {
    return this.store.getAttachmentRedirect(attachmentId);
  }
}
