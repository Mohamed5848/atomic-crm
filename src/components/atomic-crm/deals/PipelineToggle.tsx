import { useListContext, useTranslate } from "ra-core";
import { Button } from "@/components/ui/button";

import { DEAL_PIPELINES, type DealPipeline } from "../types";

/** Switches the deals board between the Tender and In Hand pipelines. */
export const PipelineToggle = () => {
  const translate = useTranslate();
  const { filterValues, displayedFilters, setFilters } = useListContext();
  const current: DealPipeline =
    filterValues.pipeline === "in_hand" ? "in_hand" : "tender";

  return (
    <div
      role="tablist"
      aria-label={translate("resources.deals.fields.pipeline")}
      className="mb-4 inline-flex gap-1 rounded-lg bg-muted p-1"
    >
      {DEAL_PIPELINES.map((pipeline) => (
        <Button
          key={pipeline}
          type="button"
          role="tab"
          aria-selected={pipeline === current}
          size="sm"
          variant={pipeline === current ? "default" : "ghost"}
          onClick={() =>
            setFilters({ ...filterValues, pipeline }, displayedFilters)
          }
        >
          {translate(`resources.deals.pipelines.${pipeline}`)}
        </Button>
      ))}
    </div>
  );
};
