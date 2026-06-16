"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createEntry, submitForReview, updateEntry } from "@/features/entries/api/entries";
import { RepresentativeAssetPicker } from "@/features/media/components/representative-asset-picker";
import { Asset, ContentType, EntryDetail, RevisionBlock } from "@/lib/types";

type EntryEditorFormProps = {
  contentTypes: ContentType[];
  assets: Asset[];
  entry?: EntryDetail;
};

function createDefaultBlocks(entry?: EntryDetail): RevisionBlock[] {
  return entry?.revisions?.[0]?.body ?? [
    { id: crypto.randomUUID(), type: "heading", content: "" },
    { id: crypto.randomUUID(), type: "paragraph", content: "" },
  ];
}

export function EntryEditorForm({ contentTypes, assets, entry }: EntryEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(entry?.title ?? "");
  const [slug, setSlug] = useState(entry?.slug ?? "");
  const [locale, setLocale] = useState(entry?.locale ?? "ko-KR");
  const [summary, setSummary] = useState(entry?.summary ?? "");
  const [seoTitle, setSeoTitle] = useState(entry?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(entry?.seoDescription ?? "");
  const [contentTypeId, setContentTypeId] = useState(entry?.contentTypeId ?? contentTypes[0]?.id ?? "");
  const [representativeAssetId, setRepresentativeAssetId] = useState(entry?.representativeAssetId ?? assets[0]?.id);
  const [changeNote, setChangeNote] = useState("");
  const [submissionNote, setSubmissionNote] = useState("");
  const [body, setBody] = useState<RevisionBlock[]>(createDefaultBlocks(entry));
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!title || !slug || !summary || body.every((block) => !block.content.trim())) {
      setError("title, slug, summary, body는 필수입니다.");
      return;
    }

    setError(undefined);
    const payload = {
      contentTypeId,
      title,
      slug,
      locale,
      summary,
      seoTitle,
      seoDescription,
      representativeAssetId,
      body,
      changeNote,
      expectedRevisionId: entry?.revisions?.[0]?.id,
    };

    const saved = entry ? await updateEntry(entry.id, payload) : await createEntry(payload);
    setMessage("Draft saved");
    router.push(`/entries/${saved.id}`);
    router.refresh();
  }

  async function handleSubmitForReview() {
    if (!entry) {
      setError("먼저 초안을 저장해야 검수 요청을 보낼 수 있습니다.");
      return;
    }

    await submitForReview(entry.id, submissionNote);
    setMessage("Review requested");
    router.refresh();
  }

  return (
    <form className="page-shell" onSubmit={handleSave}>
      <section className="hero-panel">
        <div className="header-row">
          <div>
            <span className="eyebrow">Entry Editor</span>
            <h2 className="page-title">{entry ? entry.title : "Create a new content draft"}</h2>
            <p className="page-copy">상단 CTA는 항상 같은 위치에 두고, 본문과 메타 패널을 분리해 검수 전 누락을 줄입니다.</p>
          </div>
          <div className="cta-row">
            <button className="button" type="submit">
              Save Draft
            </button>
            <button className="button-secondary" type="button" onClick={handleSubmitForReview}>
              Submit for Review
            </button>
          </div>
        </div>
        {error ? <div className="error-state">{error}</div> : null}
        {message ? <div className="empty-state">{message}</div> : null}
      </section>

      <section className="editor-layout">
        <div className="editor-main">
          <div className="field-stack">
            <div className="field">
              <label>Content Type</label>
              <select value={contentTypeId} onChange={(event) => setContentTypeId(event.target.value)}>
                {contentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Title</label>
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Entry title" />
            </div>

            <div className="field">
              <label>Summary</label>
              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Card summary"
                rows={4}
              />
            </div>

            {body.map((block, index) => (
              <div key={block.id} className="block-card">
                <div className="field">
                  <label>Block {index + 1}</label>
                  <select
                    value={block.type}
                    onChange={(event) =>
                      setBody((current) =>
                        current.map((item) =>
                          item.id === block.id ? { ...item, type: event.target.value as RevisionBlock["type"] } : item,
                        ),
                      )
                    }
                  >
                    <option value="heading">Heading</option>
                    <option value="paragraph">Paragraph</option>
                    <option value="quote">Quote</option>
                  </select>
                </div>
                <div className="field">
                  <textarea
                    value={block.content}
                    onChange={(event) =>
                      setBody((current) =>
                        current.map((item) => (item.id === block.id ? { ...item, content: event.target.value } : item)),
                      )
                    }
                    rows={4}
                  />
                </div>
              </div>
            ))}

            <div className="control-row">
              <button
                type="button"
                className="button-ghost"
                onClick={() =>
                  setBody((current) => [...current, { id: crypto.randomUUID(), type: "paragraph", content: "" }])
                }
              >
                Add Body Block
              </button>
            </div>
          </div>
        </div>

        <aside className="editor-meta sticky">
          <div className="field-stack">
            <div className="field">
              <label>Slug</label>
              <input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="entry-slug" />
            </div>
            <div className="field">
              <label>Locale</label>
              <input value={locale} onChange={(event) => setLocale(event.target.value)} placeholder="ko-KR" />
            </div>
            <div className="field">
              <label>SEO Title</label>
              <input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
            </div>
            <div className="field">
              <label>SEO Description</label>
              <textarea
                value={seoDescription}
                onChange={(event) => setSeoDescription(event.target.value)}
                rows={3}
              />
            </div>
            <div className="field">
              <label>Change Note</label>
              <input value={changeNote} onChange={(event) => setChangeNote(event.target.value)} placeholder="What changed?" />
            </div>
            <div className="field">
              <label>Submission Note</label>
              <textarea
                value={submissionNote}
                onChange={(event) => setSubmissionNote(event.target.value)}
                rows={3}
                placeholder="Optional context for reviewer"
              />
            </div>
            <RepresentativeAssetPicker
              assets={assets}
              selectedAssetId={representativeAssetId}
              onSelect={setRepresentativeAssetId}
            />
          </div>
        </aside>
      </section>
    </form>
  );
}
