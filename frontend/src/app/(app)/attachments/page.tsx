import { getDocument, getFolderContents, listRootFolders } from "@/features/content/api/cms";
import { AttachmentManager } from "@/features/attachments/components/attachment-manager";

export default async function AttachmentsPage() {
  const roots = await listRootFolders();
  const activeRoot = roots.find((item) => item.status === "ACTIVE") ?? roots[0];
  let contents = await getFolderContents(activeRoot.id);
  if (contents.documents.length === 0 && contents.folders[0]) {
    contents = await getFolderContents(contents.folders[0].id);
  }
  const document = await getDocument(contents.documents[0]?.id ?? "doc-checklist");
  return <AttachmentManager document={document} />;
}
