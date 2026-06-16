"use client";

import { useState } from "react";
import { approveReview, rejectReview } from "@/features/review/api/reviews";
import { publishEntry, schedulePublication, unpublishEntry } from "@/features/review/api/publication";
import { ReviewTask } from "@/lib/types";
import { PublishSchedulerModal } from "./publish-scheduler-modal";

type ReviewDecisionPanelProps = {
  review: ReviewTask;
};

export function ReviewDecisionPanel({ review }: ReviewDecisionPanelProps) {
  const [decisionNote, setDecisionNote] = useState(review.decisionNote ?? "");
  const [showScheduler, setShowScheduler] = useState(false);
  const entryId = review.entry?.id ?? review.entryId;

  return (
    <div className="field-stack">
      <div className="field">
        <label>Reviewer Comment</label>
        <textarea value={decisionNote} onChange={(event) => setDecisionNote(event.target.value)} rows={4} />
      </div>
      <div className="detail-actions">
        <button type="button" className="button" onClick={() => approveReview(review.id, decisionNote)}>
          Approve
        </button>
        <button type="button" className="button-secondary" onClick={() => rejectReview(review.id, decisionNote || "Needs changes")}>
          Reject
        </button>
        <button type="button" className="button-ghost" onClick={() => publishEntry(entryId)}>
          Publish now
        </button>
        <button type="button" className="button-ghost" onClick={() => setShowScheduler(true)}>
          Schedule
        </button>
        <button type="button" className="button-ghost" onClick={() => unpublishEntry(entryId, "Manual recall")}>
          Unpublish
        </button>
      </div>
      <PublishSchedulerModal
        isOpen={showScheduler}
        onClose={() => setShowScheduler(false)}
        onSchedule={(scheduledFor) => schedulePublication(entryId, scheduledFor)}
      />
    </div>
  );
}
