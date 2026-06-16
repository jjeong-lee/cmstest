import { listAssets } from "@/features/media/api/media";
import { AssetMasonryGrid } from "@/features/media/components/asset-masonry-grid";

export default async function MediaPage() {
  const assets = await listAssets();
  return <AssetMasonryGrid assets={assets} />;
}
