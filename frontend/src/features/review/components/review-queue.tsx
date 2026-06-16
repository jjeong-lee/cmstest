"use client";

import { useState } from "react";
import { ReviewTask } from "@/lib/types";
import { ReviewDecisionPanel } from "./review-decision-panel";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ReviewQueue({ reviews }: { reviews: ReviewTask[] }) {
  const [selectedReviewId, setSelectedReviewId] = useState(reviews[0]?.id);
  const selectedReview = reviews.find((review) => review.id === selectedReviewId) ?? reviews[0];

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="page-header">
          <div>
            <span className="eyebrow">Review Queue</span>
            <h2 className="page-title">Submitted drafts stay visible beside the decision surface.</h2>
            <p className="page-copy">본문 미리보기와 코멘트 타임라인을 한 패널에 묶어 승인 전환 비용을 줄였습니다.</p>
          </div>
        </div>
      </section>
      <section className="review-layout">
        <div className="panel">
          {reviews.length === 0 ? (
            <div className="empty-state">
              <strong>No review tasks.</strong>
              <p className="muted">검수 요청이 들어오면 이 큐에 표시됩니다.</p>
            </div>
          ) : (
            <div className="review-list">
              {reviews.map((review) => (
                <button
                  key={review.id}
                  type="button"
                  className="review-row"
                  onClick={() => setSelectedReviewId(review.id)}
                  style={{
                    borderColor: selectedReviewId === review.id ? "rgba(216, 95, 47, 0.35)" : undefined,
                  }}
                >
                  <span className="status-badge" data-status={review.entry?.status ?? "in_review"}>
                    {review.status}
                  </span>
                  <strong>{review.entry?.title ?? review.entryId}</strong>
                  <span className="muted">{review.submissionNote ?? "No submission note"}</span>
                  <span className="muted">{formatDate(review.createdAt)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedReview ? (
          <aside className="review-detail sticky">
            <span className="eyebrow">{selectedReview.entry?.contentType.name ?? "Entry"}</span>
            <h3>{selectedReview.entry?.title ?? selectedReview.entryId}</h3>
            <p className="muted">{selectedReview.entry?.summary}</p>
            <div className="timeline">
              <div className="timeline-item">
                <strong>Submission</strong>
                <span className="muted">{selectedReview.submissionNote ?? "No note"}</span>
              </div>
              {selectedReview.entry?.revisions?.[0]?.body.map((block) => (
                <div key={block.id} className="timeline-item">
                  <strong>{block.type}</strong>
                  <span className="muted">{block.content}</span>
                </div>
              ))}
            </div>
            <ReviewDecisionPanel review={selectedReview} />
          </aside>
        ) : null}
      </section>
    </div>
  );
}
