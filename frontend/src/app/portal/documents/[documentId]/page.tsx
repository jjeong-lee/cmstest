import { getPortalDocument } from "@/features/portal/api/portal";
import { PortalDocumentView } from "@/features/portal/components/portal-views";

export default async function PortalDocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const document = await getPortalDocument(documentId);
  return <PortalDocumentView document={document} />;
}
