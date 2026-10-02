import { ArrowLeftRight } from "lucide-react";
import { useNotify, useRefresh, useTranslate, useUpdate } from "ra-core";
import { Button } from "@/components/ui/button";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal, DealPipeline } from "../types";
import { getDealPipeline, getPipelineStages } from "./pipelines";

/**
 * Moves the SAME opportunity between the Tender and In Hand pipelines (e.g.
 * when the contractor wins the tender). The record, its CR number and its
 * revision history are kept; only the pipeline and stage change.
 */
export const MovePipelineButton = ({ record }: { record: Deal }) => {
  const translate = useTranslate();
  const config = useConfigurationContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [update, { isPending }] = useUpdate();
  const target: DealPipeline =
    getDealPipeline(record) === "tender" ? "in_hand" : "tender";

  const handleClick = () => {
    const firstStage = getPipelineStages(config, target)[0];
    update(
      "deals",
      {
        id: record.id,
        data: { pipeline: target, stage: firstStage?.value, index: 0 },
        previousData: record,
      },
      {
        mutationMode: "pessimistic",
        onSuccess: () => {
          notify(`resources.deals.move.success_${target}`, { type: "info" });
          refresh();
        },
        onError: () => notify("resources.deals.move.error", { type: "error" }),
      },
    );
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      size="sm"
      variant={target === "in_hand" ? "default" : "outline"}
      className="flex items-center gap-2 h-9"
    >
      <ArrowLeftRight className="w-4 h-4" />
      {translate(`resources.deals.move.to_${target}`)}
    </Button>
  );
};
