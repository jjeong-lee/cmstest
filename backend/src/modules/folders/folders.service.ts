import { Injectable } from "@nestjs/common";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class FoldersService {
  constructor(private readonly store: MockCmsStoreService) {}

  listRootFolders() {
    return this.store.listRootFolders();
  }

  createFolder(payload: { parentId?: string | null; name: string; status?: "ACTIVE" | "INACTIVE"; sortOrder?: number }, actorId: string) {
    return this.store.createFolder(payload, actorId);
  }

  updateFolder(
    folderId: string,
    payload: { parentId?: string | null; name?: string; status?: "ACTIVE" | "INACTIVE"; sortOrder?: number },
    actorId: string,
  ) {
    return this.store.updateFolder(folderId, payload, actorId);
  }

  deleteFolder(folderId: string, actorId: string) {
    return this.store.deleteFolder(folderId, actorId);
  }

  getChildren(folderId: string) {
    return this.store.listFolderChildren(folderId);
  }

  reorder(folderId: string, items: Array<{ id: string; sortOrder: number }>, actorId: string) {
    return this.store.reorderFolderChildren(folderId, items, actorId);
  }
}
