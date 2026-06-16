import { getFolderContents, listRootFolders } from "@/features/content/api/cms";
import { ContentWorkspace } from "@/features/content/components/content-workspace";

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ folderId?: string }>;
}) {
  const params = await searchParams;
  const rootFolders = await listRootFolders();
  const selectedFolderId =
    params.folderId ?? rootFolders.find((item) => item.status === "ACTIVE")?.id ?? rootFolders[0]?.id ?? "";
  const contents = await getFolderContents(selectedFolderId);

  return <ContentWorkspace rootFolders={rootFolders} contents={contents} />;
}
