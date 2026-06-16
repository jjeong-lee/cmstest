"use client";

import { useState } from "react";
import { uploadAsset } from "@/features/media/api/media";
import { Asset } from "@/lib/types";
import { AssetDetailDrawer } from "./asset-detail-drawer";

export function AssetMasonryGrid({ assets }: { assets: Asset[] }) {
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>(assets[0]?.id);
  const [newFileName, setNewFileName] = useState("");
  const [newAltText, setNewAltText] = useState("");
  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId) ?? assets[0];

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="page-header">
          <div>
            <span className="eyebrow">Media</span>
            <h2 className="page-title">Masonry-style asset browsing for editorial operations.</h2>
            <p className="page-copy">핀보드식 자유 배치는 미디어 탐색에만 제한적으로 사용하고, 선택 시 우측 상세 드로어를 엽니다.</p>
          </div>
        </div>
        <div className="filter-bar">
          <input
            className="search-input"
            placeholder="New asset filename"
            value={newFileName}
            onChange={(event) => setNewFileName(event.target.value)}
          />
          <input
            className="search-input"
            placeholder="Alt text"
            value={newAltText}
            onChange={(event) => setNewAltText(event.target.value)}
          />
          <button
            type="button"
            className="button"
            onClick={() => uploadAsset({ fileName: newFileName || "new-upload.jpg", altText: newAltText || "Uploaded asset" })}
          >
            Upload Asset
          </button>
        </div>
      </section>

      <section className="media-layout">
        <div className="asset-grid masonry">
          {assets.length === 0 ? (
            <div className="empty-state">
              <strong>No assets yet.</strong>
              <p className="muted">첫 이미지를 업로드하면 여기에서 대표 이미지 선택과 사용처 추적을 시작할 수 있습니다.</p>
            </div>
          ) : null}

          {assets.map((asset, index) => (
            <button key={asset.id} type="button" className="asset-card" onClick={() => setSelectedAssetId(asset.id)}>
              <div
                className="asset-thumb"
                style={{
                  minHeight: `${220 + (index % 4) * 60}px`,
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.2)), url(${asset.thumbnailUrl})`,
                }}
              />
              <div className="asset-card-body">
                <span className="status-badge" data-status={asset.status === "ready" ? "approved" : "draft"}>
                  {asset.status}
                </span>
                <strong>{asset.fileName}</strong>
                <span className="muted">{asset.altText}</span>
              </div>
            </button>
          ))}
        </div>

        <AssetDetailDrawer asset={selectedAsset} />
      </section>
    </div>
  );
}
