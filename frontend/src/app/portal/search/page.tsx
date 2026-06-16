import { searchPortalDocuments } from "@/features/portal/api/portal";
import { PortalSearchView } from "@/features/portal/components/portal-views";

export default async function PortalSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "배포";
  const results = await searchPortalDocuments(query);
  return <PortalSearchView query={query} results={results} />;
}
