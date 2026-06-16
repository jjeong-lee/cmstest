import { getPortalFolder, getPortalTree } from "@/features/portal/api/portal";
import { PortalHome } from "@/features/portal/components/portal-views";

export default async function PortalHomePage() {
  const tree = await getPortalTree();
  let featured = await getPortalFolder(tree[0]?.id ?? "folder-policy");
  if (featured.documents.length === 0 && featured.folders[0]) {
    featured = await getPortalFolder(featured.folders[0].id);
  }
  return <PortalHome tree={tree} featured={featured} />;
}
