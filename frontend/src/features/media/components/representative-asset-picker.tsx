"use client";

import { Asset } from "@/lib/types";

type RepresentativeAssetPickerProps = {
  assets: Asset[];
  selectedAssetId?: string;
  onSelect: (assetId: string) => void;
};

export function RepresentativeAssetPicker({
  assets,
  selectedAssetId,
  onSelect,
}: RepresentativeAssetPickerProps) {
  return (
    <div className="field-stack">
      <label>Representative Image</label>
      {assets.slice(0, 4).map((asset) => (
        <button
          key={asset.id}
          type="button"
          className="picker-card"
          onClick={() => onSelect(asset.id)}
          style={{
            borderColor: selectedAssetId === asset.id ? "rgba(216, 95, 47, 0.6)" : undefined,
          }}
        >
          <div
            className="entry-thumb"
            style={{
              minHeight: "120px",
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.2)), url(${asset.thumbnailUrl})`,
            }}
          />
          <strong>{asset.fileName}</strong>
          <span className="muted">{asset.altText}</span>
        </button>
      ))}
    </div>
  );
}
