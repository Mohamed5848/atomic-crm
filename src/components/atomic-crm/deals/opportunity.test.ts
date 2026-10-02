import { describe, expect, it } from "vitest";

import {
  addRevision,
  getLatestRevision,
  getLineItemsTotal,
  getTotalKva,
  nextCrNumber,
} from "./opportunity";

describe("nextCrNumber", () => {
  it("continues after the highest existing sequence", () => {
    const now = new Date(2026, 9, 2);
    expect(nextCrNumber(["CR-2026-0007", "CR-2025-0012", null], now)).toBe(
      "CR-2026-0013",
    );
  });

  it("starts at 0001 and ignores numbers in another format", () => {
    expect(nextCrNumber(["LEGACY-77"], new Date(2026, 0, 1))).toBe(
      "CR-2026-0001",
    );
  });
});

describe("addRevision", () => {
  it("adds Rev 0 first, then increments without changing earlier revisions", () => {
    const rev0 = addRevision([], { date: "2026-01-01", value: 100 });
    const rev1 = addRevision(rev0, { date: "2026-02-01", value: 90 });

    expect(rev1).toEqual([
      { revision: 0, date: "2026-01-01", value: 100 },
      { revision: 1, date: "2026-02-01", value: 90 },
    ]);
    expect(rev0).toHaveLength(1);
    expect(getLatestRevision(rev1)?.value).toBe(90);
  });
});

describe("line item totals", () => {
  const items = [
    {
      item_type: "genset" as const,
      quantity: 2,
      unit_price: 1000,
      kva: 500,
    },
    { item_type: "ats_panel" as const, quantity: 2, unit_price: 100 },
    { item_type: "fuel_tank" as const, quantity: 1, unit_price: null },
  ];

  it("sums quantity times unit price", () => {
    expect(getLineItemsTotal(items)).toBe(2200);
  });

  it("sums kVA of gensets only", () => {
    expect(getTotalKva(items)).toBe(1000);
  });
});
