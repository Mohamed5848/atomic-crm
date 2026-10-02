import { useTranslate } from "ra-core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatCompactMoney } from "../misc/formatMoney";
import { useConfigurationContext } from "../root/ConfigurationContext";
import type { DealLineItem, LabeledValue } from "../types";
import { getLineItemsTotal, getTotalKva } from "./opportunity";

const labelOf = (choices: LabeledValue[], value?: string | null) =>
  value
    ? (choices.find((choice) => choice.value === value)?.label ?? value)
    : "";

export const DealLineItemsTable = ({
  lineItems,
}: {
  lineItems: DealLineItem[];
}) => {
  const translate = useTranslate();
  const { currency, engineBrands, alternatorBrands } =
    useConfigurationContext();

  const specsOf = (item: DealLineItem) =>
    [
      item.kva ? `${item.kva} kVA` : "",
      item.rating_type
        ? translate(`resources.deals.line_items.ratings.${item.rating_type}`)
        : "",
      labelOf(engineBrands, item.engine_brand),
      labelOf(alternatorBrands, item.alternator_brand),
      item.canopy_type
        ? translate(`resources.deals.line_items.canopies.${item.canopy_type}`)
        : "",
      [item.voltage, item.frequency ? `${item.frequency} Hz` : ""]
        .filter(Boolean)
        .join(" "),
    ]
      .filter(Boolean)
      .join(" · ");

  return (
    <div className="flex flex-col gap-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {translate("resources.deals.line_items.fields.item_type")}
            </TableHead>
            <TableHead>
              {translate("resources.deals.line_items.fields.specs")}
            </TableHead>
            <TableHead className="text-end">
              {translate("resources.deals.line_items.fields.quantity")}
            </TableHead>
            <TableHead className="text-end">
              {translate("resources.deals.line_items.fields.unit_price")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lineItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="font-medium">
                  {translate(
                    `resources.deals.line_items.types.${item.item_type}`,
                  )}
                </div>
                {item.description ? (
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                ) : null}
              </TableCell>
              <TableCell className="text-xs whitespace-normal">
                {specsOf(item)}
              </TableCell>
              <TableCell className="text-end">{item.quantity}</TableCell>
              <TableCell className="text-end">
                {item.unit_price != null
                  ? formatCompactMoney(item.unit_price, currency)
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex gap-6 text-sm justify-end">
        {getTotalKva(lineItems) > 0 ? (
          <span>
            {translate("resources.deals.line_items.total_kva")}:{" "}
            <strong>
              {getTotalKva(lineItems).toLocaleString("en-US")} kVA
            </strong>
          </span>
        ) : null}
        <span>
          {translate("resources.deals.line_items.total")}:{" "}
          <strong>
            {formatCompactMoney(getLineItemsTotal(lineItems), currency)}
          </strong>
        </span>
      </div>
    </div>
  );
};
