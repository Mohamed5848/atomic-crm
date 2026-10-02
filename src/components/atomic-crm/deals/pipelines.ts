import type { ConfigurationContextValue } from "../root/ConfigurationContext";
import type { Deal, DealPipeline, DealStage } from "../types";

type PipelineConfig = Pick<
  ConfigurationContextValue,
  "dealStages" | "inHandDealStages"
>;

/** The configured stages of one pipeline. Deals without a pipeline are tenders. */
export const getPipelineStages = (
  config: PipelineConfig,
  pipeline: DealPipeline | null | undefined,
): DealStage[] =>
  pipeline === "in_hand" ? config.inHandDealStages : config.dealStages;

export const getDealPipeline = (deal: Pick<Deal, "pipeline">): DealPipeline =>
  deal.pipeline === "in_hand" ? "in_hand" : "tender";

export const getDealStageLabel = (
  config: PipelineConfig,
  deal: Pick<Deal, "pipeline" | "stage">,
): string =>
  getPipelineStages(config, getDealPipeline(deal)).find(
    (stage) => stage.value === deal.stage,
  )?.label ?? deal.stage;
