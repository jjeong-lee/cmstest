"use client";

import { useState } from "react";

type PublishSchedulerModalProps = {
  isOpen: boolean;
  onSchedule: (scheduledFor: string) => Promise<void>;
  onClose: () => void;
};

export function PublishSchedulerModal({ isOpen, onSchedule, onClose }: PublishSchedulerModalProps) {
  const [scheduledFor, setScheduledFor] = useState("");

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <h3>Schedule publication</h3>
      <p className="muted">승인된 엔트리를 미래 시각에 발행합니다.</p>
      <input type="datetime-local" value={scheduledFor} onChange={(event) => setScheduledFor(event.target.value)} />
      <div className="control-row">
        <button
          type="button"
          className="button"
          onClick={async () => {
            await onSchedule(new Date(scheduledFor).toISOString());
            onClose();
          }}
        >
          Schedule
        </button>
        <button type="button" className="button-ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
