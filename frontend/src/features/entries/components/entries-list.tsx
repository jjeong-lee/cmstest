"use client";

import Link from "next/link";
import { useState } from "react";
import { EntryDetail } from "@/lib/types";

type EntriesListProps = {
  entries: EntryDetail[];
};

export function EntriesList({ entries }: EntriesListProps) {
  const [view, setView] = useState<"card" | "list">("card");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = entries.filter((entry) => {
    const matchesQuery =
      !query || entry.title.toLowerCase().includes(query.toLowerCase()) || entry.summary.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || entry.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="page-header">
          <div>
            <span className="eyebrow">Entries</span>
            <h2 className="page-title">Filterable authoring board with card and list views</h2>
            <p className="page-copy">카드 밀도는 유지하지만 정렬 가능한 관리 목록으로 재해석했습니다.</p>
          </div>
          <Link className="button" href="/entries/new">
            New Entry
          </Link>
        </div>
        <div className="filter-bar">
          <input
            className="search-input"
            placeholder="Search title, slug, summary"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="in_review">In review</option>
            <option value="approved">Approved</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <div className="toolbar">
            <button type="button" className={view === "card" ? "button-secondary" : "button-ghost"} onClick={() => setView("card")}>
              Card
            </button>
            <button type="button" className={view === "list" ? "button-secondary" : "button-ghost"} onClick={() => setView("list")}>
              List
            </button>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <strong>No entries match the current filters.</strong>
          <p className="muted">필터를 초기화하거나 첫 엔트리를 생성해 초안 흐름을 시작하세요.</p>
        </div>
      ) : null}

      {view === "card" ? (
        <div className="entry-card-grid">
          {filtered.map((entry) => (
            <Link key={entry.id} href={`/entries/${entry.id}`} className="entry-card">
              <div
                className="entry-thumb"
                style={{
                  backgroundImage: entry.representativeAsset?.thumbnailUrl
                    ? `linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.2)), url(${entry.representativeAsset.thumbnailUrl})`
                    : "linear-gradient(135deg, #efe7dc, #d6c3ac)",
                }}
              />
              <div className="entry-card-body">
                <span className="status-badge" data-status={entry.status}>
                  {entry.status}
                </span>
                <strong>{entry.title}</strong>
                <span className="muted">{entry.contentType.name}</span>
                <span className="muted">{entry.summary}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="entry-list">
          {filtered.map((entry) => (
            <Link key={entry.id} href={`/entries/${entry.id}`} className="entry-list-item">
              <div
                className="entry-thumb"
                style={{
                  backgroundImage: entry.representativeAsset?.thumbnailUrl
                    ? `linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.2)), url(${entry.representativeAsset.thumbnailUrl})`
                    : "linear-gradient(135deg, #efe7dc, #d6c3ac)",
                }}
              />
              <div className="field-stack">
                <strong>{entry.title}</strong>
                <span className="muted">{entry.summary}</span>
                <span className="muted">
                  {entry.contentType.name} • {entry.author.displayName}
                </span>
              </div>
              <div className="field-stack">
                <span className="status-badge" data-status={entry.status}>
                  {entry.status}
                </span>
                <span className="muted">{new Date(entry.updatedAt).toLocaleString("ko-KR")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
