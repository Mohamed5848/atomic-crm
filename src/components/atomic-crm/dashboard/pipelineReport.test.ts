import { describe, expect, it } from "vitest";

import type { Deal, Project } from "../types";
import { buildPipelineReport } from "./pipelineReport";

const config = {
  dealStages: [
    { value: "tender-announced", label: "Tender Announced" },
    { value: "quotation-submitted", label: "Quotation Submitted" },
    { value: "tender-lost", label: "Lost" },
  ],
  inHandDealStages: [
    { value: "negotiation", label: "Negotiation" },
    { value: "po-received", label: "PO Received" },
  ],
};

const project = (overrides: Partial<Project>): Project => ({
  id: 1,
  name: "Hospital",
  estimated_value: 1_000_000,
  sales_id: 1,
  created_at: "2026-01-01",
  ...overrides,
});

let nextId = 1;
const deal = (overrides: Partial<Deal>): Deal => ({
  id: nextId++,
  name: "Opportunity",
  company_id: 1,
  contact_ids: [],
  category: "contractor",
  stage: "tender-announced",
  pipeline: "tender",
  cr_number: `CR-2026-${nextId}`,
  description: "",
  amount: 100,
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
  expected_closing_date: "2026-06-01",
  sales_id: 1,
  index: 0,
  ...overrides,
});

const row = (report: ReturnType<typeof buildPipelineReport>, stage: string) =>
  report.byStage.find((r) => r.stage === stage)!;

describe("buildPipelineReport", () => {
  it("counts a project once when three contractors bid on it", () => {
    const deals = [
      deal({ project_id: 1, company_id: 1, amount: 300 }),
      deal({ project_id: 1, company_id: 2, amount: 250 }),
      deal({ project_id: 1, company_id: 3, amount: 200 }),
    ];

    const report = buildPipelineReport(deals, [project({})], config);

    expect(report.totals.projectCount).toBe(1);
    expect(report.totals.projectValue).toBe(1_000_000);
    expect(report.totals.opportunityValue).toBe(750);
    expect(report.totals.count).toBe(3);
  });

  it("puts the project value in the stage of its most advanced opportunity only", () => {
    const deals = [
      deal({ project_id: 1, stage: "tender-announced" }),
      deal({ project_id: 1, stage: "quotation-submitted" }),
      deal({ project_id: 1, pipeline: "in_hand", stage: "negotiation" }),
    ];

    const report = buildPipelineReport(deals, [project({})], config);

    expect(row(report, "negotiation").projectValue).toBe(1_000_000);
    expect(row(report, "tender-announced").projectValue).toBe(0);
    expect(row(report, "quotation-submitted").projectValue).toBe(0);
    const stageSum = report.byStage.reduce((sum, r) => sum + r.projectValue, 0);
    expect(stageSum).toBe(1_000_000);
  });

  it("keeps the project with a contractor still in the race rather than a lost one", () => {
    const deals = [
      deal({ project_id: 1, stage: "tender-lost" }),
      deal({ project_id: 1, stage: "tender-announced" }),
    ];

    const report = buildPipelineReport(deals, [project({})], config);

    expect(row(report, "tender-announced").projectValue).toBe(1_000_000);
    expect(row(report, "tender-lost").projectValue).toBe(0);
  });

  it("credits the project value to the project owner once, opportunities to their own owners", () => {
    const deals = [
      deal({ project_id: 1, sales_id: 2, amount: 300 }),
      deal({ project_id: 1, sales_id: 3, amount: 200 }),
    ];

    const report = buildPipelineReport(
      deals,
      [project({ sales_id: 1 })],
      config,
    );

    const owner = (id: number) => report.byOwner.find((r) => r.salesId === id);
    expect(owner(1)?.projectValue).toBe(1_000_000);
    expect(owner(2)?.projectValue).toBe(0);
    expect(owner(2)?.opportunityValue).toBe(300);
    expect(owner(3)?.opportunityValue).toBe(200);
    const ownerSum = report.byOwner.reduce((sum, r) => sum + r.projectValue, 0);
    expect(ownerSum).toBe(1_000_000);
  });

  it("ignores archived opportunities and opportunities without a project in project totals", () => {
    const deals = [
      deal({ project_id: 1, archived_at: "2026-02-01" }),
      deal({ project_id: null, amount: 50 }),
    ];

    const report = buildPipelineReport(deals, [project({})], config);

    expect(report.totals.projectCount).toBe(0);
    expect(report.totals.opportunityValue).toBe(50);
    expect(report.totals.count).toBe(1);
  });

  it("splits opportunity values per pipeline and stage", () => {
    const deals = [
      deal({ stage: "tender-announced", amount: 10 }),
      deal({ stage: "tender-announced", amount: 5 }),
      deal({ pipeline: "in_hand", stage: "po-received", amount: 40 }),
    ];

    const report = buildPipelineReport(deals, [], config);

    expect(row(report, "tender-announced")).toMatchObject({
      pipeline: "tender",
      count: 2,
      opportunityValue: 15,
    });
    expect(row(report, "po-received")).toMatchObject({
      pipeline: "in_hand",
      count: 1,
      opportunityValue: 40,
    });
  });
});
