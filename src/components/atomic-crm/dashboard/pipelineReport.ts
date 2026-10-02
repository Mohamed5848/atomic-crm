import type { Identifier } from "ra-core";

import { getDealPipeline, getPipelineStages } from "../deals/pipelines";
import type { ConfigurationContextValue } from "../root/ConfigurationContext";
import type { Deal, DealPipeline, Project } from "../types";

type ReportConfig = Pick<
  ConfigurationContextValue,
  "dealStages" | "inHandDealStages"
>;

export type ReportValues = {
  /** Number of opportunities */
  count: number;
  /** Sum of the opportunities' quotation values (AMI's own offers) */
  opportunityValue: number;
  /** Number of distinct projects */
  projectCount: number;
  /** Sum of the distinct projects' estimated values, each project once */
  projectValue: number;
};

export type StageReportRow = ReportValues & {
  pipeline: DealPipeline;
  stage: string;
  label: string;
};

export type OwnerReportRow = ReportValues & { salesId: Identifier | null };

export type PipelineReport = {
  byStage: StageReportRow[];
  byOwner: OwnerReportRow[];
  totals: ReportValues;
};

const emptyValues = (): ReportValues => ({
  count: 0,
  opportunityValue: 0,
  projectCount: 0,
  projectValue: 0,
});

/** Stages that end a pursuit without winning it never represent a project. */
const INACTIVE_STAGE_REGEX = /lost|hold|cancel/i;

/**
 * Ranks an opportunity's progress: In Hand beats Tender, then later stages
 * beat earlier ones. Lost / on-hold opportunities rank last, so a project
 * stays with a contractor that is still in the race.
 */
const progressRank = (deal: Deal, config: ReportConfig): number => {
  const pipeline = getDealPipeline(deal);
  if (INACTIVE_STAGE_REGEX.test(deal.stage)) return -1;
  const stageIndex = getPipelineStages(config, pipeline).findIndex(
    (stage) => stage.value === deal.stage,
  );
  return (pipeline === "in_hand" ? 1000 : 0) + Math.max(stageIndex, 0);
};

/**
 * Pipeline totals per stage and per owner.
 *
 * Opportunity values are summed per opportunity. Project values are NEVER
 * multiplied: each project is counted once, in the stage of its most advanced
 * opportunity and for the project's own owner, however many contractors
 * pursue it. Summing any column of project values therefore gives the value
 * of the distinct projects.
 */
export const buildPipelineReport = (
  deals: Deal[],
  projects: Project[],
  config: ReportConfig,
): PipelineReport => {
  const activeDeals = deals.filter((deal) => !deal.archived_at);
  const projectsById = new Map(
    projects.map((project) => [String(project.id), project]),
  );

  const byStage: StageReportRow[] = (["tender", "in_hand"] as const).flatMap(
    (pipeline) =>
      getPipelineStages(config, pipeline).map((stage) => ({
        pipeline,
        stage: stage.value,
        label: stage.label,
        ...emptyValues(),
      })),
  );
  const findStageRow = (deal: Deal) =>
    byStage.find(
      (row) =>
        row.pipeline === getDealPipeline(deal) && row.stage === deal.stage,
    );

  const ownerRows = new Map<string, OwnerReportRow>();
  const ownerRow = (salesId: Identifier | null | undefined) => {
    const key = String(salesId ?? "");
    if (!ownerRows.has(key)) {
      ownerRows.set(key, { salesId: salesId ?? null, ...emptyValues() });
    }
    return ownerRows.get(key)!;
  };

  const totals = emptyValues();
  // the most advanced opportunity of each project
  const leadDealByProject = new Map<string, Deal>();

  for (const deal of activeDeals) {
    const amount = Number(deal.amount) || 0;
    const stageRow = findStageRow(deal);
    if (stageRow) {
      stageRow.count += 1;
      stageRow.opportunityValue += amount;
    }
    const owner = ownerRow(deal.sales_id);
    owner.count += 1;
    owner.opportunityValue += amount;
    totals.count += 1;
    totals.opportunityValue += amount;

    if (deal.project_id == null) continue;
    const projectKey = String(deal.project_id);
    if (!projectsById.has(projectKey)) continue;
    const lead = leadDealByProject.get(projectKey);
    if (!lead || progressRank(deal, config) > progressRank(lead, config)) {
      leadDealByProject.set(projectKey, deal);
    }
  }

  for (const [projectKey, lead] of leadDealByProject) {
    const project = projectsById.get(projectKey)!;
    const value = Number(project.estimated_value) || 0;
    const stageRow = findStageRow(lead);
    if (stageRow) {
      stageRow.projectCount += 1;
      stageRow.projectValue += value;
    }
    const owner = ownerRow(project.sales_id ?? lead.sales_id);
    owner.projectCount += 1;
    owner.projectValue += value;
    totals.projectCount += 1;
    totals.projectValue += value;
  }

  return {
    byStage,
    byOwner: [...ownerRows.values()].sort(
      (a, b) => b.opportunityValue - a.opportunityValue,
    ),
    totals,
  };
};
