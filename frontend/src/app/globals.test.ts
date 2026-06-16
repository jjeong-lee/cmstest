import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

describe("admin background theme", () => {
  it("uses white and blue palette tokens", () => {
    expect(css).toContain("--bg: #eff6ff;");
    expect(css).toContain("--bg-strong: #dbeafe;");
    expect(css).toContain("--accent: #2563eb;");
    expect(css).toContain("--surface-soft: rgba(191, 219, 254, 0.2);");
  });

  it("defines white and blue gradients for the app background surfaces", () => {
    expect(css).toContain("radial-gradient(circle at top left, rgba(96, 165, 250, 0.2), transparent 26%)");
    expect(css).toContain("linear-gradient(180deg, #ffffff 0%, var(--bg) 56%, #dbeafe 100%)");
    expect(css).toContain("background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(239, 246, 255, 0.96));");
    expect(css).toContain("linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(219, 234, 254, 0.94))");
  });
});
