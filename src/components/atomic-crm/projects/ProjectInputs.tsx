import { required } from "ra-core";
import { NumberInput } from "@/components/admin/number-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Sale } from "../types";

const saleOptionRenderer = (choice: Sale) =>
  `${choice.first_name} ${choice.last_name}`;

export const ProjectInputs = () => {
  const { companySectors } = useConfigurationContext();
  return (
    <div className="flex flex-col gap-4">
      <TextInput source="name" validate={required()} helperText={false} />
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput source="end_client" helperText={false} />
        <TextInput source="consultant" helperText={false} />
        <TextInput source="location" helperText={false} />
        <SelectInput
          source="sector"
          choices={companySectors}
          optionText="label"
          optionValue="value"
          helperText={false}
        />
        <NumberInput source="estimated_value" helperText={false} />
        <ReferenceInput
          source="sales_id"
          reference="sales"
          filter={{ "disabled@neq": true }}
        >
          <SelectInput
            label="resources.projects.fields.sales_id"
            helperText={false}
            optionText={saleOptionRenderer}
            validate={required()}
          />
        </ReferenceInput>
      </div>
      <TextInput source="description" multiline rows={3} helperText={false} />
    </div>
  );
};
