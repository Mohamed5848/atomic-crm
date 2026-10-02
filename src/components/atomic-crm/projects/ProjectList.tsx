import { useRecordContext } from "ra-core";
import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { ReferenceField } from "@/components/admin/reference-field";
import { SearchInput } from "@/components/admin/search-input";
import { SelectField } from "@/components/admin/select-field";

import { TopToolbar } from "../layout/TopToolbar";
import { formatCompactMoney } from "../misc/formatMoney";
import { useConfigurationContext } from "../root/ConfigurationContext";
import { AccountManagerInput } from "../sales/AccountManagerInput";
import type { Project } from "../types";

const filters = [
  <SearchInput source="q" alwaysOn />,
  <AccountManagerInput source="sales_id" alwaysOn />,
];

const ProjectListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="resources.projects.action.new" />
  </TopToolbar>
);

const EstimatedValueField = (_props: { label?: string }) => {
  const record = useRecordContext<Project>();
  const { currency } = useConfigurationContext();
  if (!record) return null;
  return <span>{formatCompactMoney(record.estimated_value, currency)}</span>;
};

const SectorField = (_props: { label?: string }) => {
  const { companySectors } = useConfigurationContext();
  return (
    <SelectField
      source="sector"
      choices={companySectors}
      optionText="label"
      optionValue="value"
    />
  );
};

const ProjectList = () => (
  <List
    filters={filters}
    actions={<ProjectListActions />}
    sort={{ field: "created_at", order: "DESC" }}
    perPage={25}
  >
    <DataTable rowClick="show">
      <DataTable.Col source="name" />
      <DataTable.Col source="end_client" />
      <DataTable.Col source="consultant" />
      <DataTable.Col source="location" />
      <DataTable.Col source="sector">
        <SectorField />
      </DataTable.Col>
      <DataTable.Col source="estimated_value">
        <EstimatedValueField />
      </DataTable.Col>
      <DataTable.Col source="sales_id">
        <ReferenceField source="sales_id" reference="sales" link={false} />
      </DataTable.Col>
    </DataTable>
  </List>
);

export default ProjectList;
