import { FormDataConsumer, required, useTranslate } from "ra-core";
import { useFormContext, useWatch } from "react-hook-form";
import { ArrayInput } from "@/components/admin/array-input";
import { NumberInput } from "@/components/admin/number-input";
import { SelectInput } from "@/components/admin/select-input";
import { SimpleFormIterator } from "@/components/admin/simple-form-iterator";
import { TextInput } from "@/components/admin/text-input";
import { Button } from "@/components/ui/button";

import { formatCompactMoney } from "../misc/formatMoney";
import { useConfigurationContext } from "../root/ConfigurationContext";
import {
  CANOPY_TYPES,
  LINE_ITEM_TYPES,
  RATING_TYPES,
  type DealLineItem,
} from "../types";
import { getLineItemsTotal, getTotalKva } from "./opportunity";

const toChoices = (values: readonly string[], prefix: string) =>
  values.map((value) => ({ id: value, name: `${prefix}.${value}` }));

const itemTypeChoices = toChoices(
  LINE_ITEM_TYPES,
  "resources.deals.line_items.types",
);
const ratingChoices = toChoices(
  RATING_TYPES,
  "resources.deals.line_items.ratings",
);
const canopyChoices = toChoices(
  CANOPY_TYPES,
  "resources.deals.line_items.canopies",
);
const frequencyChoices = [
  { id: "50", name: "50 Hz" },
  { id: "60", name: "60 Hz" },
];

/** Equipment quoted on the opportunity: gensets, panels, canopies, tanks... */
export const LineItemsInput = () => {
  const translate = useTranslate();
  const { engineBrands, alternatorBrands } = useConfigurationContext();
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-base font-medium">
        {translate("resources.deals.fields.line_items")}
      </h3>
      <ArrayInput source="line_items" label={false} helperText={false}>
        <SimpleFormIterator disableReordering disableClear>
          <div className="grid w-full gap-x-4 md:grid-cols-4">
            <SelectInput
              source="item_type"
              label="resources.deals.line_items.fields.item_type"
              choices={itemTypeChoices}
              defaultValue="genset"
              validate={required()}
              helperText={false}
            />
            <TextInput
              source="description"
              label="resources.deals.line_items.fields.description"
              helperText={false}
              className="md:col-span-3"
            />
            <NumberInput
              source="quantity"
              label="resources.deals.line_items.fields.quantity"
              defaultValue={1}
              min={1}
              validate={required()}
              helperText={false}
            />
            <NumberInput
              source="unit_price"
              label="resources.deals.line_items.fields.unit_price"
              min={0}
              helperText={false}
            />
            <FormDataConsumer<DealLineItem>>
              {({ scopedFormData }) =>
                scopedFormData?.item_type === "genset" ? (
                  <>
                    <NumberInput
                      source="kva"
                      label="resources.deals.line_items.fields.kva"
                      min={1}
                      helperText={false}
                    />
                    <SelectInput
                      source="rating_type"
                      label="resources.deals.line_items.fields.rating_type"
                      choices={ratingChoices}
                      helperText={false}
                    />
                    <SelectInput
                      source="engine_brand"
                      label="resources.deals.line_items.fields.engine_brand"
                      choices={engineBrands}
                      optionText="label"
                      optionValue="value"
                      helperText={false}
                    />
                    <SelectInput
                      source="alternator_brand"
                      label="resources.deals.line_items.fields.alternator_brand"
                      choices={alternatorBrands}
                      optionText="label"
                      optionValue="value"
                      helperText={false}
                    />
                    <SelectInput
                      source="canopy_type"
                      label="resources.deals.line_items.fields.canopy_type"
                      choices={canopyChoices}
                      helperText={false}
                    />
                    <TextInput
                      source="voltage"
                      label="resources.deals.line_items.fields.voltage"
                      defaultValue="400/230 V"
                      helperText={false}
                    />
                    <SelectInput
                      source="frequency"
                      label="resources.deals.line_items.fields.frequency"
                      choices={frequencyChoices}
                      defaultValue="50"
                      helperText={false}
                    />
                  </>
                ) : scopedFormData?.item_type === "canopy" ? (
                  <SelectInput
                    source="canopy_type"
                    label="resources.deals.line_items.fields.canopy_type"
                    choices={canopyChoices.filter(({ id }) => id !== "open")}
                    helperText={false}
                  />
                ) : null
              }
            </FormDataConsumer>
          </div>
        </SimpleFormIterator>
      </ArrayInput>
      <LineItemsSummary />
    </div>
  );
};

const LineItemsSummary = () => {
  const translate = useTranslate();
  const { currency } = useConfigurationContext();
  const { setValue } = useFormContext();
  const lineItems = useWatch({ name: "line_items" }) as
    | DealLineItem[]
    | undefined;
  const total = getLineItemsTotal(lineItems);
  const totalKva = getTotalKva(lineItems);
  if (!lineItems?.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <span>
        {translate("resources.deals.line_items.total")}:{" "}
        <strong>{formatCompactMoney(total, currency)}</strong>
      </span>
      {totalKva > 0 ? (
        <span>
          {translate("resources.deals.line_items.total_kva")}:{" "}
          <strong>{totalKva.toLocaleString("en-US")} kVA</strong>
        </span>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!total}
        onClick={() => setValue("amount", total, { shouldDirty: true })}
      >
        {translate("resources.deals.line_items.use_as_amount")}
      </Button>
    </div>
  );
};
