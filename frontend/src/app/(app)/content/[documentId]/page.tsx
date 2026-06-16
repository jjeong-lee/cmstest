import { getDocument } from "@/features/content/api/cms";
import { DocumentEditor } from "@/features/content/components/document-editor";

export default async function ContentDocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const document = await getDocument(documentId);
  return <DocumentEditor document={document} />;
}
