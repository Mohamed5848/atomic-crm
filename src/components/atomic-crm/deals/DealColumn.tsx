import { Droppable } from "@hello-pangea/dnd";

import { formatCompactMoney } from "../misc/formatMoney";
import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal, DealStage } from "../types";
import { findDealLabel } from "./dealUtils";
import { DealCard } from "./DealCard";

export const DealColumn = ({
  stage,
  stages,
  deals,
}: {
  stage: string;
  stages: DealStage[];
  deals: Deal[];
}) => {
  const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const { currency } = useConfigurationContext();
  return (
    <div className="flex-1 min-w-44 pb-8">
      <div className="flex flex-col items-center">
        <h3 className="text-base font-medium text-center">
          {findDealLabel(stages, stage)}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatCompactMoney(totalAmount, currency)}
        </p>
      </div>
      <Droppable droppableId={stage}>
        {(droppableProvided, snapshot) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className={`flex flex-col rounded-2xl mt-2 gap-2 ${
              snapshot.isDraggingOver ? "bg-muted" : ""
            }`}
          >
            {deals.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} />
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
