import { getPortalFolder } from "@/features/portal/api/portal";
import { PortalFolderView } from "@/features/portal/components/portal-views";

export default async function PortalFolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;
  const contents = await getPortalFolder(folderId);
  return <PortalFolderView contents={contents} />;
}
