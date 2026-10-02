import { required, useTranslate } from "ra-core";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AutocompleteArrayInput } from "@/components/admin/autocomplete-array-input";
import { ReferenceArrayInput } from "@/components/admin/reference-array-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { TextInput } from "@/components/admin/text-input";
import { NumberInput } from "@/components/admin/number-input";
import { DateInput } from "@/components/admin/date-input";
import { SelectInput } from "@/components/admin/select-input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

import { contactOptionText } from "../misc/ContactOption";
import { useConfigurationContext } from "../root/ConfigurationContext";
import { AutocompleteCompanyInput } from "../companies/AutocompleteCompanyInput.tsx";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { DEAL_PIPELINES, type DealPipeline } from "../types";
import { LineItemsInput } from "./LineItemsInput";
import { getPipelineStages } from "./pipelines";

export const DealInputs = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col gap-8">
      <DealInfoInputs />

      <div className={`flex gap-6 ${isMobile ? "flex-col" : "flex-row"}`}>
        <DealLinkedToInputs />
        <Separator orientation={isMobile ? "horizontal" : "vertical"} />
        <DealMiscInputs />
      </div>

      <Separator />
      <LineItemsInput />
    </div>
  );
};

const DealInfoInputs = () => {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <TextInput source="name" validate={required()} helperText={false} />
      <TextInput source="description" multiline rows={3} helperText={false} />
    </div>
  );
};

const DealLinkedToInputs = () => {
  const translate = useTranslate();
  return (
    <div className="flex flex-col gap-4 flex-1">
      <h3 className="text-base font-medium">
        {translate("resources.deals.inputs.linked_to")}
      </h3>
      <ReferenceInput source="company_id" reference="companies">
        <AutocompleteCompanyInput
          label="resources.deals.fields.company_id"
          validate={required()}
          modal
        />
      </ReferenceInput>

      <ReferenceInput source="project_id" reference="projects">
        <AutocompleteInput
          label="resources.deals.fields.project_id"
          helperText={false}
          clearable
          modal
        />
      </ReferenceInput>

      <ReferenceArrayInput source="contact_ids" reference="contacts_summary">
        <AutocompleteArrayInput
          label="resources.deals.fields.contact_ids"
          optionText={contactOptionText}
          helperText={false}
        />
      </ReferenceArrayInput>
    </div>
  );
};

const pipelineChoices = DEAL_PIPELINES.map((pipeline) => ({
  id: pipeline,
  name: `resources.deals.pipelines.${pipeline}`,
}));

const DealMiscInputs = () => {
  const config = useConfigurationContext();
  const translate = useTranslate();
  const { setValue, getValues } = useFormContext();
  const pipeline = useWatch({ name: "pipeline" }) as DealPipeline | undefined;
  const stages = getPipelineStages(config, pipeline);

  // A stage only makes sense inside its pipeline
  useEffect(() => {
    const stage = getValues("stage");
    if (stages.length && !stages.some(({ value }) => value === stage)) {
      setValue("stage", stages[0].value, { shouldDirty: true });
    }
  }, [stages, getValues, setValue]);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <h3 className="text-base font-medium">
        {translate("resources.deals.field_categories.misc")}
      </h3>

      <SelectInput
        source="category"
        choices={config.dealCategories}
        optionText="label"
        optionValue="value"
        helperText={false}
      />
      <NumberInput
        source="amount"
        defaultValue={0}
        helperText={false}
        validate={required()}
      />
      <DateInput
        validate={required()}
        source="expected_closing_date"
        helperText={false}
        defaultValue={new Date().toISOString().split("T")[0]}
      />
      <SelectInput
        source="pipeline"
        choices={pipelineChoices}
        defaultValue="tender"
        helperText={false}
        validate={required()}
      />
      <SelectInput
        source="stage"
        choices={stages}
        optionText="label"
        optionValue="value"
        defaultValue={stages[0]?.value}
        helperText={false}
        validate={required()}
      />
    </div>
  );
};
