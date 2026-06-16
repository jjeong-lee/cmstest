import { redirect } from "next/navigation";

export default async function LegacyEntryDetailPage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
  const { entryId } = await params;
  redirect(`/content/${entryId}`);
}
