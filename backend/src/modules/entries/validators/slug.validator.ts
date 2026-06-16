import { BadRequestException, Injectable } from "@nestjs/common";
import { MockCmsStoreService } from "../../store/mock-cms-store.service";
import { ContentType, ContentEntry } from "../../store/cms.types";

@Injectable()
export class SlugValidator {
  constructor(private readonly store: MockCmsStoreService) {}

  ensureUniqueSlug(
    slug: string,
    locale: string,
    contentTypeId: string,
    currentEntryId?: string,
  ): void {
    const conflict = this.store
      .listEntries({})
      .find((entry: ContentEntry & { contentType: ContentType["code"] }) => {
        return (
          entry.slug === slug &&
          entry.locale === locale &&
          entry.contentTypeId === contentTypeId &&
          entry.status !== "archived" &&
          entry.id !== currentEntryId
        );
      });

    if (conflict) {
      throw new BadRequestException(`Slug ${slug} already exists for this locale and content type`);
    }
  }
}
